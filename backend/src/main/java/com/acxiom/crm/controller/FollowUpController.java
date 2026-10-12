package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.dto.FollowUpRequest;
import com.acxiom.crm.dto.FollowUpResponse;
import com.acxiom.crm.entity.FollowUpStatus;
import com.acxiom.crm.service.FollowUpService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/followups")
public class FollowUpController {

    private final FollowUpService followUpService;

    public FollowUpController(FollowUpService followUpService) {
        this.followUpService = followUpService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FollowUpResponse>>> getAllFollowUps(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) FollowUpStatus status,
            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(value = "customerId", required = false) Long customerId,
            @RequestParam(value = "leadId", required = false) Long leadId) {
        List<FollowUpResponse> followUps = followUpService.getAllFollowUps(search, status, fromDate, toDate, customerId, leadId);
        return ResponseEntity.ok(ApiResponse.success("Follow-ups retrieved successfully", followUps));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FollowUpResponse>> getFollowUpById(@PathVariable Long id) {
        FollowUpResponse response = followUpService.getFollowUpById(id);
        return ResponseEntity.ok(ApiResponse.success("Follow-up retrieved successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FollowUpResponse>> createFollowUp(@Valid @RequestBody FollowUpRequest request) {
        FollowUpResponse created = followUpService.createFollowUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Follow-up created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FollowUpResponse>> updateFollowUp(
            @PathVariable Long id,
            @Valid @RequestBody FollowUpRequest request) {
        FollowUpResponse updated = followUpService.updateFollowUp(id, request);
        return ResponseEntity.ok(ApiResponse.success("Follow-up updated successfully", updated));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<FollowUpResponse>> completeFollowUp(
            @PathVariable Long id,
            @RequestParam(value = "remarks", required = false) String remarks) {
        FollowUpResponse completed = followUpService.completeFollowUp(id, remarks);
        return ResponseEntity.ok(ApiResponse.success("Follow-up marked as COMPLETED", completed));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFollowUp(@PathVariable Long id) {
        followUpService.deleteFollowUp(id);
        return ResponseEntity.ok(ApiResponse.success("Follow-up deleted successfully", null));
    }
}
