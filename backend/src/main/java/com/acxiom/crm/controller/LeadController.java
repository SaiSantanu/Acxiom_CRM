package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.dto.LeadRequest;
import com.acxiom.crm.dto.LeadResponse;
import com.acxiom.crm.entity.LeadStatus;
import com.acxiom.crm.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing Lead Management APIs.
 */
@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    /**
     * GET /api/leads
     * Retrieve leads with optional search term and status filtering.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LeadResponse>>> getAllLeads(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) LeadStatus status) {
        List<LeadResponse> leads = leadService.getAllLeads(search, status);
        return ResponseEntity.ok(ApiResponse.success("Leads retrieved successfully", leads));
    }

    /**
     * GET /api/leads/{id}
     * Retrieve a single lead by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponse>> getLeadById(@PathVariable Long id) {
        LeadResponse lead = leadService.getLeadById(id);
        return ResponseEntity.ok(ApiResponse.success("Lead retrieved successfully", lead));
    }

    /**
     * POST /api/leads
     * Create a new lead with validation.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LeadResponse>> createLead(
            @Valid @RequestBody LeadRequest request) {
        LeadResponse created = leadService.createLead(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lead created successfully", created));
    }

    /**
     * PUT /api/leads/{id}
     * Update an existing lead with validation.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponse>> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody LeadRequest request) {
        LeadResponse updated = leadService.updateLead(id, request);
        return ResponseEntity.ok(ApiResponse.success("Lead updated successfully", updated));
    }

    /**
     * DELETE /api/leads/{id}
     * Deactivate lead (transition to LOST) or permanent delete if ?permanent=true.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponse>> deleteLead(
            @PathVariable Long id,
            @RequestParam(value = "permanent", defaultValue = "false") boolean permanent) {
        if (permanent) {
            leadService.deleteLead(id);
            return ResponseEntity.ok(ApiResponse.success("Lead permanently deleted", null));
        } else {
            LeadResponse deactivated = leadService.deactivateLead(id);
            return ResponseEntity.ok(ApiResponse.success("Lead deactivated successfully", deactivated));
        }
    }
}
