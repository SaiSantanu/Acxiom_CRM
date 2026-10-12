package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ActivityRequest;
import com.acxiom.crm.dto.ActivityResponse;
import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.entity.ActivityType;
import com.acxiom.crm.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityResponse>>> getAllActivities(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "type", required = false) ActivityType type,
            @RequestParam(value = "customerId", required = false) Long customerId,
            @RequestParam(value = "leadId", required = false) Long leadId) {
        List<ActivityResponse> activities = activityService.getAllActivities(search, type, customerId, leadId);
        return ResponseEntity.ok(ApiResponse.success("Activities retrieved successfully", activities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityResponse>> getActivityById(@PathVariable Long id) {
        ActivityResponse response = activityService.getActivityById(id);
        return ResponseEntity.ok(ApiResponse.success("Activity retrieved successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ActivityResponse>> createActivity(@Valid @RequestBody ActivityRequest request) {
        ActivityResponse created = activityService.createActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Activity created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityResponse>> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request) {
        ActivityResponse updated = activityService.updateActivity(id, request);
        return ResponseEntity.ok(ApiResponse.success("Activity updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok(ApiResponse.success("Activity deleted successfully", null));
    }
}
