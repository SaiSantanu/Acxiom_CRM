package com.acxiom.crm.repository;

import com.acxiom.crm.entity.Activity;
import com.acxiom.crm.entity.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findAllByOrderByActivityDateDescCreatedAtDesc();

    @Query("SELECT a FROM Activity a LEFT JOIN a.customer c LEFT JOIN a.lead l WHERE " +
           "(:type IS NULL OR a.activityType = :type) AND " +
           "(:customerId IS NULL OR (c IS NOT NULL AND c.id = :customerId)) AND " +
           "(:leadId IS NULL OR (l IS NOT NULL AND l.id = :leadId)) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(a.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "(c IS NOT NULL AND LOWER(c.customerName) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
           "(l IS NOT NULL AND LOWER(l.leadName) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
           "LOWER(a.assignedTo) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY a.activityDate DESC, a.createdAt DESC")
    List<Activity> searchActivities(
            @Param("keyword") String keyword,
            @Param("type") ActivityType type,
            @Param("customerId") Long customerId,
            @Param("leadId") Long leadId
    );
}
