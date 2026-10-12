import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiAward,
  FiActivity,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
  FiDollarSign,
  FiCalendar,
  FiPlus,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheckSquare,
  FiArrowRight,
} from 'react-icons/fi';
import { Chart, registerables } from 'chart.js';
import dashboardService from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

// Register Chart.js components
Chart.register(...registerables);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('ALL'); // ALL, MONTH, WEEK, TODAY

  // Canvas refs for Chart.js
  const leadChartRef = useRef(null);
  const oppChartRef = useRef(null);
  const leadChartInstance = useRef(null);
  const oppChartInstance = useRef(null);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dashboardService.getStats();
      if (res && res.data) {
        setStats(res.data.data || res.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to retrieve live CRM dashboard metrics. Please ensure backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Initialize and update charts when stats are available
  useEffect(() => {
    if (!stats) return;

    // 1. Lead Status Doughnut Chart
    if (leadChartRef.current) {
      if (leadChartInstance.current) {
        leadChartInstance.current.destroy();
      }

      const leadDist = stats.leadStatusDistribution || {};
      const labels = Object.keys(leadDist).map((k) => k.replace('_', ' '));
      const dataValues = Object.values(leadDist);

      const ctx = leadChartRef.current.getContext('2d');
      leadChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels.length ? labels : ['No Leads'],
          datasets: [
            {
              data: dataValues.length && dataValues.some((v) => v > 0) ? dataValues : [1],
              backgroundColor: [
                '#3b82f6', // NEW
                '#60a5fa', // CONTACTED
                '#10b981', // QUALIFIED
                '#ef4444', // UNQUALIFIED
                '#8b5cf6', // CONVERTED
                '#64748b', // LOST
              ],
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
              labels: {
                boxWidth: 12,
                padding: 12,
                font: { size: 11 },
              },
            },
          },
          cutout: '65%',
        },
      });
    }

    // 2. Opportunity Stage & Revenue Bar Chart
    if (oppChartRef.current) {
      if (oppChartInstance.current) {
        oppChartInstance.current.destroy();
      }

      const oppDist = stats.opportunityStageDistribution || {};
      const stages = Object.keys(oppDist);
      const counts = stages.map((s) => oppDist[s]?.count || 0);
      const amounts = stages.map((s) => Number(oppDist[s]?.totalAmount || 0));

      const ctx = oppChartRef.current.getContext('2d');
      oppChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: stages.map((s) => s.replace('_', ' ')),
          datasets: [
            {
              label: 'Deal Count',
              data: counts,
              backgroundColor: 'rgba(59, 130, 246, 0.85)',
              borderRadius: 6,
              yAxisID: 'yCount',
            },
            {
              label: 'Total Value ($)',
              data: amounts,
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderRadius: 6,
              yAxisID: 'yAmount',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yCount: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'Deals' },
              beginAtZero: true,
              ticks: { precision: 0 },
            },
            yAmount: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'Amount ($)' },
              beginAtZero: true,
              grid: { drawOnChartArea: false },
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { boxWidth: 12, font: { size: 11 } },
            },
          },
        },
      });
    }

    return () => {
      if (leadChartInstance.current) leadChartInstance.current.destroy();
      if (oppChartInstance.current) oppChartInstance.current.destroy();
    };
  }, [stats]);

  return (
    <div className="container-fluid py-2">
      {/* Top Banner & Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h3 className="fw-bold text-dark mb-0">Executive CRM Dashboard</h3>
            <span
              className={`badge ${
                user?.role === 'ADMIN'
                  ? 'bg-danger'
                  : user?.role === 'MANAGER'
                  ? 'bg-primary'
                  : 'bg-success'
              }`}
            >
              {user?.role || 'User'} View
            </span>
          </div>
          <p className="text-muted small mb-0">
            Real-time pipeline metrics, conversion performance, and scheduled customer touchpoints.
          </p>
        </div>

        {/* Timeframe & Refresh Controls */}
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group btn-group-sm" role="group">
            {['ALL', 'MONTH', 'WEEK', 'TODAY'].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`btn ${timeFilter === filter ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter === 'ALL'
                  ? 'All Time'
                  : filter === 'MONTH'
                  ? 'This Month'
                  : filter === 'WEEK'
                  ? 'This Week'
                  : 'Today'}
              </button>
            ))}
          </div>

          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={fetchStats}
            disabled={loading}
            title="Refresh database metrics"
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} size={14} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-4">
          <FiAlertTriangle size={18} className="flex-shrink-0" />
          <div className="flex-grow-1">{error}</div>
          <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={fetchStats}>
            Retry
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Total Customers */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/customers" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100 hover-shadow transition">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Total Customers</span>
                  <h3 className="fw-bold mt-1 mb-0 text-dark">
                    {loading ? '...' : stats?.totalCustomers ?? 0}
                  </h3>
                  <small className="text-success fw-medium">Active CRM Accounts &rarr;</small>
                </div>
                <div className="p-3 bg-primary-subtle text-primary rounded-3">
                  <FiUsers size={24} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Leads Pipeline */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/leads" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100 hover-shadow transition">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Active Leads</span>
                  <h3 className="fw-bold mt-1 mb-0 text-primary">
                    {loading ? '...' : stats?.openLeads ?? 0}
                  </h3>
                  <small className="text-muted">
                    {stats?.totalLeads ?? 0} total lifetime leads &rarr;
                  </small>
                </div>
                <div className="p-3 bg-info-subtle text-info rounded-3">
                  <FiUserPlus size={24} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Open Pipeline Value */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/opportunities" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100 hover-shadow transition">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Open Pipeline</span>
                  <h3 className="fw-bold mt-1 mb-0 text-dark">
                    $
                    {loading
                      ? '...'
                      : Number(stats?.totalOpenPipelineValue || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                  </h3>
                  <small className="text-muted">
                    Weighted: $
                    {Number(stats?.weightedOpenPipelineValue || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{' '}
                    ({stats?.openOpportunities ?? 0} deals)
                  </small>
                </div>
                <div className="p-3 bg-warning-subtle text-warning rounded-3">
                  <FiTrendingUp size={24} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Closed Won Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/opportunities" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100 hover-shadow transition">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Won Revenue</span>
                  <h3 className="fw-bold mt-1 mb-0 text-success">
                    $
                    {loading
                      ? '...'
                      : Number(stats?.totalWonRevenue || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                  </h3>
                  <small className="text-success fw-medium">
                    {stats?.wonOpportunities ?? 0} won deals &bull; Success rate &rarr;
                  </small>
                </div>
                <div className="p-3 bg-success-subtle text-success rounded-3">
                  <FiAward size={24} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary KPI Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Planned Follow-Ups</span>
                <h4 className="fw-bold mt-1 mb-0 text-dark">{stats?.pendingFollowUps ?? 0}</h4>
              </div>
              <div className="p-2 bg-primary-subtle text-primary rounded-3">
                <FiClock size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Overdue Follow-Ups</span>
                <h4
                  className={`fw-bold mt-1 mb-0 ${
                    stats?.overdueFollowUps > 0 ? 'text-danger' : 'text-success'
                  }`}
                >
                  {stats?.overdueFollowUps ?? 0}
                </h4>
              </div>
              <div
                className={`p-2 rounded-3 ${
                  stats?.overdueFollowUps > 0 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'
                }`}
              >
                <FiAlertTriangle size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Logged Activities</span>
                <h4 className="fw-bold mt-1 mb-0 text-dark">{stats?.totalActivities ?? 0}</h4>
              </div>
              <div className="p-2 bg-info-subtle text-info rounded-3">
                <FiActivity size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Lost Deals</span>
                <h4 className="fw-bold mt-1 mb-0 text-secondary">{stats?.lostOpportunities ?? 0}</h4>
              </div>
              <div className="p-2 bg-secondary-subtle text-secondary rounded-3">
                <FiCheckSquare size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-4">
        {/* Opportunity Pipeline by Stage */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Opportunity Pipeline by Stage</h6>
                <small className="text-muted">Deal counts & total value distribution</small>
              </div>
              <Link to="/opportunities" className="text-decoration-none small fw-semibold text-primary">
                View Deals &rarr;
              </Link>
            </div>
            <div style={{ height: 280, position: 'relative' }}>
              <canvas ref={oppChartRef} />
            </div>
          </div>
        </div>

        {/* Lead Conversion Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Lead Status Mix</h6>
                <small className="text-muted">Active prospect progression</small>
              </div>
              <Link to="/leads" className="text-decoration-none small fw-semibold text-primary">
                View Leads &rarr;
              </Link>
            </div>
            <div style={{ height: 280, position: 'relative' }}>
              <canvas ref={leadChartRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Feeds: Upcoming Follow-ups & Recent Activities */}
      <div className="row g-4 mb-4">
        {/* Upcoming Follow-ups */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <FiClock className="text-primary" />
                <h6 className="fw-bold text-dark mb-0">Upcoming Follow-Ups</h6>
              </div>
              <Link to="/follow-ups" className="small fw-semibold text-primary text-decoration-none">
                All Follow-Ups &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4 text-muted small">Loading schedule...</div>
            ) : !stats?.upcomingFollowUps || stats.upcomingFollowUps.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <FiCheckCircle size={32} className="text-success opacity-50 mb-2" />
                <p className="mb-0">All follow-ups completed! No pending items.</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {stats.upcomingFollowUps.map((item) => (
                  <div
                    key={item.id}
                    className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-semibold text-dark small">{item.subject}</div>
                      <small className="text-muted">
                        {item.customerName || item.leadName || 'General'} &bull; Assigned:{' '}
                        {item.assignedTo || 'Unassigned'}
                      </small>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-light text-dark border small">{item.followUpType}</span>
                      <div className="small text-muted mt-1">{item.followUpDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <FiActivity className="text-info" />
                <h6 className="fw-bold text-dark mb-0">Recent Activities & Logs</h6>
              </div>
              <Link to="/activities" className="small fw-semibold text-primary text-decoration-none">
                All Activities &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4 text-muted small">Loading activities...</div>
            ) : !stats?.recentActivities || stats.recentActivities.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <p className="mb-0">No activities recorded yet.</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {stats.recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-semibold text-dark small">{act.subject}</div>
                      <small className="text-muted">
                        {act.customerName || act.leadName || 'General'} &bull; {act.assignedTo || 'Rep'}
                      </small>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary-subtle text-primary small">
                        {act.activityType}
                      </span>
                      <div className="small text-muted mt-1">{act.activityDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="card border-0 shadow-sm rounded-3 p-4 bg-light">
        <h6 className="fw-bold text-dark mb-3">Quick CRM Actions</h6>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/customers" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
            <FiPlus size={14} /> New Customer
          </Link>
          <Link to="/leads" className="btn btn-outline-success btn-sm d-flex align-items-center gap-1">
            <FiPlus size={14} /> New Lead
          </Link>
          <Link to="/opportunities" className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1">
            <FiPlus size={14} /> New Deal / Opportunity
          </Link>
          <Link to="/follow-ups" className="btn btn-outline-info btn-sm d-flex align-items-center gap-1">
            <FiClock size={14} /> Schedule Follow-Up
          </Link>
          <Link to="/activities" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <FiActivity size={14} /> Log Activity
          </Link>
        </div>
      </div>
    </div>
  );
}
