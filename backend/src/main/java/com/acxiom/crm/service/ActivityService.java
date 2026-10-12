package com.acxiom.crm.service;

import com.acxiom.crm.dto.ActivityRequest;
import com.acxiom.crm.dto.ActivityResponse;
import com.acxiom.crm.entity.*;
import com.acxiom.crm.exception.ResourceNotFoundException;
import com.acxiom.crm.repository.ActivityRepository;
import com.acxiom.crm.repository.CustomerRepository;
import com.acxiom.crm.repository.LeadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ActivityService {

    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public ActivityService(ActivityRepository activityRepository,
                           CustomerRepository customerRepository,
                           LeadRepository leadRepository) {
        this.activityRepository = activityRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getAllActivities(String search, ActivityType type, Long customerId, Long leadId) {
        boolean hasSearch = search != null && !search.trim().isEmpty();

        List<Activity> list;
        if (!hasSearch && type == null && customerId == null && leadId == null) {
            list = activityRepository.findAllByOrderByActivityDateDescCreatedAtDesc();
        } else {
            list = activityRepository.searchActivities(
                    hasSearch ? search.trim() : null,
                    type,
                    customerId,
                    leadId
            );
        }

        return list.stream()
                .map(ActivityResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ActivityResponse getActivityById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", id));
        return ActivityResponse.fromEntity(activity);
    }

    public ActivityResponse createActivity(ActivityRequest request) {
        if (request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject is required");
        }
        if (request.getActivityDate() == null) {
            throw new IllegalArgumentException("Activity date is required");
        }
        if (request.getActivityType() == null) {
            throw new IllegalArgumentException("Activity type is required");
        }

        Customer customer = resolveCustomer(request.getCustomerId());
        Lead lead = resolveLead(request.getLeadId());

        Activity activity = new Activity();
        activity.setActivityType(request.getActivityType());
        activity.setSubject(request.getSubject().trim());
        activity.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        activity.setActivityDate(request.getActivityDate());
        activity.setCustomer(customer);
        activity.setLead(lead);
        activity.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);
        activity.setStatus(request.getStatus() != null ? request.getStatus() : ActivityStatus.COMPLETED);

        Activity saved = activityRepository.save(activity);
        log.info("Created activity id={} of type={}", saved.getId(), saved.getActivityType());
        return ActivityResponse.fromEntity(saved);
    }

    public ActivityResponse updateActivity(Long id, ActivityRequest request) {
        Activity existing = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", id));

        if (request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject is required");
        }

        Customer customer = resolveCustomer(request.getCustomerId());
        Lead lead = resolveLead(request.getLeadId());

        existing.setActivityType(request.getActivityType() != null ? request.getActivityType() : existing.getActivityType());
        existing.setSubject(request.getSubject().trim());
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        if (request.getActivityDate() != null) {
            existing.setActivityDate(request.getActivityDate());
        }
        existing.setCustomer(customer);
        existing.setLead(lead);
        existing.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo().trim() : null);
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        Activity saved = activityRepository.save(existing);
        log.info("Updated activity id={}", saved.getId());
        return ActivityResponse.fromEntity(saved);
    }

    public void deleteActivity(Long id) {
        Activity existing = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", id));
        activityRepository.delete(existing);
        log.info("Deleted activity id={}", id);
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
