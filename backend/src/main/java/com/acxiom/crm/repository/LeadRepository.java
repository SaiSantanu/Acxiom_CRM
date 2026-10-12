package com.acxiom.crm.repository;

import com.acxiom.crm.entity.Lead;
import com.acxiom.crm.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Lead database operations.
 */
@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    boolean existsByLeadCode(String leadCode);

    Optional<Lead> findByLeadCode(String leadCode);

    List<Lead> findAllByOrderByCreatedAtDesc();

    List<Lead> findByStatusOrderByCreatedAtDesc(LeadStatus status);

    @Query("SELECT l FROM Lead l WHERE " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(l.leadName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.leadCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.assignedTo) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY l.createdAt DESC")
    List<Lead> searchLeads(@Param("keyword") String keyword, @Param("status") LeadStatus status);
}
