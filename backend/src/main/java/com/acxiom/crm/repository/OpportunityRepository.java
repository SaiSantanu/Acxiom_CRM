package com.acxiom.crm.repository;

import com.acxiom.crm.entity.Opportunity;
import com.acxiom.crm.entity.OpportunityStage;
import com.acxiom.crm.entity.OpportunityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Opportunity database operations.
 */
@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    boolean existsByOpportunityCode(String opportunityCode);

    Optional<Opportunity> findByOpportunityCode(String opportunityCode);

    List<Opportunity> findAllByOrderByCreatedAtDesc();

    List<Opportunity> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Opportunity> findByStatusOrderByCreatedAtDesc(OpportunityStatus status);

    List<Opportunity> findByStageOrderByCreatedAtDesc(OpportunityStage stage);

    @Query("SELECT o FROM Opportunity o LEFT JOIN o.customer c LEFT JOIN o.lead l WHERE " +
           "(:stage IS NULL OR o.stage = :stage) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:customerId IS NULL OR (c IS NOT NULL AND c.id = :customerId)) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(o.opportunityName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.opportunityCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "(c IS NOT NULL AND LOWER(c.customerName) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
           "(l IS NOT NULL AND LOWER(l.leadName) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
           "LOWER(o.assignedTo) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY o.createdAt DESC")
    List<Opportunity> searchOpportunities(
            @Param("keyword") String keyword,
            @Param("stage") OpportunityStage stage,
            @Param("status") OpportunityStatus status,
            @Param("customerId") Long customerId
    );

    long countByStatus(OpportunityStatus status);
}
