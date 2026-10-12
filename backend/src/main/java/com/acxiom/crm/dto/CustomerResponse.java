package com.acxiom.crm.dto;

import com.acxiom.crm.entity.Customer;
import com.acxiom.crm.entity.CustomerStatus;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Customer details exposed via API responses.
 */
public class CustomerResponse {

    private Long id;
    private String customerCode;
    private String customerName;
    private String email;
    private String phone;
    private String companyName;
    private String address;
    private String city;
    private String state;
    private CustomerStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CustomerResponse() {
    }

    public CustomerResponse(Long id, String customerCode, String customerName, String email,
                            String phone, String companyName, String address, String city,
                            String state, CustomerStatus status, LocalDateTime createdAt,
                            LocalDateTime updatedAt) {
        this.id = id;
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.email = email;
        this.phone = phone;
        this.companyName = companyName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Map JPA Entity to DTO to prevent leaking internal database models.
     */
    public static CustomerResponse fromEntity(Customer customer) {
        if (customer == null) {
            return null;
        }
        return new CustomerResponse(
                customer.getId(),
                customer.getCustomerCode(),
                customer.getCustomerName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getCompanyName(),
                customer.getAddress(),
                customer.getCity(),
                customer.getState(),
                customer.getStatus(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public CustomerStatus getStatus() {
        return status;
    }

    public void setStatus(CustomerStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
