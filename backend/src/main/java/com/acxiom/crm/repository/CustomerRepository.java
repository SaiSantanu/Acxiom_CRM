package com.acxiom.crm.repository;

import com.acxiom.crm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Customer database operations.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByCustomerCode(String customerCode);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByPhoneAndIdNot(String phone, Long id);

    Optional<Customer> findByCustomerCode(String customerCode);

    Optional<Customer> findByEmail(String email);

    List<Customer> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c FROM Customer c WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(c.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.state) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<Customer> searchCustomers(@Param("keyword") String keyword);
}
