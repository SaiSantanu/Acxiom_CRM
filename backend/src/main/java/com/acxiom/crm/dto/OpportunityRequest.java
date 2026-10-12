package com.acxiom.crm.dto;

import com.acxiom.crm.entity.OpportunityStage;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for creating or updating an Opportunity.
 */
public class OpportunityRequest {

    @NotBlank(message = "Opportunity name is required")
    @Size(max = 150, message = "Opportunity name cannot exceed 150 characters")
    private String opportunityName;

    private Long customerId;

    private Long leadId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Stage is required")
    private OpportunityStage stage;

    @NotNull(message = "Probability is required")
    @Min(value = 0, message = "Probability must be between 0 and 100 inclusive")
    @Max(value = 100, message = "Probability must be between 0 and 100 inclusive")
    private Integer probability;

    private LocalDate expectedCloseDate;

    @Size(max = 50, message = "Source cannot exceed 50 characters")
    private String source;

    @Size(max = 100, message = "Assigned user cannot exceed 100 characters")
    private String assignedTo;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    public OpportunityRequest() {
    }

    public OpportunityRequest(String opportunityName, Long customerId, Long leadId,
                              BigDecimal amount, OpportunityStage stage, Integer probability,
                              LocalDate expectedCloseDate, String source, String assignedTo, String notes) {
        this.opportunityName = opportunityName;
        this.customerId = customerId;
        this.leadId = leadId;
        this.amount = amount;
        this.stage = stage;
        this.probability = probability;
        this.expectedCloseDate = expectedCloseDate;
        this.source = source;
        this.assignedTo = assignedTo;
        this.notes = notes;
    }

    // Getters and Setters
    public String getOpportunityName() {
        return opportunityName;
    }

    public void setOpportunityName(String opportunityName) {
        this.opportunityName = opportunityName;
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public OpportunityStage getStage() {
        return stage;
    }

    public void setStage(OpportunityStage stage) {
        this.stage = stage;
    }

    public Integer getProbability() {
        return probability;
    }

    public void setProbability(Integer probability) {
        this.probability = probability;
    }

    public LocalDate getExpectedCloseDate() {
        return expectedCloseDate;
    }

    public void setExpectedCloseDate(LocalDate expectedCloseDate) {
        this.expectedCloseDate = expectedCloseDate;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
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
