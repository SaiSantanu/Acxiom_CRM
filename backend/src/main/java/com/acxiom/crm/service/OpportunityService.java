package com.acxiom.crm.service;

import com.acxiom.crm.dto.OpportunityRequest;
import com.acxiom.crm.dto.OpportunityResponse;
import com.acxiom.crm.dto.PipelineSummaryResponse;
import com.acxiom.crm.entity.*;
import com.acxiom.crm.exception.ResourceNotFoundException;
import com.acxiom.crm.repository.CustomerRepository;
import com.acxiom.crm.repository.LeadRepository;
import com.acxiom.crm.repository.OpportunityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Service orchestrating Opportunity lifecycle, business rules, calculations, and persistence.
 */
@Service
@Transactional
public class OpportunityService {

    private static final Logger log = LoggerFactory.getLogger(OpportunityService.class);

    private final OpportunityRepository opportunityRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public OpportunityService(OpportunityRepository opportunityRepository,
                              CustomerRepository customerRepository,
                              LeadRepository leadRepository) {
        this.opportunityRepository = opportunityRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    /**
     * Retrieve opportunities matching optional search query, stage, status, or customer filter.
     */
    @Transactional(readOnly = true)
    public List<OpportunityResponse> getAllOpportunities(String search,
                                                        OpportunityStage stage,
                                                        OpportunityStatus status,
                                                        Long customerId) {
        boolean hasSearch = search != null && !search.trim().isEmpty();

        List<Opportunity> opportunities;
        if (!hasSearch && stage == null && status == null && customerId == null) {
            opportunities = opportunityRepository.findAllByOrderByCreatedAtDesc();
        } else {
            opportunities = opportunityRepository.searchOpportunities(
                    hasSearch ? search.trim() : null,
                    stage,
                    status,
                    customerId
            );
        }

        return opportunities.stream()
                .map(OpportunityResponse::fromEntity)
                .toList();
    }

    /**
     * Retrieve single opportunity by ID.
     */
    @Transactional(readOnly = true)
    public OpportunityResponse getOpportunityById(Long id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity", "id", id));
        return OpportunityResponse.fromEntity(opp);
    }

    /**
     * Create a new Opportunity applying all business validation rules.
     */
    public OpportunityResponse createOpportunity(OpportunityRequest request) {
        validateBusinessRules(request, null);

        Customer customer = resolveCustomer(request.getCustomerId());
        Lead lead = resolveLead(request.getLeadId());

        String oppCode = generateUniqueOpportunityCode();

        Opportunity opp = new Opportunity();
        opp.setOpportunityCode(oppCode);
        opp.setOpportunityName(request.getOpportunityName().trim());
        opp.setCustomer(customer);
        opp.setLead(lead);
        opp.setAmount(request.getAmount());
        opp.setStage(request.getStage());
        opp.setProbability(adjustProbabilityForStage(request.getStage(), request.getProbability()));
        opp.setExpectedCloseDate(request.getExpectedCloseDate());
        opp.setSource(request.getSource() != null ? request.getSource().trim() : null);
        opp.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);
        opp.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        opp.syncStatusWithStage();

        Opportunity saved = opportunityRepository.save(opp);
        log.info("Created opportunity id={} code={} name='{}'", saved.getId(), saved.getOpportunityCode(), saved.getOpportunityName());
        return OpportunityResponse.fromEntity(saved);
    }

    /**
     * Update an existing Opportunity applying business validation rules.
     */
    public OpportunityResponse updateOpportunity(Long id, OpportunityRequest request) {
        Opportunity existing = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity", "id", id));

        validateBusinessRules(request, existing);

        Customer customer = resolveCustomer(request.getCustomerId());
        Lead lead = resolveLead(request.getLeadId());

        existing.setOpportunityName(request.getOpportunityName().trim());
        existing.setCustomer(customer);
        existing.setLead(lead);
        existing.setAmount(request.getAmount());
        existing.setStage(request.getStage());
        existing.setProbability(adjustProbabilityForStage(request.getStage(), request.getProbability()));
        existing.setExpectedCloseDate(request.getExpectedCloseDate());
        existing.setSource(request.getSource() != null ? request.getSource().trim() : null);
        existing.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);
        existing.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        existing.syncStatusWithStage();

