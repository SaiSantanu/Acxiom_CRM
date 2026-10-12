package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.dto.HealthResponse;
import com.acxiom.crm.service.HealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health check controller providing system status verification.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    /**
     * Health check endpoint: GET /api/health
     * Returns consistent operational status of the AcxiomCRM backend.
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthResponse>> getHealth() {
        HealthResponse health = healthService.checkHealth();
        return ResponseEntity.ok(
                ApiResponse.success("AcxiomCRM backend service is operational", health)
        );
    }
}
