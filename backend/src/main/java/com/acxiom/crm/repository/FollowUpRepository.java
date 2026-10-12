package com.acxiom.crm.repository;

import com.acxiom.crm.entity.FollowUp;
import com.acxiom.crm.entity.FollowUpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    List<FollowUp> findAllByOrderByFollowUpDateAscCreatedAtDesc();

    List<FollowUp> findByStatusOrderByFollowUpDateAscCreatedAtDesc(FollowUpStatus status);

    @Query("SELECT f FROM FollowUp f LEFT JOIN f.customer c LEFT JOIN f.lead l WHERE " +
           "(:status IS NULL OR f.status = :status) AND " +
           "(:fromDate IS NULL OR f.followUpDate >= :fromDate) AND " +
           "(:toDate IS NULL OR f.followUpDate <= :toDate) AND " +
           "(:customerId IS NULL OR (c IS NOT NULL AND c.id = :customerId)) AND " +
           "(:leadId IS NULL OR (l IS NOT NULL AND l.id = :leadId)) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(f.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "(c IS NOT NULL AND LOWER(c.customerName) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
           "(l IS NOT NULL AND LOWER(l.leadName) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
           "LOWER(f.assignedTo) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY f.followUpDate ASC, f.createdAt DESC")
    List<FollowUp> searchFollowUps(
            @Param("keyword") String keyword,
            @Param("status") FollowUpStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("customerId") Long customerId,
            @Param("leadId") Long leadId
    );

    @Query("SELECT COUNT(f) FROM FollowUp f WHERE f.status = :status AND f.followUpDate < :date")
    long countOverdue(@Param("status") FollowUpStatus status, @Param("date") LocalDate date);

    @Query("SELECT COUNT(f) FROM FollowUp f WHERE f.status = :status AND f.followUpDate = :date")
    long countToday(@Param("status") FollowUpStatus status, @Param("date") LocalDate date);
}
