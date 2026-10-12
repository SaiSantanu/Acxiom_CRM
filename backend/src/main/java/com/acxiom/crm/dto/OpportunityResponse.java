package com.acxiom.crm.dto;

import com.acxiom.crm.entity.Opportunity;
import com.acxiom.crm.entity.OpportunityStage;
import com.acxiom.crm.entity.OpportunityStatus;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Opportunity API responses with safe flattened relationships.
 */
public class OpportunityResponse {

    private Long id;
    private String opportunityCode;
    private String opportunityName;

    // Flattened Customer relationship
    private Long customerId;
    private String customerName;
    private String customerCode;

    // Flattened Lead relationship
    private Long leadId;
    private String leadName;
    private String leadCode;

    private BigDecimal amount;
    private OpportunityStage stage;
    private Integer probability;
    private BigDecimal weightedAmount;
    private LocalDate expectedCloseDate;
    private OpportunityStatus status;
    private String source;
    private String assignedTo;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OpportunityResponse() {
    }

    public static OpportunityResponse fromEntity(Opportunity opp) {
        if (opp == null) {
            return null;
        }

        OpportunityResponse res = new OpportunityResponse();
        res.setId(opp.getId());
        res.setOpportunityCode(opp.getOpportunityCode());
        res.setOpportunityName(opp.getOpportunityName());

        if (opp.getCustomer() != null) {
            res.setCustomerId(opp.getCustomer().getId());
            res.setCustomerName(opp.getCustomer().getCustomerName());
            res.setCustomerCode(opp.getCustomer().getCustomerCode());
        }

        if (opp.getLead() != null) {
            res.setLeadId(opp.getLead().getId());
            res.setLeadName(opp.getLead().getLeadName());
            res.setLeadCode(opp.getLead().getLeadCode());
        }

        res.setAmount(opp.getAmount());
        res.setStage(opp.getStage());
        res.setProbability(opp.getProbability());

        // Calculate weighted value: amount * probability / 100
        if (opp.getAmount() != null && opp.getProbability() != null) {
            BigDecimal probDecimal = BigDecimal.valueOf(opp.getProbability());
            BigDecimal weighted = opp.getAmount().multiply(probDecimal)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            res.setWeightedAmount(weighted);
        } else {
            res.setWeightedAmount(BigDecimal.ZERO);
        }

        res.setExpectedCloseDate(opp.getExpectedCloseDate());
        res.setStatus(opp.getStatus());
        res.setSource(opp.getSource());
        res.setAssignedTo(opp.getAssignedTo());
        res.setNotes(opp.getNotes());
        res.setCreatedAt(opp.getCreatedAt());
        res.setUpdatedAt(opp.getUpdatedAt());

        return res;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOpportunityCode() {
        return opportunityCode;
    }

    public void setOpportunityCode(String opportunityCode) {
        this.opportunityCode = opportunityCode;
    }

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

    public BigDecimal getWeightedAmount() {
        return weightedAmount;
    }

    public void setWeightedAmount(BigDecimal weightedAmount) {
        this.weightedAmount = weightedAmount;
    }

    public LocalDate getExpectedCloseDate() {
        return expectedCloseDate;
    }

    public void setExpectedCloseDate(LocalDate expectedCloseDate) {
        this.expectedCloseDate = expectedCloseDate;
    }

    public OpportunityStatus getStatus() {
        return status;
    }

    public void setStatus(OpportunityStatus status) {
        this.status = status;
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
