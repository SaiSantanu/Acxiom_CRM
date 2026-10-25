package com.acxiom.crm.service;

import com.acxiom.crm.dto.ActivityResponse;
import com.acxiom.crm.dto.DashboardStatsResponse;
import com.acxiom.crm.dto.FollowUpResponse;
import com.acxiom.crm.entity.*;
import com.acxiom.crm.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final OpportunityRepository opportunityRepository;
    private final FollowUpRepository followUpRepository;
    private final ActivityRepository activityRepository;

    public DashboardService(
            CustomerRepository customerRepository,
            LeadRepository leadRepository,
            OpportunityRepository opportunityRepository,
            FollowUpRepository followUpRepository,
            ActivityRepository activityRepository
    ) {
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.opportunityRepository = opportunityRepository;
        this.followUpRepository = followUpRepository;
        this.activityRepository = activityRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth != null ? auth.getName() : null;
        boolean isSalesExecutive = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SALES_EXECUTIVE"));

        LocalDate today = LocalDate.now();

        // Fetch entities
        List<Customer> allCustomers = customerRepository.findAll();
        List<Lead> allLeads = leadRepository.findAll();
        List<Opportunity> allOpportunities = opportunityRepository.findAll();
        List<FollowUp> allFollowUps = followUpRepository.findAll();
        List<Activity> allActivities = activityRepository.findAll();

        // Filter for Sales Executive scope if assigned data exists
        List<Lead> leads = allLeads;
        List<Opportunity> opportunities = allOpportunities;
        List<FollowUp> followUps = allFollowUps;
        List<Activity> activities = allActivities;

        if (isSalesExecutive && currentUsername != null) {
            List<Lead> userLeads = allLeads.stream()
                    .filter(l -> currentUsername.equalsIgnoreCase(l.getAssignedTo()))
                    .toList();
            if (!userLeads.isEmpty()) leads = userLeads;

            List<Opportunity> userOpps = allOpportunities.stream()
                    .filter(o -> currentUsername.equalsIgnoreCase(o.getAssignedTo()))
                    .toList();
            if (!userOpps.isEmpty()) opportunities = userOpps;

            List<FollowUp> userFollowUps = allFollowUps.stream()
                    .filter(f -> currentUsername.equalsIgnoreCase(f.getAssignedTo()))
                    .toList();
            if (!userFollowUps.isEmpty()) followUps = userFollowUps;

            List<Activity> userActivities = allActivities.stream()
                    .filter(a -> currentUsername.equalsIgnoreCase(a.getAssignedTo()))
                    .toList();
            if (!userActivities.isEmpty()) activities = userActivities;
        }

        DashboardStatsResponse stats = new DashboardStatsResponse();

        // 1. Customer metrics
        stats.setTotalCustomers(allCustomers.size());

        // 2. Lead metrics
        stats.setTotalLeads(leads.size());
        long openLeads = leads.stream()
                .filter(l -> l.getStatus() == LeadStatus.NEW ||
                             l.getStatus() == LeadStatus.CONTACTED ||
                             l.getStatus() == LeadStatus.QUALIFIED)
                .count();
        stats.setOpenLeads(openLeads);

        // Lead distribution
        Map<String, Long> leadDist = new LinkedHashMap<>();
        for (LeadStatus status : LeadStatus.values()) {
            long count = leads.stream().filter(l -> l.getStatus() == status).count();
            leadDist.put(status.name(), count);
        }
        stats.setLeadStatusDistribution(leadDist);

        // 3. Opportunity metrics
        stats.setTotalOpportunities(opportunities.size());
        long openOpps = opportunities.stream()
                .filter(o -> o.getStage() != OpportunityStage.WON &&
                             o.getStage() != OpportunityStage.LOST)
                .count();
        stats.setOpenOpportunities(openOpps);

        long wonOpps = opportunities.stream()
                .filter(o -> o.getStage() == OpportunityStage.WON)
                .count();
        stats.setWonOpportunities(wonOpps);

        long lostOpps = opportunities.stream()
                .filter(o -> o.getStage() == OpportunityStage.LOST)
                .count();
        stats.setLostOpportunities(lostOpps);

        // Calculate pipeline value for eligible open opportunities only
        BigDecimal totalOpenPipeline = BigDecimal.ZERO;
        BigDecimal weightedPipeline = BigDecimal.ZERO;
        BigDecimal wonRevenue = BigDecimal.ZERO;

        Map<String, DashboardStatsResponse.StageMetric> stageDist = new LinkedHashMap<>();
        for (OpportunityStage stage : OpportunityStage.values()) {
            stageDist.put(stage.name(), new DashboardStatsResponse.StageMetric(0, BigDecimal.ZERO));
        }

        for (Opportunity opp : opportunities) {
            BigDecimal amt = opp.getAmount() != null ? opp.getAmount() : BigDecimal.ZERO;
            OpportunityStage stage = opp.getStage();

            // Stage distribution map
            DashboardStatsResponse.StageMetric metric = stageDist.get(stage.name());
            if (metric != null) {
                metric.setCount(metric.getCount() + 1);
                metric.setTotalAmount(metric.getTotalAmount().add(amt));
            }

            if (stage == OpportunityStage.WON) {
                wonRevenue = wonRevenue.add(amt);
            } else if (stage != OpportunityStage.LOST) {
                // Eligible open opportunity
                totalOpenPipeline = totalOpenPipeline.add(amt);
                int prob = opp.getProbability() != null ? opp.getProbability() : 0;
                BigDecimal weighted = amt.multiply(BigDecimal.valueOf(prob))
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                weightedPipeline = weightedPipeline.add(weighted);
            }
        }

        stats.setTotalOpenPipelineValue(totalOpenPipeline);
        stats.setWeightedOpenPipelineValue(weightedPipeline);
        stats.setTotalWonRevenue(wonRevenue);
        stats.setOpportunityStageDistribution(stageDist);

        // 4. Follow-Up metrics
        long pendingFollowUps = followUps.stream()
                .filter(f -> f.getStatus() == FollowUpStatus.PLANNED)
                .count();
        stats.setPendingFollowUps(pendingFollowUps);

        long overdueFollowUps = followUps.stream()
                .filter(f -> f.getStatus() == FollowUpStatus.PLANNED && f.getFollowUpDate().isBefore(today))
                .count();
        stats.setOverdueFollowUps(overdueFollowUps);

        List<FollowUpResponse> upcomingList = followUps.stream()
                .filter(f -> f.getStatus() == FollowUpStatus.PLANNED)
                .sorted(Comparator.comparing(FollowUp::getFollowUpDate))
                .limit(5)
                .map(FollowUpResponse::fromEntity)
                .toList();
        stats.setUpcomingFollowUps(upcomingList);

        // 5. Activity metrics
        stats.setTotalActivities(activities.size());

        Map<String, Long> actDist = new LinkedHashMap<>();
        for (ActivityType type : ActivityType.values()) {
            long count = activities.stream().filter(a -> a.getActivityType() == type).count();
            actDist.put(type.name(), count);
        }
        stats.setActivityTypeDistribution(actDist);

        List<ActivityResponse> recentList = activities.stream()
                .sorted(Comparator.comparing(Activity::getActivityDate).reversed())
                .limit(5)
                .map(ActivityResponse::fromEntity)
                .toList();
        stats.setRecentActivities(recentList);

        return stats;
    }
}
