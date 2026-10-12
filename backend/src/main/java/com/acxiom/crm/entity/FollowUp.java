package com.acxiom.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "follow_ups",
    indexes = {
        @Index(name = "idx_followup_status", columnList = "status"),
        @Index(name = "idx_followup_date", columnList = "follow_up_date"),
        @Index(name = "idx_followup_customer", columnList = "customer_id"),
        @Index(name = "idx_followup_lead", columnList = "lead_id")
    }
)
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", foreignKey = @ForeignKey(name = "fk_followup_customer"))
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", foreignKey = @ForeignKey(name = "fk_followup_lead"))
    private Lead lead;

    @Column(name = "follow_up_date", nullable = false)
    private LocalDate followUpDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "follow_up_type", nullable = false, length = 30)
    private FollowUpType followUpType;

    @Column(name = "subject", nullable = false, length = 150)
    private String subject;

    @Column(name = "remarks", length = 1000)
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private FollowUpStatus status = FollowUpStatus.PLANNED;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public FollowUp() {
    }

    public FollowUp(Customer customer, Lead lead, LocalDate followUpDate, FollowUpType followUpType,
                    String subject, String remarks, FollowUpStatus status, String assignedTo) {
        this.customer = customer;
        this.lead = lead;
        this.followUpDate = followUpDate;
        this.followUpType = followUpType != null ? followUpType : FollowUpType.CALL;
        this.subject = subject;
        this.remarks = remarks;
        this.status = status != null ? status : FollowUpStatus.PLANNED;
        this.assignedTo = assignedTo;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
