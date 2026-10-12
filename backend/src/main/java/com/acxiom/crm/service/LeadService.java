package com.acxiom.crm.service;

import com.acxiom.crm.dto.LeadRequest;
import com.acxiom.crm.dto.LeadResponse;
import com.acxiom.crm.entity.Lead;
import com.acxiom.crm.entity.LeadPriority;
import com.acxiom.crm.entity.LeadSource;
import com.acxiom.crm.entity.LeadStatus;
import com.acxiom.crm.exception.ResourceNotFoundException;
import com.acxiom.crm.repository.LeadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Service encapsulating Lead lifecycle, validation, code generation, and query handling.
 */
@Service
@Transactional
public class LeadService {

    private static final Logger log = LoggerFactory.getLogger(LeadService.class);

    private final LeadRepository leadRepository;

    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    /**
     * Retrieve leads with optional keyword search and status filtering.
     */
    @Transactional(readOnly = true)
    public List<LeadResponse> getAllLeads(String search, LeadStatus status) {
        boolean hasSearch = search != null && !search.trim().isEmpty();

        List<Lead> leads;
        if (!hasSearch && status == null) {
            leads = leadRepository.findAllByOrderByCreatedAtDesc();
        } else if (!hasSearch) {
            leads = leadRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            leads = leadRepository.searchLeads(search.trim(), status);
        }

        return leads.stream()
                .map(LeadResponse::fromEntity)
                .toList();
    }

    /**
     * Retrieve single lead by ID.
     */
    @Transactional(readOnly = true)
    public LeadResponse getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        return LeadResponse.fromEntity(lead);
    }

    /**
     * Create a new Lead with safe auto-generated leadCode.
     */
    public LeadResponse createLead(LeadRequest request) {
        String leadCode = generateUniqueLeadCode();

        Lead lead = new Lead();
        lead.setLeadCode(leadCode);
        lead.setLeadName(request.getLeadName().trim());
        lead.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail().trim().toLowerCase() : null);
        lead.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : null);
        lead.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : null);
        lead.setSource(request.getSource() != null ? request.getSource() : LeadSource.OTHER);
        lead.setStatus(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW);
        lead.setPriority(request.getPriority() != null ? request.getPriority() : LeadPriority.MEDIUM);
        lead.setExpectedValue(request.getExpectedValue() != null ? request.getExpectedValue() : BigDecimal.ZERO);
        lead.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);
        lead.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Lead saved = leadRepository.save(lead);
        log.info("Created new lead id={} code={}", saved.getId(), saved.getLeadCode());
        return LeadResponse.fromEntity(saved);
    }

    /**
     * Update an existing Lead.
     */
    public LeadResponse updateLead(Long id, LeadRequest request) {
        Lead existing = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        existing.setLeadName(request.getLeadName().trim());
        existing.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail().trim().toLowerCase() : null);
        existing.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : null);
        existing.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : null);

        if (request.getSource() != null) {
            existing.setSource(request.getSource());
        }
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            existing.setPriority(request.getPriority());
        }
        if (request.getExpectedValue() != null) {
            existing.setExpectedValue(request.getExpectedValue());
        }
        existing.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);
        existing.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Lead updated = leadRepository.save(existing);
        log.info("Updated lead id={} code={}", updated.getId(), updated.getLeadCode());
        return LeadResponse.fromEntity(updated);
    }

    /**
     * Deactivate a lead by transitioning status to LOST.
     */
    public LeadResponse deactivateLead(Long id) {
        Lead existing = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        existing.setStatus(LeadStatus.LOST);
        Lead updated = leadRepository.save(existing);
        log.info("Deactivated lead id={} to status LOST", id);
        return LeadResponse.fromEntity(updated);
    }

    /**
     * Permanently delete a lead.
     */
    public void deleteLead(Long id) {
        Lead existing = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        leadRepository.delete(existing);
        log.info("Deleted lead id={}", id);
    }

    /**
     * Generate unique enterprise lead code (LEAD-XXXXXX).
     */
    private String generateUniqueLeadCode() {
        int maxAttempts = 10;
        for (int i = 0; i < maxAttempts; i++) {
            int randomNum = ThreadLocalRandom.current().nextInt(100000, 999999);
            String candidate = "LEAD-" + randomNum;
            if (!leadRepository.existsByLeadCode(candidate)) {
                return candidate;
            }
        }
        return "LEAD-" + (Instant.now().toEpochMilli() % 100000000);
    }
}
