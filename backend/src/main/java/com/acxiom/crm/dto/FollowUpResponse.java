package com.acxiom.crm.dto;

import com.acxiom.crm.entity.FollowUp;
import com.acxiom.crm.entity.FollowUpStatus;
import com.acxiom.crm.entity.FollowUpType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FollowUpResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private String customerCode;
    private Long leadId;
    private String leadName;
    private String leadCode;
    private LocalDate followUpDate;
    private FollowUpType followUpType;
    private String subject;
    private String remarks;
    private FollowUpStatus status;
    private String assignedTo;
    private boolean isOverdue;
    private boolean isUpcoming;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FollowUpResponse() {
    }

    public static FollowUpResponse fromEntity(FollowUp f) {
        if (f == null) return null;
        FollowUpResponse res = new FollowUpResponse();
        res.setId(f.getId());

        if (f.getCustomer() != null) {
            res.setCustomerId(f.getCustomer().getId());
            res.setCustomerName(f.getCustomer().getCustomerName());
            res.setCustomerCode(f.getCustomer().getCustomerCode());
        }

        if (f.getLead() != null) {
            res.setLeadId(f.getLead().getId());
            res.setLeadName(f.getLead().getLeadName());
            res.setLeadCode(f.getLead().getLeadCode());
        }

        res.setFollowUpDate(f.getFollowUpDate());
        res.setFollowUpType(f.getFollowUpType());
        res.setSubject(f.getSubject());
        res.setRemarks(f.getRemarks());
        res.setStatus(f.getStatus());
        res.setAssignedTo(f.getAssignedTo());

        LocalDate today = LocalDate.now();
        if (f.getStatus() == FollowUpStatus.PLANNED) {
            res.setOverdue(f.getFollowUpDate().isBefore(today));
            res.setUpcoming(!f.getFollowUpDate().isBefore(today));
        } else {
            res.setOverdue(false);
            res.setUpcoming(false);
        }

        res.setCreatedAt(f.getCreatedAt());
        res.setUpdatedAt(f.getUpdatedAt());
        return res;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public String getLeadName() {
        return leadName;
    }

    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }

    public String getLeadCode() {
        return leadCode;
    }

    public void setLeadCode(String leadCode) {
        this.leadCode = leadCode;
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

    public boolean isOverdue() {
        return isOverdue;
    }

    public void setOverdue(boolean overdue) {
        isOverdue = overdue;
    }

    public boolean isUpcoming() {
        return isUpcoming;
    }

    public void setUpcoming(boolean upcoming) {
        isUpcoming = upcoming;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
