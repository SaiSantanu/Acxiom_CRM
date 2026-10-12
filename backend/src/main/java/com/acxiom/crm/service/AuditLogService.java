package com.acxiom.crm.service;

import com.acxiom.crm.entity.AuditLog;
import com.acxiom.crm.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(String actor, String action, String entityType, String recordId, String details) {
        try {
            AuditLog auditLog = new AuditLog(actor, action, entityType, recordId, details);
            auditLogRepository.save(auditLog);
            log.debug("AuditLog: actor={} action={} entity={} recordId={}", actor, action, entityType, recordId);
        } catch (Exception ex) {
            log.warn("Failed to persist audit log: {}", ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc();
    }
}
