package com.acxiom.crm.dto;

import com.acxiom.crm.entity.LeadPriority;
import com.acxiom.crm.entity.LeadSource;
import com.acxiom.crm.entity.LeadStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Data Transfer Object for creating or updating a Lead.
 */
public class LeadRequest {

    @NotBlank(message = "Lead name is required")
    @Size(max = 150, message = "Lead name cannot exceed 150 characters")
    private String leadName;

    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @Pattern(regexp = "^$|^[0-9+()\\s-]{7,20}$", message = "Please provide a valid phone number (7-20 digits)")
    private String phone;

    @Size(max = 150, message = "Company name cannot exceed 150 characters")
    private String companyName;

    private LeadSource source;

    private LeadStatus status;

    private LeadPriority priority;

    @DecimalMin(value = "0.0", message = "Expected value cannot be negative")
    private BigDecimal expectedValue;

    @Size(max = 100, message = "Assigned user cannot exceed 100 characters")
    private String assignedTo;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    public LeadRequest() {
    }

    public LeadRequest(String leadName, String email, String phone, String companyName,
                       LeadSource source, LeadStatus status, LeadPriority priority,
                       BigDecimal expectedValue, String assignedTo, String notes) {
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
    }

    // Getters and Setters
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
}
