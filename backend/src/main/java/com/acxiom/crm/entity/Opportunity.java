package com.acxiom.crm.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Opportunity JPA Entity mapped to the 'opportunities' database table.
 */
@Entity
@Table(
    name = "opportunities",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_opportunity_code", columnNames = "opportunity_code")
    },
    indexes = {
        @Index(name = "idx_opp_code", columnList = "opportunity_code"),
        @Index(name = "idx_opp_name", columnList = "opportunity_name"),
        @Index(name = "idx_opp_stage", columnList = "stage"),
        @Index(name = "idx_opp_status", columnList = "status"),
        @Index(name = "idx_opp_customer", columnList = "customer_id"),
        @Index(name = "idx_opp_lead", columnList = "lead_id")
    }
)
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "opportunity_code", nullable = false, unique = true, length = 50, updatable = false)
    private String opportunityCode;

    @Column(name = "opportunity_name", nullable = false, length = 150)
    private String opportunityName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", foreignKey = @ForeignKey(name = "fk_opportunity_customer"))
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", foreignKey = @ForeignKey(name = "fk_opportunity_lead"))
    private Lead lead;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage", nullable = false, length = 30)
    private OpportunityStage stage;

    @Column(name = "probability", nullable = false)
    private Integer probability;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private OpportunityStatus status;

    @Column(name = "source", length = 50)
    private String source;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Opportunity() {
    }

    public Opportunity(String opportunityCode, String opportunityName, Customer customer, Lead lead,
                       BigDecimal amount, OpportunityStage stage, Integer probability,
                       LocalDate expectedCloseDate, OpportunityStatus status, String source,
                       String assignedTo, String notes) {
        this.opportunityCode = opportunityCode;
        this.opportunityName = opportunityName;
        this.customer = customer;
        this.lead = lead;
        this.amount = amount != null ? amount : BigDecimal.ZERO;
        this.stage = stage != null ? stage : OpportunityStage.QUALIFICATION;
        this.probability = probability != null ? probability : 20;
        this.expectedCloseDate = expectedCloseDate;
        this.status = status != null ? status : OpportunityStatus.OPEN;
        this.source = source;
        this.assignedTo = assignedTo;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        syncStatusWithStage();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        syncStatusWithStage();
    }

    /**
     * Enforces consistency between Stage and Status.
     */
    public void syncStatusWithStage() {
        if (this.stage == OpportunityStage.WON) {
            this.status = OpportunityStatus.WON;
        } else if (this.stage == OpportunityStage.LOST) {
            this.status = OpportunityStatus.LOST;
        } else {
            this.status = OpportunityStatus.OPEN;
        }
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

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Lead getLead() {
        return lead;
    }

    public void setLead(Lead lead) {
        this.lead = lead;
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
        syncStatusWithStage();
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
