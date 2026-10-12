package com.acxiom.crm.service;

import com.acxiom.crm.dto.FollowUpRequest;
import com.acxiom.crm.dto.FollowUpResponse;
import com.acxiom.crm.entity.*;
import com.acxiom.crm.exception.ResourceNotFoundException;
import com.acxiom.crm.repository.CustomerRepository;
import com.acxiom.crm.repository.FollowUpRepository;
import com.acxiom.crm.repository.LeadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class FollowUpService {

    private static final Logger log = LoggerFactory.getLogger(FollowUpService.class);

    private final FollowUpRepository followUpRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public FollowUpService(FollowUpRepository followUpRepository,
                           CustomerRepository customerRepository,
                           LeadRepository leadRepository) {
        this.followUpRepository = followUpRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    @Transactional(readOnly = true)
    public List<FollowUpResponse> getAllFollowUps(String search, FollowUpStatus status,
                                                  LocalDate fromDate, LocalDate toDate,
                                                  Long customerId, Long leadId) {
        boolean hasSearch = search != null && !search.trim().isEmpty();

        List<FollowUp> list;
        if (!hasSearch && status == null && fromDate == null && toDate == null && customerId == null && leadId == null) {
            list = followUpRepository.findAllByOrderByFollowUpDateAscCreatedAtDesc();
        } else {
            list = followUpRepository.searchFollowUps(
                    hasSearch ? search.trim() : null,
                    status,
                    fromDate,
                    toDate,
                    customerId,
                    leadId
            );
        }

        return list.stream()
                .map(FollowUpResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public FollowUpResponse getFollowUpById(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));
        return FollowUpResponse.fromEntity(followUp);
    }

    public FollowUpResponse createFollowUp(FollowUpRequest request) {
        validateFollowUp(request, true);

        Customer customer = resolveCustomer(request.getCustomerId());
        Lead lead = resolveLead(request.getLeadId());

        FollowUp followUp = new FollowUp();
        followUp.setCustomer(customer);
        followUp.setLead(lead);
        followUp.setFollowUpDate(request.getFollowUpDate());
        followUp.setFollowUpType(request.getFollowUpType() != null ? request.getFollowUpType() : FollowUpType.CALL);
        followUp.setSubject(request.getSubject().trim());
        followUp.setRemarks(request.getRemarks() != null ? request.getRemarks().trim() : null);
        followUp.setStatus(request.getStatus() != null ? request.getStatus() : FollowUpStatus.PLANNED);
        followUp.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);

        FollowUp saved = followUpRepository.save(followUp);
        log.info("Created follow-up id={} on date={}", saved.getId(), saved.getFollowUpDate());
        return FollowUpResponse.fromEntity(saved);
    }

    public FollowUpResponse updateFollowUp(Long id, FollowUpRequest request) {
        FollowUp existing = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));

        validateFollowUp(request, false);

        Customer customer = resolveCustomer(request.getCustomerId());
        Lead lead = resolveLead(request.getLeadId());

        existing.setCustomer(customer);
        existing.setLead(lead);
        existing.setFollowUpDate(request.getFollowUpDate());
        existing.setFollowUpType(request.getFollowUpType() != null ? request.getFollowUpType() : existing.getFollowUpType());
        existing.setSubject(request.getSubject().trim());
        existing.setRemarks(request.getRemarks() != null ? request.getRemarks().trim() : null);
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }
        existing.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);

        FollowUp saved = followUpRepository.save(existing);
        log.info("Updated follow-up id={}", saved.getId());
        return FollowUpResponse.fromEntity(saved);
    }

    public FollowUpResponse completeFollowUp(Long id, String remarks) {
        FollowUp existing = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));

        existing.setStatus(FollowUpStatus.COMPLETED);
        if (remarks != null && !remarks.trim().isEmpty()) {
            existing.setRemarks((existing.getRemarks() != null ? existing.getRemarks() + " | " : "") + remarks.trim());
        }

        FollowUp saved = followUpRepository.save(existing);
        log.info("Marked follow-up id={} as COMPLETED", saved.getId());
        return FollowUpResponse.fromEntity(saved);
    }

    public void deleteFollowUp(Long id) {
        FollowUp existing = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));
        followUpRepository.delete(existing);
        log.info("Deleted follow-up id={}", id);
    }

    private void validateFollowUp(FollowUpRequest req, boolean isCreate) {
        if (req.getSubject() == null || req.getSubject().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject is required");
        }

        if (req.getFollowUpDate() == null) {
            throw new IllegalArgumentException("Follow-up date is required");
        }

        // Must relate to either customer or lead
        if (req.getCustomerId() == null && req.getLeadId() == null) {
            throw new IllegalArgumentException("A follow-up must be associated with a Customer or a Lead");
        }

        // New planned follow-up cannot be dated before today
        if (isCreate && (req.getStatus() == null || req.getStatus() == FollowUpStatus.PLANNED)) {
            if (req.getFollowUpDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("A new planned follow-up cannot be dated before today");
            }
        }
    }

    private Customer resolveCustomer(Long customerId) {
        if (customerId == null) return null;
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));
    }

    private Lead resolveLead(Long leadId) {
        if (leadId == null) return null;
        return leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));
    }
}
