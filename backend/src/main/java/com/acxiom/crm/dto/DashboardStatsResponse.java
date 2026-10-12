package com.acxiom.crm.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO representing database-derived dashboard statistics and breakdowns.
 */
public class DashboardStatsResponse {

    private long totalCustomers;
    private long totalLeads;
    private long openLeads;
    private long totalOpportunities;
    private long openOpportunities;
    private long wonOpportunities;
    private long lostOpportunities;
    private BigDecimal totalOpenPipelineValue;
    private BigDecimal weightedOpenPipelineValue;
    private BigDecimal totalWonRevenue;
    private long pendingFollowUps;
    private long overdueFollowUps;
    private long totalActivities;

    private Map<String, Long> leadStatusDistribution;
    private Map<String, StageMetric> opportunityStageDistribution;
    private Map<String, Long> activityTypeDistribution;
    private List<FollowUpResponse> upcomingFollowUps;
    private List<ActivityResponse> recentActivities;

    public DashboardStatsResponse() {
        this.totalOpenPipelineValue = BigDecimal.ZERO;
        this.weightedOpenPipelineValue = BigDecimal.ZERO;
        this.totalWonRevenue = BigDecimal.ZERO;
    }

    public static class StageMetric {
        private long count;
        private BigDecimal totalAmount;

        public StageMetric() {
            this.count = 0;
            this.totalAmount = BigDecimal.ZERO;
        }

        public StageMetric(long count, BigDecimal totalAmount) {
            this.count = count;
            this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }
    }

    // Getters and Setters
    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalLeads() {
        return totalLeads;
    }

    public void setTotalLeads(long totalLeads) {
        this.totalLeads = totalLeads;
    }

    public long getOpenLeads() {
        return openLeads;
    }

    public void setOpenLeads(long openLeads) {
        this.openLeads = openLeads;
    }

    public long getTotalOpportunities() {
        return totalOpportunities;
    }

    public void setTotalOpportunities(long totalOpportunities) {
        this.totalOpportunities = totalOpportunities;
    }

    public long getOpenOpportunities() {
        return openOpportunities;
    }

    public void setOpenOpportunities(long openOpportunities) {
        this.openOpportunities = openOpportunities;
    }

    public long getWonOpportunities() {
        return wonOpportunities;
    }

    public void setWonOpportunities(long wonOpportunities) {
        this.wonOpportunities = wonOpportunities;
    }

    public long getLostOpportunities() {
        return lostOpportunities;
    }

    public void setLostOpportunities(long lostOpportunities) {
        this.lostOpportunities = lostOpportunities;
    }

    public BigDecimal getTotalOpenPipelineValue() {
        return totalOpenPipelineValue;
    }

    public void setTotalOpenPipelineValue(BigDecimal totalOpenPipelineValue) {
        this.totalOpenPipelineValue = totalOpenPipelineValue;
    }

    public BigDecimal getWeightedOpenPipelineValue() {
        return weightedOpenPipelineValue;
    }

    public void setWeightedOpenPipelineValue(BigDecimal weightedOpenPipelineValue) {
        this.weightedOpenPipelineValue = weightedOpenPipelineValue;
    }

    public BigDecimal getTotalWonRevenue() {
        return totalWonRevenue;
    }

    public void setTotalWonRevenue(BigDecimal totalWonRevenue) {
        this.totalWonRevenue = totalWonRevenue;
    }

    public long getPendingFollowUps() {
        return pendingFollowUps;
    }

    public void setPendingFollowUps(long pendingFollowUps) {
        this.pendingFollowUps = pendingFollowUps;
    }

    public long getOverdueFollowUps() {
        return overdueFollowUps;
    }

    public void setOverdueFollowUps(long overdueFollowUps) {
        this.overdueFollowUps = overdueFollowUps;
    }

    public long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public Map<String, Long> getLeadStatusDistribution() {
        return leadStatusDistribution;
    }

    public void setLeadStatusDistribution(Map<String, Long> leadStatusDistribution) {
        this.leadStatusDistribution = leadStatusDistribution;
    }

    public Map<String, StageMetric> getOpportunityStageDistribution() {
        return opportunityStageDistribution;
    }

    public void setOpportunityStageDistribution(Map<String, StageMetric> opportunityStageDistribution) {
        this.opportunityStageDistribution = opportunityStageDistribution;
    }

    public Map<String, Long> getActivityTypeDistribution() {
        return activityTypeDistribution;
    }

    public void setActivityTypeDistribution(Map<String, Long> activityTypeDistribution) {
        this.activityTypeDistribution = activityTypeDistribution;
    }

    public List<FollowUpResponse> getUpcomingFollowUps() {
        return upcomingFollowUps;
    }

    public void setUpcomingFollowUps(List<FollowUpResponse> upcomingFollowUps) {
        this.upcomingFollowUps = upcomingFollowUps;
    }

    public List<ActivityResponse> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ActivityResponse> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
