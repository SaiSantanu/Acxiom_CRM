package com.acxiom.crm.dto;

import com.acxiom.crm.entity.Activity;
import com.acxiom.crm.entity.ActivityStatus;
import com.acxiom.crm.entity.ActivityType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ActivityResponse {

    private Long id;
    private ActivityType activityType;
    private String subject;
    private String description;
    private LocalDate activityDate;
    private Long customerId;
    private String customerName;
    private String customerCode;
    private Long leadId;
    private String leadName;
    private String leadCode;
    private String assignedTo;
    private ActivityStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ActivityResponse() {
    }

    public static ActivityResponse fromEntity(Activity a) {
        if (a == null) return null;
        ActivityResponse res = new ActivityResponse();
        res.setId(a.getId());
        res.setActivityType(a.getActivityType());
        res.setSubject(a.getSubject());
        res.setDescription(a.getDescription());
        res.setActivityDate(a.getActivityDate());

        if (a.getCustomer() != null) {
            res.setCustomerId(a.getCustomer().getId());
            res.setCustomerName(a.getCustomer().getCustomerName());
            res.setCustomerCode(a.getCustomer().getCustomerCode());
        }

        if (a.getLead() != null) {
            res.setLeadId(a.getLead().getId());
            res.setLeadName(a.getLead().getLeadName());
            res.setLeadCode(a.getLead().getLeadCode());
        }

        res.setAssignedTo(a.getAssignedTo());
        res.setStatus(a.getStatus());
        res.setCreatedAt(a.getCreatedAt());
        res.setUpdatedAt(a.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
