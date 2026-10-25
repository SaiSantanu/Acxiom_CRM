package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.dto.CustomerRequest;
import com.acxiom.crm.dto.CustomerResponse;
import com.acxiom.crm.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing Customer Management APIs.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * GET /api/customers
     * Retrieve all customers with optional search filtering (name, email, phone, company, code).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers(
            @RequestParam(value = "search", required = false) String search) {
        List<CustomerResponse> customers = customerService.getAllCustomers(search);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", customers));
    }

    /**
     * GET /api/customers/{id}
     * Retrieve a single customer by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", customer));
    }

    /**
     * POST /api/customers
     * Create a new customer with validation.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse created = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", created));
    }

    /**
     * PUT /api/customers/{id}
     * Update an existing customer with validation.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse updated = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", updated));
    }

    /**
     * DELETE /api/customers/{id}
     * Deactivate customer (or optionally permanent delete if ?permanent=true).
     * Restricted to ADMIN and MANAGER roles.
     */
    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> deleteCustomer(
            @PathVariable Long id,
            @RequestParam(value = "permanent", defaultValue = "false") boolean permanent) {
        if (permanent) {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(ApiResponse.success("Customer permanently deleted", null));
        } else {
            CustomerResponse deactivated = customerService.deactivateCustomer(id);
            return ResponseEntity.ok(ApiResponse.success("Customer deactivated successfully", deactivated));
        }
    }
}
