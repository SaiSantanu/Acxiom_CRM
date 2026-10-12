package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.entity.AuditLog;
import com.acxiom.crm.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLog>>> getRecentLogs() {
        List<AuditLog> logs = auditLogService.getRecentLogs();
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved successfully", logs));
    }
}
