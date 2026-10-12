package com.acxiom.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "audit_logs",
    indexes = {
        @Index(name = "idx_audit_actor", columnList = "actor"),
        @Index(name = "idx_audit_action", columnList = "action"),
        @Index(name = "idx_audit_entity", columnList = "entity_type"),
        @Index(name = "idx_audit_timestamp", columnList = "timestamp")
    }
)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor", length = 100)
    private String actor;

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "record_id", length = 50)
    private String recordId;

    @Column(name = "details", length = 1000)
    private String details;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    public AuditLog() {
    }

    public AuditLog(String actor, String action, String entityType, String recordId, String details) {
        this.actor = actor != null ? actor : "system";
        this.action = action;
        this.entityType = entityType;
        this.recordId = recordId;
        this.details = details;
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
