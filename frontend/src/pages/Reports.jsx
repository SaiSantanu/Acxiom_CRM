import React, { useState, useEffect, useMemo } from 'react';
import {
  FiBarChart2,
  FiDownload,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiLayers,
} from 'react-icons/fi';
import customerService from '../services/customerService';
import leadService from '../services/leadService';
import opportunityService from '../services/opportunityService';
import followUpService from '../services/followUpService';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('customers'); // customers, leads, opportunities, followups, pipeline
  const [loading, setLoading] = useState(true);

  // Raw datasets
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (activeTab === 'customers') {
      const headers = ['Code', 'Customer Name', 'Email', 'Phone', 'Company', 'City', 'Status', 'Created Date'];
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
      const headers = ['Lead Code', 'Lead Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Assigned To'];
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
      const headers = ['Code', 'Opportunity Name', 'Customer/Lead', 'Amount ($)', 'Stage', 'Probability (%)', 'Expected Close', 'Status'];
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
      const headers = ['Subject', 'Type', 'Associated Record', 'Scheduled Date', 'Status', 'Assigned To', 'Remarks'];
      const rows = filteredFollowUps.map((f) => [
        f.subject,
        f.followUpType,
        f.customerName ? `Customer: ${f.customerName}` : f.leadName ? `Lead: ${f.leadName}` : 'None',
        f.followUpDate,
        f.status,
        f.assignedTo,
        f.remarks,
      ]);
      exportToCSV('AcxiomCRM_FollowUp_Report', headers, rows);
    } else if (activeTab === 'pipeline') {
      const headers = ['Stage', 'Deal Count', 'Total Value ($)', 'Avg Value ($)'];
      const stages = ['QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
      const rows = stages.map((s) => {
        const stageOpps = opportunities.filter((o) => o.stage === s);
        const total = stageOpps.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
        const avg = stageOpps.length ? (total / stageOpps.length).toFixed(2) : 0;
        return [s, stageOpps.length, total.toFixed(2), avg];
      });
      exportToCSV('AcxiomCRM_Pipeline_Summary', headers, rows);
    }
  };

  // Pipeline summary calculations
  const pipelineMetrics = useMemo(() => {
    const totalVal = opportunities.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
    const wonVal = opportunities
      .filter((o) => o.stage === 'WON')
      .reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
    const openOpps = opportunities.filter((o) => o.stage !== 'WON' && o.stage !== 'LOST');
    const openVal = openOpps.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
    const winRate = opportunities.length
      ? ((opportunities.filter((o) => o.stage === 'WON').length / opportunities.length) * 100).toFixed(1)
      : 0;

    return { totalVal, wonVal, openVal, winRate };
  }, [opportunities]);

  return (
    <div className="container-fluid py-2">
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FiBarChart2 className="text-primary" />
            <span>Reports & Analytics</span>
          </h3>
          <p className="text-muted small mb-0">
            Exportable customer listings, lead pipelines, deal summaries, and follow-up metrics.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={loadAllData}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} size={14} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 fw-semibold shadow-sm"
            onClick={handleExport}
            disabled={loading}
          >
            <FiDownload size={14} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <FiUsers size={16} />
            <span>Customer Report ({customers.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <FiUserPlus size={16} />
            <span>Lead Report ({leads.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => setActiveTab('opportunities')}
          >
            <FiTrendingUp size={16} />
            <span>Opportunity Report ({opportunities.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'followups' ? 'active' : ''}`}
            onClick={() => setActiveTab('followups')}
          >
            <FiClock size={16} />
            <span>Follow-Up Report ({followUps.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            <FiLayers size={16} />
            <span>Pipeline Analytics</span>
          </button>
        </li>
      </ul>

      {/* Filter Toolbar (for table tabs) */}
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

      {/* Tab 1: Customer Report */}
      {activeTab === 'customers' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
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
                      <td><code>{c.customerCode}</code></td>
                      <td className="fw-semibold text-dark">{c.customerName}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>{c.companyName || '-'}</td>
                      <td>{c.city || '-'}</td>
                      <td>
                        <span className={`badge ${c.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-secondary'}`}>
                          {c.status || 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Lead Report */}
      {activeTab === 'leads' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
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
                      <td><code>{l.leadCode}</code></td>
                      <td className="fw-semibold text-dark">{l.leadName}</td>
                      <td>{l.email || '-'}</td>
                      <td>{l.phone || '-'}</td>
                      <td>{l.companyName || '-'}</td>
                      <td><span className="badge bg-light text-dark border">{l.source || 'Website'}</span></td>
                      <td><span className="badge bg-info-subtle text-info">{l.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Opportunity Report */}
      {activeTab === 'opportunities' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
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
                      <td><code>{o.opportunityCode}</code></td>
                      <td className="fw-semibold text-dark">{o.opportunityName}</td>
                      <td>{o.customerName || o.leadName || '-'}</td>
                      <td className="fw-bold text-dark">
                        ${Number(o.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge ${o.stage === 'WON' ? 'bg-success' : o.stage === 'LOST' ? 'bg-danger' : 'bg-primary'}`}>
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
        </div>
      )}

      {/* Tab 4: Follow-Up Report */}
      {activeTab === 'followups' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
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
                      <td><span className="badge bg-light text-dark border">{f.followUpType}</span></td>
                      <td>{f.customerName || f.leadName || '-'}</td>
                      <td>{f.followUpDate}</td>
                      <td>
                        <span className={`badge ${f.status === 'COMPLETED' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'}`}>
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
        </div>
      )}

      {/* Tab 5: Pipeline Analytics Summary */}
      {activeTab === 'pipeline' && (
        <div>
          {/* Summary KPIs */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-3 p-3">
                <span className="text-muted small fw-medium text-uppercase">Total Pipeline</span>
                <h4 className="fw-bold mt-1 mb-0 text-dark">
                  ${pipelineMetrics.totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h4>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-3 p-3">
                <span className="text-muted small fw-medium text-uppercase">Open Pipeline Value</span>
                <h4 className="fw-bold mt-1 mb-0 text-primary">
                  ${pipelineMetrics.openVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h4>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-3 p-3">
                <span className="text-muted small fw-medium text-uppercase">Closed Won Deals</span>
                <h4 className="fw-bold mt-1 mb-0 text-success">
                  ${pipelineMetrics.wonVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h4>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-3 p-3">
                <span className="text-muted small fw-medium text-uppercase">Win Rate</span>
                <h4 className="fw-bold mt-1 mb-0 text-info">{pipelineMetrics.winRate}%</h4>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom">
              <h6 className="fw-bold mb-0 text-dark">Stage Velocity & Value Breakdown</h6>
            </div>
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
                  {['QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map((stage) => {
                    const stageDeals = opportunities.filter((o) => o.stage === stage);
                    const stageSum = stageDeals.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
                    const pct = pipelineMetrics.totalVal > 0 ? (stageSum / pipelineMetrics.totalVal) * 100 : 0;
                    return (
                      <tr key={stage}>
                        <td className="fw-semibold text-dark">{stage}</td>
                        <td>{stageDeals.length}</td>
                        <td className="fw-bold text-dark">
                          ${stageSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          $
                          {stageDeals.length
                            ? (stageSum / stageDeals.length).toLocaleString(undefined, { minimumFractionDigits: 2 })
                            : '0.00'}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: 6 }}>
                              <div
                                className={`progress-bar ${stage === 'WON' ? 'bg-success' : stage === 'LOST' ? 'bg-danger' : 'bg-primary'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <small className="text-muted" style={{ minWidth: 40 }}>
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
          </div>
        </div>
      )}
    </div>
  );
}
