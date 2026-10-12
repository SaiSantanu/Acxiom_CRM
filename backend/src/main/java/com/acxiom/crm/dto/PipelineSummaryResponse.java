package com.acxiom.crm.dto;

import java.math.BigDecimal;

/**
 * Summary metrics of the sales pipeline.
 */
public class PipelineSummaryResponse {

    private long totalOpportunities;
    private long openOpportunities;
    private long wonOpportunities;
    private long lostOpportunities;
    private BigDecimal totalOpenPipeline;
    private BigDecimal weightedOpenPipeline;
    private BigDecimal totalWonRevenue;
    private BigDecimal totalLostValue;

    public PipelineSummaryResponse() {
        this.totalOpenPipeline = BigDecimal.ZERO;
        this.weightedOpenPipeline = BigDecimal.ZERO;
        this.totalWonRevenue = BigDecimal.ZERO;
        this.totalLostValue = BigDecimal.ZERO;
    }

    public PipelineSummaryResponse(long totalOpportunities, long openOpportunities, long wonOpportunities,
                                   long lostOpportunities, BigDecimal totalOpenPipeline,
                                   BigDecimal weightedOpenPipeline, BigDecimal totalWonRevenue,
                                   BigDecimal totalLostValue) {
        this.totalOpportunities = totalOpportunities;
        this.openOpportunities = openOpportunities;
        this.wonOpportunities = wonOpportunities;
        this.lostOpportunities = lostOpportunities;
        this.totalOpenPipeline = totalOpenPipeline != null ? totalOpenPipeline : BigDecimal.ZERO;
        this.weightedOpenPipeline = weightedOpenPipeline != null ? weightedOpenPipeline : BigDecimal.ZERO;
        this.totalWonRevenue = totalWonRevenue != null ? totalWonRevenue : BigDecimal.ZERO;
        this.totalLostValue = totalLostValue != null ? totalLostValue : BigDecimal.ZERO;
    }

    // Getters and Setters
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

    public BigDecimal getTotalOpenPipeline() {
        return totalOpenPipeline;
    }

    public void setTotalOpenPipeline(BigDecimal totalOpenPipeline) {
        this.totalOpenPipeline = totalOpenPipeline;
    }

    public BigDecimal getWeightedOpenPipeline() {
        return weightedOpenPipeline;
    }

    public void setWeightedOpenPipeline(BigDecimal weightedOpenPipeline) {
        this.weightedOpenPipeline = weightedOpenPipeline;
    }

    public BigDecimal getTotalWonRevenue() {
        return totalWonRevenue;
    }

    public void setTotalWonRevenue(BigDecimal totalWonRevenue) {
        this.totalWonRevenue = totalWonRevenue;
    }

    public BigDecimal getTotalLostValue() {
        return totalLostValue;
    }

    public void setTotalLostValue(BigDecimal totalLostValue) {
        this.totalLostValue = totalLostValue;
    }
}
