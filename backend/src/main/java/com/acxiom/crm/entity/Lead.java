package com.acxiom.crm.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Lead JPA Entity mapped to the 'leads' database table.
 */
@Entity
@Table(
    name = "leads",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_lead_code", columnNames = "lead_code")
    },
    indexes = {
        @Index(name = "idx_lead_code", columnList = "lead_code"),
        @Index(name = "idx_lead_name", columnList = "lead_name"),
        @Index(name = "idx_lead_status", columnList = "status"),
        @Index(name = "idx_lead_priority", columnList = "priority"),
        @Index(name = "idx_lead_email", columnList = "email")
    }
)
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_code", nullable = false, unique = true, length = 50, updatable = false)
    private String leadCode;

    @Column(name = "lead_name", nullable = false, length = 150)
    private String leadName;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", length = 50)
    private LeadSource source;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private LeadStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private LeadPriority priority;

    @Column(name = "expected_value", precision = 12, scale = 2)
    private BigDecimal expectedValue;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Lead() {
    }

    public Lead(String leadCode, String leadName, String email, String phone, String companyName,
                LeadSource source, LeadStatus status, LeadPriority priority,
                BigDecimal expectedValue, String assignedTo, String notes) {
        this.leadCode = leadCode;
        this.leadName = leadName;
        this.email = email;
        this.phone = phone;
        this.companyName = companyName;
        this.source = source != null ? source : LeadSource.OTHER;
        this.status = status != null ? status : LeadStatus.NEW;
        this.priority = priority != null ? priority : LeadPriority.MEDIUM;
        this.expectedValue = expectedValue != null ? expectedValue : BigDecimal.ZERO;
        this.assignedTo = assignedTo;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = LeadStatus.NEW;
        }
        if (this.priority == null) {
            this.priority = LeadPriority.MEDIUM;
        }
        if (this.source == null) {
            this.source = LeadSource.OTHER;
        }
        if (this.expectedValue == null) {
            this.expectedValue = BigDecimal.ZERO;
        }
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
