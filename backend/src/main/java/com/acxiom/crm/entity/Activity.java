package com.acxiom.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "activities",
    indexes = {
        @Index(name = "idx_activity_type", columnList = "activity_type"),
        @Index(name = "idx_activity_status", columnList = "status"),
        @Index(name = "idx_activity_date", columnList = "activity_date"),
        @Index(name = "idx_activity_customer", columnList = "customer_id"),
        @Index(name = "idx_activity_lead", columnList = "lead_id")
    }
)
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false, length = 30)
    private ActivityType activityType;

    @Column(name = "subject", nullable = false, length = 150)
    private String subject;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", foreignKey = @ForeignKey(name = "fk_activity_customer"))
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", foreignKey = @ForeignKey(name = "fk_activity_lead"))
    private Lead lead;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ActivityStatus status = ActivityStatus.COMPLETED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Activity() {
    }

    public Activity(ActivityType activityType, String subject, String description,
                    LocalDate activityDate, Customer customer, Lead lead,
                    String assignedTo, ActivityStatus status) {
        this.activityType = activityType;
        this.subject = subject;
        this.description = description;
        this.activityDate = activityDate;
        this.customer = customer;
        this.lead = lead;
        this.assignedTo = assignedTo;
        this.status = status != null ? status : ActivityStatus.COMPLETED;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
