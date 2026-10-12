package com.acxiom.crm.dto;

import com.acxiom.crm.entity.FollowUpStatus;
import com.acxiom.crm.entity.FollowUpType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class FollowUpRequest {

    private Long customerId;
    private Long leadId;

    @NotNull(message = "Follow-up date is required")
    private LocalDate followUpDate;

    @NotNull(message = "Follow-up type is required")
    private FollowUpType followUpType;

    @NotBlank(message = "Subject is required")
    @Size(max = 150, message = "Subject cannot exceed 150 characters")
    private String subject;

    @Size(max = 1000, message = "Remarks cannot exceed 1000 characters")
    private String remarks;

    private FollowUpStatus status;

    @Size(max = 100, message = "Assigned representative cannot exceed 100 characters")
    private String assignedTo;

    public FollowUpRequest() {
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

    public LocalDate getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(LocalDate followUpDate) {
        this.followUpDate = followUpDate;
    }

    public FollowUpType getFollowUpType() {
        return followUpType;
    }

    public void setFollowUpType(FollowUpType followUpType) {
        this.followUpType = followUpType;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public FollowUpStatus getStatus() {
        return status;
    }

    public void setStatus(FollowUpStatus status) {
        this.status = status;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }
}
