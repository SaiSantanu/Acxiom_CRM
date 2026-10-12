package com.acxiom.crm.dto;

import com.acxiom.crm.entity.ActivityStatus;
import com.acxiom.crm.entity.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class ActivityRequest {

    @NotNull(message = "Activity type is required")
    private ActivityType activityType;

    @NotBlank(message = "Subject is required")
    @Size(max = 150, message = "Subject cannot exceed 150 characters")
    private String subject;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Activity date is required")
    private LocalDate activityDate;

    private Long customerId;
    private Long leadId;

    @Size(max = 100, message = "Assigned user cannot exceed 100 characters")
    private String assignedTo;

    private ActivityStatus status;

    public ActivityRequest() {
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public ActivityStatus getStatus() {
        return status;
    }

    public void setStatus(ActivityStatus status) {
        this.status = status;
    }
}