        Opportunity saved = opportunityRepository.save(existing);
        log.info("Updated opportunity id={} code={}", saved.getId(), saved.getOpportunityCode());
        return OpportunityResponse.fromEntity(saved);
    }

    /**
     * Delete or deactivate opportunity.
     */
    public OpportunityResponse deleteOpportunity(Long id, boolean permanent) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity", "id", id));

        if (permanent) {
            opportunityRepository.delete(opp);
            log.info("Permanently deleted opportunity id={}", id);
            return null;
        } else {
            // Soft deactivate: transition to LOST
            opp.setStage(OpportunityStage.LOST);
            opp.setStatus(OpportunityStatus.LOST);
            opp.setProbability(0);
            Opportunity updated = opportunityRepository.save(opp);
            log.info("Deactivated opportunity id={} (marked as LOST)", id);
            return OpportunityResponse.fromEntity(updated);
        }
    }

    /**
     * Compute pipeline summary metrics.
     * Open pipeline includes ONLY eligible OPEN opportunities (excludes WON and LOST).
     * Weighted value = amount * probability / 100.
     */
    @Transactional(readOnly = true)
    public PipelineSummaryResponse getPipelineSummary() {
        List<Opportunity> all = opportunityRepository.findAll();

        long total = all.size();
        long openCount = 0;
        long wonCount = 0;
        long lostCount = 0;

        BigDecimal totalOpenPipeline = BigDecimal.ZERO;
        BigDecimal weightedOpenPipeline = BigDecimal.ZERO;
        BigDecimal totalWonRevenue = BigDecimal.ZERO;
        BigDecimal totalLostValue = BigDecimal.ZERO;

        for (Opportunity opp : all) {
            BigDecimal amt = opp.getAmount() != null ? opp.getAmount() : BigDecimal.ZERO;

            if (opp.getStatus() == OpportunityStatus.OPEN) {
                openCount++;
                totalOpenPipeline = totalOpenPipeline.add(amt);

                int prob = opp.getProbability() != null ? opp.getProbability() : 0;
                BigDecimal weighted = amt.multiply(BigDecimal.valueOf(prob))
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                weightedOpenPipeline = weightedOpenPipeline.add(weighted);
            } else if (opp.getStatus() == OpportunityStatus.WON) {
                wonCount++;
                totalWonRevenue = totalWonRevenue.add(amt);
            } else if (opp.getStatus() == OpportunityStatus.LOST) {
                lostCount++;
                totalLostValue = totalLostValue.add(amt);
            }
        }

        return new PipelineSummaryResponse(
                total,
                openCount,
                wonCount,
                lostCount,
                totalOpenPipeline,
                weightedOpenPipeline,
                totalWonRevenue,
                totalLostValue
        );
    }

    /**
     * Validate business constraints according to domain rules:
     * - Name is required
     * - Amount must be > 0 for active opportunity
     * - Probability between 0 and 100
     * - Expected close date cannot be in the past for an active/open opportunity
     */
    private void validateBusinessRules(OpportunityRequest req, Opportunity existing) {
        if (req.getOpportunityName() == null || req.getOpportunityName().trim().isEmpty()) {
            throw new IllegalArgumentException("Opportunity name is required");
        }

        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero for an active opportunity");
        }

        if (req.getProbability() == null || req.getProbability() < 0 || req.getProbability() > 100) {
            throw new IllegalArgumentException("Probability must be between 0 and 100 inclusive");
        }

        if (req.getStage() == null) {
            throw new IllegalArgumentException("Stage is required");
        }

        // Active opportunities: stage is QUALIFICATION, PROPOSAL, or NEGOTIATION
        boolean isActive = req.getStage() != OpportunityStage.WON && req.getStage() != OpportunityStage.LOST;
        if (isActive && req.getExpectedCloseDate() != null) {
            if (req.getExpectedCloseDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Expected close date cannot be in the past for an active opportunity");
            }
        }
    }

    /**
     * Auto-adjust probability defaults for Won/Lost if user entered mismatched values.
     */
    private Integer adjustProbabilityForStage(OpportunityStage stage, Integer requestedProb) {
        if (stage == OpportunityStage.WON) {
            return 100;
        }
        if (stage == OpportunityStage.LOST) {
            return 0;
        }
        return requestedProb != null ? requestedProb : 20;
    }

    private Customer resolveCustomer(Long customerId) {
        if (customerId == null) {
            return null;
        }
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));
    }

    private Lead resolveLead(Long leadId) {
        if (leadId == null) {
            return null;
        }
        return leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));
    }

    private String generateUniqueOpportunityCode() {
        String code;
        int attempts = 0;
        do {
            int randomNum = ThreadLocalRandom.current().nextInt(100000, 999999);
            code = "OPP-" + randomNum;
            attempts++;
            if (attempts > 50) {
                code = "OPP-" + System.currentTimeMillis() % 1000000;
                break;
            }
        } while (opportunityRepository.existsByOpportunityCode(code));
        return code;
    }
}
