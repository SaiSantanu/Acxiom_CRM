package com.acxiom.crm.service;

import com.acxiom.crm.dto.CustomerRequest;
import com.acxiom.crm.dto.CustomerResponse;
import com.acxiom.crm.entity.Customer;
import com.acxiom.crm.entity.CustomerStatus;
import com.acxiom.crm.exception.DuplicateResourceException;
import com.acxiom.crm.exception.ResourceNotFoundException;
import com.acxiom.crm.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Service encapsulating customer business logic, validation, and persistence orchestration.
 */
@Service
@Transactional
public class CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Retrieve all customers or filter by search query (name, email, phone, company, code).
     */
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers(String search) {
        if (search == null || search.trim().isEmpty()) {
            return customerRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .map(CustomerResponse::fromEntity)
                    .toList();
        }
        return customerRepository.searchCustomers(search.trim())
                .stream()
                .map(CustomerResponse::fromEntity)
                .toList();
    }

    /**
     * Retrieve a single customer by primary ID.
     */
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return CustomerResponse.fromEntity(customer);
    }

    /**
     * Create a new customer with business validation and unique customer code generation.
     */
    public CustomerResponse createCustomer(CustomerRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        String cleanPhone = request.getPhone().trim();

        // 1. Business Check: Email uniqueness
        if (customerRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("A customer with email '" + cleanEmail + "' already exists.");
        }

        // 2. Business Check: Phone uniqueness
        if (customerRepository.existsByPhone(cleanPhone)) {
            throw new DuplicateResourceException("A customer with phone number '" + cleanPhone + "' already exists.");
        }

        // 3. Generate unique customer code (e.g., CUST-XXXXXX)
        String customerCode = generateUniqueCustomerCode();

        Customer customer = new Customer();
        customer.setCustomerCode(customerCode);
        customer.setCustomerName(request.getCustomerName().trim());
        customer.setEmail(cleanEmail);
        customer.setPhone(cleanPhone);
        customer.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : null);
        customer.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        customer.setCity(request.getCity() != null ? request.getCity().trim() : null);
        customer.setState(request.getState() != null ? request.getState().trim() : null);
        customer.setStatus(request.getStatus() != null ? request.getStatus() : CustomerStatus.ACTIVE);

        Customer savedCustomer = customerRepository.save(customer);
        log.info("Created new customer id={} code={}", savedCustomer.getId(), savedCustomer.getCustomerCode());
        return CustomerResponse.fromEntity(savedCustomer);
    }

    /**
     * Update an existing customer with non-conflicting uniqueness checks.
     */
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        String cleanEmail = request.getEmail().trim().toLowerCase();
        String cleanPhone = request.getPhone().trim();

        // Check email uniqueness excluding self
        if (customerRepository.existsByEmailAndIdNot(cleanEmail, id)) {
            throw new DuplicateResourceException("A customer with email '" + cleanEmail + "' already exists.");
        }

        // Check phone uniqueness excluding self
        if (customerRepository.existsByPhoneAndIdNot(cleanPhone, id)) {
            throw new DuplicateResourceException("A customer with phone number '" + cleanPhone + "' already exists.");
        }

        existing.setCustomerName(request.getCustomerName().trim());
        existing.setEmail(cleanEmail);
        existing.setPhone(cleanPhone);
        existing.setCompanyName(request.getCompanyName() != null ? request.getCompanyName().trim() : null);
        existing.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        existing.setCity(request.getCity() != null ? request.getCity().trim() : null);
        existing.setState(request.getState() != null ? request.getState().trim() : null);

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        Customer updatedCustomer = customerRepository.save(existing);
        log.info("Updated customer id={} code={}", updatedCustomer.getId(), updatedCustomer.getCustomerCode());
        return CustomerResponse.fromEntity(updatedCustomer);
    }

    /**
     * Deactivate a customer (sets status to INACTIVE) preserving relational history.
     */
    public CustomerResponse deactivateCustomer(Long id) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        existing.setStatus(CustomerStatus.INACTIVE);
        Customer updated = customerRepository.save(existing);
        log.info("Deactivated customer id={}", id);
        return CustomerResponse.fromEntity(updated);
    }

    /**
     * Delete customer record permanently if desired.
     */
    public void deleteCustomer(Long id) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        customerRepository.delete(existing);
        log.info("Deleted customer id={}", id);
    }

    /**
     * Safely generate a unique enterprise customer code.
     */
    private String generateUniqueCustomerCode() {
        int maxAttempts = 10;
        for (int i = 0; i < maxAttempts; i++) {
            int randomNum = ThreadLocalRandom.current().nextInt(100000, 999999);
            String candidate = "CUST-" + randomNum;
            if (!customerRepository.existsByCustomerCode(candidate)) {
                return candidate;
            }
        }
        // Fallback to epoch timestamp millis for absolute uniqueness
        return "CUST-" + (Instant.now().toEpochMilli() % 100000000);
    }
}
