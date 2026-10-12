package com.acxiom.crm.dto;

import com.acxiom.crm.entity.Lead;
import com.acxiom.crm.entity.LeadPriority;
import com.acxiom.crm.entity.LeadSource;
import com.acxiom.crm.entity.LeadStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Lead details exposed in API responses.
 */
public class LeadResponse {

    private Long id;
    private String leadCode;
    private String leadName;
    private String email;
    private String phone;
    private String companyName;
    private LeadSource source;
    private LeadStatus status;
    private LeadPriority priority;
    private BigDecimal expectedValue;
    private String assignedTo;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LeadResponse() {
    }

    public LeadResponse(Long id, String leadCode, String leadName, String email, String phone,
                        String companyName, LeadSource source, LeadStatus status,
                        LeadPriority priority, BigDecimal expectedValue, String assignedTo,
                        String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.leadCode = leadCode;
        this.leadName = leadName;
        this.email = email;
        this.phone = phone;
        this.companyName = companyName;
        this.source = source;
        this.status = status;
        this.priority = priority;
        this.expectedValue = expectedValue;
        this.assignedTo = assignedTo;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static LeadResponse fromEntity(Lead lead) {
        if (lead == null) {
            return null;
        }
        return new LeadResponse(
                lead.getId(),
                lead.getLeadCode(),
                lead.getLeadName(),
                lead.getEmail(),
                lead.getPhone(),
                lead.getCompanyName(),
                lead.getSource(),
                lead.getStatus(),
                lead.getPriority(),
                lead.getExpectedValue(),
                lead.getAssignedTo(),
                lead.getNotes(),
                lead.getCreatedAt(),
                lead.getUpdatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLeadCode() {
        return leadCode;
    }

    public void setLeadCode(String leadCode) {
        this.leadCode = leadCode;
    }

    public String getLeadName() {
        return leadName;
    }

    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public LeadSource getSource() {
        return source;
    }

    public void setSource(LeadSource source) {
        this.source = source;
    }

    public LeadStatus getStatus() {
        return status;
    }

    public void setStatus(LeadStatus status) {
        this.status = status;
    }

    public LeadPriority getPriority() {
        return priority;
    }

    public void setPriority(LeadPriority priority) {
        this.priority = priority;
    }

    public BigDecimal getExpectedValue() {
        return expectedValue;
    }

    public void setExpectedValue(BigDecimal expectedValue) {
        this.expectedValue = expectedValue;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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
