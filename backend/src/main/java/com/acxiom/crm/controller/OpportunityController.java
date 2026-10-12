package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.dto.OpportunityRequest;
import com.acxiom.crm.dto.OpportunityResponse;
import com.acxiom.crm.dto.PipelineSummaryResponse;
import com.acxiom.crm.entity.OpportunityStage;
import com.acxiom.crm.entity.OpportunityStatus;
import com.acxiom.crm.service.OpportunityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing Opportunity Management APIs.
 */
@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;

    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    /**
     * GET /api/opportunities
     * Retrieve opportunities with optional filtering and search.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OpportunityResponse>>> getAllOpportunities(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "stage", required = false) OpportunityStage stage,
            @RequestParam(value = "status", required = false) OpportunityStatus status,
            @RequestParam(value = "customerId", required = false) Long customerId) {
        List<OpportunityResponse> opportunities = opportunityService.getAllOpportunities(search, stage, status, customerId);
        return ResponseEntity.ok(ApiResponse.success("Opportunities retrieved successfully", opportunities));
    }

    /**
     * GET /api/opportunities/summary
     * Retrieve pipeline summary metrics.
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<PipelineSummaryResponse>> getPipelineSummary() {
        PipelineSummaryResponse summary = opportunityService.getPipelineSummary();
        return ResponseEntity.ok(ApiResponse.success("Pipeline summary retrieved successfully", summary));
    }

    /**
     * GET /api/opportunities/{id}
     * Retrieve a single opportunity by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OpportunityResponse>> getOpportunityById(@PathVariable Long id) {
        OpportunityResponse opp = opportunityService.getOpportunityById(id);
        return ResponseEntity.ok(ApiResponse.success("Opportunity retrieved successfully", opp));
    }

    /**
     * POST /api/opportunities
     * Create a new opportunity with validation.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OpportunityResponse>> createOpportunity(
            @Valid @RequestBody OpportunityRequest request) {
        OpportunityResponse created = opportunityService.createOpportunity(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Opportunity created successfully", created));
    }

    /**
     * PUT /api/opportunities/{id}
     * Update an existing opportunity with validation.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OpportunityResponse>> updateOpportunity(
            @PathVariable Long id,
            @Valid @RequestBody OpportunityRequest request) {
        OpportunityResponse updated = opportunityService.updateOpportunity(id, request);
        return ResponseEntity.ok(ApiResponse.success("Opportunity updated successfully", updated));
    }

    /**
     * DELETE /api/opportunities/{id}
     * Deactivate opportunity (marks as LOST) or permanently delete if ?permanent=true.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<OpportunityResponse>> deleteOpportunity(
            @PathVariable Long id,
            @RequestParam(value = "permanent", defaultValue = "false") boolean permanent) {
        if (permanent) {
            opportunityService.deleteOpportunity(id, true);
            return ResponseEntity.ok(ApiResponse.success("Opportunity permanently deleted", null));
        } else {
            OpportunityResponse deactivated = opportunityService.deleteOpportunity(id, false);
            return ResponseEntity.ok(ApiResponse.success("Opportunity deactivated successfully", deactivated));
        }
    }
}
