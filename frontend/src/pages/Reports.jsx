import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FiBarChart2,
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiLayers,
  FiFileText,
  FiPieChart,
  FiCheckCircle,
  FiDollarSign,
  FiAward,
} from 'react-icons/fi';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import customerService from '../services/customerService';
import leadService from '../services/leadService';
import opportunityService from '../services/opportunityService';
import followUpService from '../services/followUpService';

// Register Chart.js components
Chart.register(...registerables);

export default function Reports() {
  const [activeTab, setActiveTab] = useState('customers'); // customers, leads, opportunities, followups, pipeline
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Raw datasets
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Chart Canvas Refs & Instances
  const stageBarChartRef = useRef(null);
  const leadDoughnutChartRef = useRef(null);
  const oppPieChartRef = useRef(null);

  const stageBarChartInstance = useRef(null);
  const leadDoughnutChartInstance = useRef(null);
  const oppPieChartInstance = useRef(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cRes, lRes, oRes, fRes] = await Promise.all([
        customerService.getAll(),
        leadService.getAll(),
        opportunityService.getAll(),
        followUpService.getAll(),
      ]);
      setCustomers(cRes.data || []);
      setLeads(lRes.data || []);
      setOpportunities(oRes.data || []);
      setFollowUps(fRes.data || []);
    } catch (err) {
      console.error('Failed to load reporting datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtered datasets based on active tab and filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        c.customerName?.toLowerCase().includes(term) ||
        c.customerCode?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.companyName?.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        l.leadName?.toLowerCase().includes(term) ||
        l.leadCode?.toLowerCase().includes(term) ||
        l.companyName?.toLowerCase().includes(term) ||
        l.email?.toLowerCase().includes(term)
      );
    });
  }, [leads, searchTerm, statusFilter]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((o) => {
      if (stageFilter !== 'ALL' && o.stage !== stageFilter) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        o.opportunityName?.toLowerCase().includes(term) ||
        o.opportunityCode?.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term) ||
        o.leadName?.toLowerCase().includes(term)
      );
    });
  }, [opportunities, searchTerm, stageFilter]);

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((f) => {
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        f.subject?.toLowerCase().includes(term) ||
        f.customerName?.toLowerCase().includes(term) ||
        f.leadName?.toLowerCase().includes(term) ||
        f.assignedTo?.toLowerCase().includes(term)
      );
    });
  }, [followUps, searchTerm, statusFilter]);

  // Pipeline summary calculations
  const pipelineMetrics = useMemo(() => {
    const totalVal = opportunities.reduce(
      (acc, o) => acc + (Number(o.amount) || 0),
      0
    );
    const wonVal = opportunities
      .filter((o) => o.stage === 'WON')
      .reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
    const openOpps = opportunities.filter(
      (o) => o.stage !== 'WON' && o.stage !== 'LOST'
    );
    const openVal = openOpps.reduce(
      (acc, o) => acc + (Number(o.amount) || 0),
      0
    );
    const winRate = opportunities.length
      ? (
          (opportunities.filter((o) => o.stage === 'WON').length /
            opportunities.length) *
          100
        ).toFixed(1)
      : 0;

    return { totalVal, wonVal, openVal, winRate };
  }, [opportunities]);

  // Chart rendering effect
  useEffect(() => {
    if (loading) return;

    // 1. Stage Value Bar Chart
    if (stageBarChartRef.current) {
      if (stageBarChartInstance.current) {
        stageBarChartInstance.current.destroy();
      }
      const stages = ['QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
      const stageValues = stages.map((s) =>
        opportunities
          .filter((o) => o.stage === s)
          .reduce((acc, o) => acc + (Number(o.amount) || 0), 0)
      );

      stageBarChartInstance.current = new Chart(stageBarChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'],
          datasets: [
            {
              label: 'Pipeline Value ($)',
              data: stageValues,
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(147, 51, 234, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(239, 68, 68, 0.8)',
              ],
              borderColor: ['#3b82f6', '#9333ea', '#f59e0b', '#10b981', '#ef4444'],
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ` $${Number(ctx.raw || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => `$${Number(val).toLocaleString()}`,
              },
            },
          },
        },
      });
    }

    // 2. Lead Status Doughnut Chart
    if (leadDoughnutChartRef.current) {
      if (leadDoughnutChartInstance.current) {
        leadDoughnutChartInstance.current.destroy();
      }
      const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED'];
      const leadCounts = leadStatuses.map(
        (st) => leads.filter((l) => l.status === st).length
      );

      leadDoughnutChartInstance.current = new Chart(
        leadDoughnutChartRef.current,
        {
          type: 'doughnut',
          data: {
            labels: ['New', 'Contacted', 'Qualified', 'Unqualified'],
            datasets: [
              {
                data: leadCounts.every((c) => c === 0)
                  ? [1, 1, 1, 1]
                  : leadCounts,
                backgroundColor: ['#06b6d4', '#3b82f6', '#10b981', '#94a3b8'],
                borderWidth: 2,
                borderColor: '#ffffff',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 12, font: { size: 11 } },
              },
            },
          },
        }
      );
    }

    // 3. Opportunity Outcome Composition (Pie Chart)
    if (oppPieChartRef.current) {
      if (oppPieChartInstance.current) {
        oppPieChartInstance.current.destroy();
      }
      const wonCount = opportunities.filter((o) => o.stage === 'WON').length;
      const lostCount = opportunities.filter((o) => o.stage === 'LOST').length;
      const openCount = opportunities.filter(
        (o) => o.stage !== 'WON' && o.stage !== 'LOST'
      ).length;

      oppPieChartInstance.current = new Chart(oppPieChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Won Deals', 'Lost Deals', 'Open Deals'],
          datasets: [
            {
              data:
                wonCount === 0 && lostCount === 0 && openCount === 0
                  ? [1, 1, 1]
                  : [wonCount, lostCount, openCount],
              backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 11 } },
            },
          },
        },
      });
    }

    return () => {
      if (stageBarChartInstance.current)
        stageBarChartInstance.current.destroy();
      if (leadDoughnutChartInstance.current)
        leadDoughnutChartInstance.current.destroy();
      if (oppPieChartInstance.current) oppPieChartInstance.current.destroy();
    };
  }, [opportunities, leads, loading]);

  // Client-Side CSV Export Utility
  const exportToCSV = (filename, headers, rows) => {
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      'download',
      `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    if (activeTab === 'customers') {
      const headers = [
        'Code',
        'Customer Name',
        'Email',
        'Phone',
        'Company',
        'City',
        'Status',
        'Created Date',
      ];
      const rows = filteredCustomers.map((c) => [
        c.customerCode,
        c.customerName,
        c.email,
        c.phone,
        c.companyName,
        c.city,
        c.status,
        c.createdAt,
      ]);
      exportToCSV('AcxiomCRM_Customer_Report', headers, rows);
    } else if (activeTab === 'leads') {
      const headers = [
        'Lead Code',
        'Lead Name',
        'Email',
        'Phone',
        'Company',
        'Source',
        'Status',
        'Assigned To',
      ];
      const rows = filteredLeads.map((l) => [
        l.leadCode,
        l.leadName,
        l.email,
        l.phone,
        l.companyName,
        l.source,
        l.status,
        l.assignedTo,
      ]);
      exportToCSV('AcxiomCRM_Lead_Report', headers, rows);
    } else if (activeTab === 'opportunities') {
      const headers = [
        'Code',
        'Opportunity Name',
        'Customer/Lead',
        'Amount ($)',
        'Stage',
        'Probability (%)',
        'Expected Close',
        'Status',
      ];
      const rows = filteredOpportunities.map((o) => [
        o.opportunityCode,
        o.opportunityName,
        o.customerName || o.leadName || 'None',
        o.amount,
        o.stage,
        o.probability,
        o.expectedCloseDate,
        o.status,
      ]);
      exportToCSV('AcxiomCRM_Opportunity_Report', headers, rows);
    } else if (activeTab === 'followups') {
      const headers = [
        'Subject',
        'Type',
        'Associated Record',
        'Scheduled Date',
        'Status',
        'Assigned To',
        'Remarks',
      ];
      const rows = filteredFollowUps.map((f) => [
        f.subject,
        f.followUpType,
        f.customerName
          ? `Customer: ${f.customerName}`
          : f.leadName
          ? `Lead: ${f.leadName}`
          : 'None',
        f.followUpDate,
        f.status,
        f.assignedTo,
        f.remarks,
      ]);
      exportToCSV('AcxiomCRM_FollowUp_Report', headers, rows);
    } else if (activeTab === 'pipeline') {
      const headers = [
        'Stage',
        'Deal Count',
        'Total Value ($)',
        'Avg Value ($)',
      ];
      const stages = [
        'QUALIFICATION',
        'PROPOSAL',
        'NEGOTIATION',
        'WON',
        'LOST',
      ];
      const rows = stages.map((s) => {
        const stageOpps = opportunities.filter((o) => o.stage === s);
        const total = stageOpps.reduce(
          (acc, o) => acc + (Number(o.amount) || 0),
          0
        );
        const avg = stageOpps.length ? (total / stageOpps.length).toFixed(2) : 0;
        return [s, stageOpps.length, total.toFixed(2), avg];
      });
      exportToCSV('AcxiomCRM_Pipeline_Summary', headers, rows);
    }
  };

  // High-Resolution PDF Export with Graphs & Tables
  const handleExportPDF = async () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      const reportElement = document.getElementById('exportable-report-content');
      if (!reportElement) {
        alert('Could not find report content to export.');
        return;
      }

      // Capture styled report container with high scale
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 standard width in mm
      const pageHeight = 297; // A4 standard height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page documents seamlessly
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const tabTitle = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      const dateString = new Date().toISOString().split('T')[0];
      pdf.save(`AcxiomCRM_${tabTitle}_Report_${dateString}.pdf`);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 5000);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FiBarChart2 className="text-primary" />
            <span>Reports &amp; Analytics</span>
          </h3>
          <p className="text-muted small mb-0">
            Exportable customer listings, lead pipelines, deal summaries, and
            visual graph reports.
          </p>
        </div>

        {/* Action Buttons: Refresh, CSV, and PDF with Graphs */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={loadAllData}
            disabled={loading || isGeneratingPdf}
          >
            <FiRefreshCw
              className={loading ? 'spinner-border spinner-border-sm' : ''}
              size={14}
            />
            <span>Refresh Data</span>
          </button>

          {/* Export CSV button */}
          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 fw-semibold shadow-xs"
            onClick={handleExportCSV}
            disabled={loading || isGeneratingPdf}
            title="Export filtered records to spreadsheet CSV"
          >
            <FiDownload size={14} />
            <span>Export to CSV</span>
          </button>

          {/* Download PDF with Graphs button */}
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 fw-bold shadow-sm"
            style={{ backgroundColor: '#0176d3', border: 'none' }}
            onClick={handleExportPDF}
            disabled={loading || isGeneratingPdf}
            title="Download executive PDF with embedded graphs and tables"
          >
            {isGeneratingPdf ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FiFileText size={15} />
                <span>Download PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Success Toast / Notification */}
      {pdfSuccess && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 py-2 mb-3 shadow-xs">
          <FiCheckCircle size={18} />
          <span className="small">
            <strong>PDF Generated!</strong> Your executive PDF report with
            embedded graphs has been downloaded.
          </span>
          <button
            type="button"
            className="btn-close py-2"
            onClick={() => setPdfSuccess(false)}
          />
        </div>
      )}

      {/* Report Type Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === 'customers' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('customers')}
          >
            <FiUsers size={16} />
            <span>Customer Report ({customers.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === 'leads' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('leads')}
          >
            <FiUserPlus size={16} />
            <span>Lead Report ({leads.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === 'opportunities' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('opportunities')}
          >
            <FiTrendingUp size={16} />
            <span>Opportunity Report ({opportunities.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === 'followups' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('followups')}
          >
            <FiClock size={16} />
            <span>Follow-Up Report ({followUps.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === 'pipeline' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('pipeline')}
          >
            <FiLayers size={16} />
            <span>Pipeline Analytics</span>
          </button>
        </li>
      </ul>

      {/* Search & Filter Toolbar */}
      {activeTab !== 'pipeline' && (
        <div className="card border-0 shadow-sm rounded-3 mb-4 p-3 bg-white">
          <div className="row g-2 align-items-center">
            <div className="col-md-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <FiSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search records in active report..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {activeTab === 'opportunities' && (
              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light">Stage</span>
                  <select
                    className="form-select bg-light"
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                  >
                    <option value="ALL">All Stages</option>
                    <option value="QUALIFICATION">Qualification</option>
                    <option value="PROPOSAL">Proposal</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>
              </div>
            )}

            {(activeTab === 'leads' || activeTab === 'followups') && (
              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light">Status</span>
                  <select
                    className="form-select bg-light"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    {activeTab === 'leads' ? (
                      <>
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="UNQUALIFIED">Unqualified</option>
                      </>
                    ) : (
                      <>
                        <option value="PLANNED">Planned</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="MISSED">Missed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        EXPORTABLE REPORT CONTAINER 
        (This entire section with Graphs, KPIs, and Tables is converted into PDF)
        ========================================================================
      */}
      <div
        id="exportable-report-content"
        className="p-4 bg-white rounded-4 shadow-sm border"
        style={{ borderColor: '#e2e8f0' }}
      >
        {/* PDF Executive Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 text-white shadow-sm"
              style={{
                width: 44,
                height: 44,
                background: 'linear-gradient(135deg, #0176d3 0%, #032d60 100%)',
                fontSize: '1.4rem',
                fontWeight: 800,
              }}
            >
              ☁
            </div>
            <div>
              <h4 className="fw-bold mb-0" style={{ color: '#032d60' }}>
                AcxiomCRM &bull; Executive Intelligence Report
              </h4>
              <div className="text-muted small">
                Module:{' '}
                <strong className="text-primary text-uppercase">
                  {activeTab} Report
                </strong>{' '}
                &bull; Generated on{' '}
                {new Date().toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                at{' '}
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          <div className="text-end mt-2 mt-sm-0">
            <span
              className="badge px-3 py-1 rounded-pill text-white fw-bold mb-1"
              style={{ backgroundColor: '#0176d3' }}
            >
              Enterprise v1.0
            </span>
            <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
              Lead Dev: <strong>Sai Santanu Sahoo</strong> (CVRGU)
            </div>
          </div>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 bg-light border text-center">
              <div className="text-muted small text-uppercase fw-semibold">
                Total Customers
              </div>
              <h4 className="fw-bold text-dark mb-0">{customers.length}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 bg-light border text-center">
              <div className="text-muted small text-uppercase fw-semibold">
                Total Leads
              </div>
              <h4 className="fw-bold text-primary mb-0">{leads.length}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 bg-light border text-center">
              <div className="text-muted small text-uppercase fw-semibold">
                Total Pipeline ($)
              </div>
              <h4 className="fw-bold text-success mb-0">
                $
                {pipelineMetrics.totalVal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 bg-light border text-center">
              <div className="text-muted small text-uppercase fw-semibold">
                Win Rate
              </div>
              <h4 className="fw-bold text-info mb-0">
                {pipelineMetrics.winRate}%
              </h4>
            </div>
          </div>
        </div>

        {/* Graphs Section (Embedded in Report and Included in PDF) */}
        <div className="row g-3 mb-4">
          {/* Graph 1: Deal Value by Stage Bar Chart */}
          <div className="col-lg-6">
            <div className="card border rounded-3 p-3 h-100 shadow-xs">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6
                  className="fw-bold mb-0 d-flex align-items-center gap-2"
                  style={{ color: '#032d60' }}
                >
                  <FiBarChart2 className="text-primary" />
                  <span>Pipeline Value by Stage ($)</span>
                </h6>
                <small className="text-muted">Real-time Deals</small>
              </div>
              <div style={{ height: '220px', position: 'relative' }}>
                <canvas ref={stageBarChartRef} />
              </div>
            </div>
          </div>

          {/* Graph 2: Lead Status Mix Doughnut Chart */}
          <div className="col-lg-3 col-md-6">
            <div className="card border rounded-3 p-3 h-100 shadow-xs">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6
                  className="fw-bold mb-0 d-flex align-items-center gap-2"
                  style={{ color: '#032d60' }}
                >
                  <FiPieChart className="text-success" />
                  <span>Lead Status Mix</span>
                </h6>
                <small className="text-muted">Total: {leads.length}</small>
              </div>
              <div style={{ height: '220px', position: 'relative' }}>
                <canvas ref={leadDoughnutChartRef} />
              </div>
            </div>
          </div>

          {/* Graph 3: Opportunity Win/Loss Ratio Pie Chart */}
          <div className="col-lg-3 col-md-6">
            <div className="card border rounded-3 p-3 h-100 shadow-xs">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6
                  className="fw-bold mb-0 d-flex align-items-center gap-2"
                  style={{ color: '#032d60' }}
                >
                  <FiTrendingUp className="text-info" />
                  <span>Deal Outcomes</span>
                </h6>
                <small className="text-muted">{opportunities.length} Deals</small>
              </div>
              <div style={{ height: '220px', position: 'relative' }}>
                <canvas ref={oppPieChartRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabular Records Section */}
        <div className="border rounded-3 overflow-hidden">
          <div className="bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
            <span className="fw-bold text-dark small text-uppercase">
              Detailed Data Records ({activeTab})
            </span>
            <span className="badge bg-secondary-subtle text-secondary small">
              {activeTab === 'customers' && `${filteredCustomers.length} records`}
              {activeTab === 'leads' && `${filteredLeads.length} records`}
              {activeTab === 'opportunities' &&
                `${filteredOpportunities.length} records`}
              {activeTab === 'followups' &&
                `${filteredFollowUps.length} records`}
              {activeTab === 'pipeline' && '5 stages'}
            </span>
          </div>

          {/* Tab 1 Table: Customers */}
          {activeTab === 'customers' && (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light small text-secondary text-uppercase">
                  <tr>
                    <th>Code</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>City</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No customer records match filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <code>{c.customerCode}</code>
                        </td>
                        <td className="fw-semibold text-dark">
                          {c.customerName}
                        </td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{c.companyName || '-'}</td>
                        <td>{c.city || '-'}</td>
                        <td>
                          <span
                            className={`badge ${
                              c.status === 'ACTIVE'
                                ? 'bg-success-subtle text-success'
                                : 'bg-secondary'
                            }`}
                          >
                            {c.status || 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2 Table: Leads */}
          {activeTab === 'leads' && (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light small text-secondary text-uppercase">
                  <tr>
                    <th>Code</th>
                    <th>Lead Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No lead records found.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <code>{l.leadCode}</code>
                        </td>
                        <td className="fw-semibold text-dark">{l.leadName}</td>
                        <td>{l.email || '-'}</td>
                        <td>{l.phone || '-'}</td>
                        <td>{l.companyName || '-'}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {l.source || 'Website'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info-subtle text-info">
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3 Table: Opportunities */}
          {activeTab === 'opportunities' && (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light small text-secondary text-uppercase">
                  <tr>
                    <th>Code</th>
                    <th>Deal Name</th>
                    <th>Associated Account</th>
                    <th>Amount</th>
                    <th>Stage</th>
                    <th>Probability</th>
                    <th>Expected Close</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No opportunity records found.
                      </td>
                    </tr>
                  ) : (
                    filteredOpportunities.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <code>{o.opportunityCode}</code>
                        </td>
                        <td className="fw-semibold text-dark">
                          {o.opportunityName}
                        </td>
                        <td>{o.customerName || o.leadName || '-'}</td>
                        <td className="fw-bold text-dark">
                          $
                          {Number(o.amount || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              o.stage === 'WON'
                                ? 'bg-success'
                                : o.stage === 'LOST'
                                ? 'bg-danger'
                                : 'bg-primary'
                            }`}
                          >
                            {o.stage}
                          </span>
                        </td>
                        <td>{o.probability}%</td>
                        <td>{o.expectedCloseDate || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4 Table: Follow-Ups */}
          {activeTab === 'followups' && (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light small text-secondary text-uppercase">
                  <tr>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Associated Client</th>
                    <th>Scheduled Date</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFollowUps.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No follow-up records found.
                      </td>
                    </tr>
                  ) : (
                    filteredFollowUps.map((f) => (
                      <tr key={f.id}>
                        <td className="fw-semibold text-dark">{f.subject}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {f.followUpType}
                          </span>
                        </td>
                        <td>{f.customerName || f.leadName || '-'}</td>
                        <td>{f.followUpDate}</td>
                        <td>
                          <span
                            className={`badge ${
                              f.status === 'COMPLETED'
                                ? 'bg-success-subtle text-success'
                                : 'bg-primary-subtle text-primary'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td>{f.assignedTo || 'Unassigned'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 5 Table: Pipeline Summary */}
          {activeTab === 'pipeline' && (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small text-secondary text-uppercase">
                  <tr>
                    <th>Pipeline Stage</th>
                    <th>Deals Count</th>
                    <th>Total Value</th>
                    <th>Average Deal Size</th>
                    <th>% of Total Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'QUALIFICATION',
                    'PROPOSAL',
                    'NEGOTIATION',
                    'WON',
                    'LOST',
                  ].map((stage) => {
                    const stageDeals = opportunities.filter(
                      (o) => o.stage === stage
                    );
                    const stageSum = stageDeals.reduce(
                      (acc, o) => acc + (Number(o.amount) || 0),
                      0
                    );
                    const pct =
                      pipelineMetrics.totalVal > 0
                        ? (stageSum / pipelineMetrics.totalVal) * 100
                        : 0;
                    return (
                      <tr key={stage}>
                        <td className="fw-semibold text-dark">{stage}</td>
                        <td>{stageDeals.length}</td>
                        <td className="fw-bold text-dark">
                          $
                          {stageSum.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          $
                          {stageDeals.length
                            ? (stageSum / stageDeals.length).toLocaleString(
                                undefined,
                                { minimumFractionDigits: 2 }
                              )
                            : '0.00'}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="progress flex-grow-1"
                              style={{ height: 6 }}
                            >
                              <div
                                className={`progress-bar ${
                                  stage === 'WON'
                                    ? 'bg-success'
                                    : stage === 'LOST'
                                    ? 'bg-danger'
                                    : 'bg-primary'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <small
                              className="text-muted"
                              style={{ minWidth: 40 }}
                            >
                              {pct.toFixed(0)}%
                            </small>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PDF Executive Footer Attribution */}
        <div className="mt-4 pt-3 border-top text-center text-muted small">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div>
              AcxiomCRM &bull; Governed MySQL Persistence &amp; Spring Security
              6 RBAC
            </div>
            <div>
              Engineered by{' '}
              <strong className="text-dark">Sai Santanu Sahoo</strong> &bull;{' '}
              <span className="text-primary">
                C.V. Raman Global University, Bhubaneswar
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
