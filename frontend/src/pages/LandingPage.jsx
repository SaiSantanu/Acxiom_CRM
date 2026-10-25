import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiArrowRight,
  FiShield,
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiAward,
  FiMapPin,
  FiLock,
  FiLogIn,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiPhoneCall,
  FiCpu,
  FiLayers,
  FiZap,
  FiGlobe,
  FiStar,
  FiBookOpen,
  FiCompass,
  FiBarChart2,
  FiMessageSquare,
  FiBriefcase,
  FiShoppingBag,
  FiTruck,
  FiHeart,
  FiCheck,
} from 'react-icons/fi';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Testimonials matching the Salesforce India prompt
  const testimonials = [
    {
      name: 'Kripadyuti Sarkar',
      title: 'Group CIO, Ambuja Neotia Group',
      quote:
        'AcxiomCRM has revolutionized how our real estate sales force tracks lead conversion and buyer touchpoints across eastern India. The agentic automation delivered immediate ROI within weeks of rollout.',
      badge: 'Real Estate & Infrastructure',
    },
    {
      name: 'Sanjay Dutt',
      title: 'MD & CEO, Tata Realty & Infrastructure Limited',
      quote:
        'The agentic CRM capabilities provide our commercial leasing and asset teams unprecedented visibility into pipeline velocity and customer 360 data.',
      badge: 'Commercial Enterprise',
    },
    {
      name: 'Dr. Ganesh Prasad',
      title: 'Director - Dept of IT & Digital Transformation, MAHE',
      quote:
        'Managing hundreds of thousands of student admissions and institutional partnerships became frictionless once we unified our pipeline onto AcxiomCRM.',
      badge: 'Higher Education',
    },
    {
      name: 'Indranil Mukherjee',
      title: 'Deputy Vice President & Head - Customer Experience, PVR Limited',
      quote:
        'With AcxiomCRM, every guest interaction is grounded in enterprise context. Service case resolution improved by over 60% autonomously.',
      badge: 'Media & Entertainment',
    },
    {
      name: 'Rajesh Potdar',
      title: 'Chief Digital Information Officer, Shakti Pumps (India) Limited',
      quote:
        'Our nationwide distributor network of 5,000+ channel partners now operates on real-time inventory and opportunity signals with zero data lag.',
      badge: 'Manufacturing & Industrial',
    },
    {
      name: 'Sankaranarayanan Raghavan',
      title: 'Chief Technology and Digital Officer, IndiaFirst Life',
      quote:
        'Compliance, role-based authorization, and iron-clad audit trails are non-negotiable for insurance. AcxiomCRM delivered all three flawlessly.',
      badge: 'Banking & Financial Services',
    },
    {
      name: 'Saiprasad Potaraju',
      title: 'Head of Enterprise Applications, Hero FinCorp',
      quote:
        'Loan origination cycle times dropped drastically. The date-validated follow-up engine ensures our loan officers never drop an active high-value lead.',
      badge: 'FinTech & NBFC',
    },
    {
      name: 'Ravi Kumar',
      title: 'CDIO, Exide Industries Limited',
      quote:
        'From primary battery manufacturing to secondary dealer distribution, AcxiomCRM gives our leadership a single source of truth for all revenue metrics.',
      badge: 'Automotive & Industrial',
    },
  ];

  // Industry solutions matching the Salesforce prompt
  const industries = [
    {
      title: 'Financial Services',
      desc: 'Connect with customers proactively to deliver AI-powered, high-value experiences and regulatory compliance.',
      icon: <FiBriefcase size={22} className="text-primary" />,
      color: '#0176d3',
    },
    {
      title: 'Retail & E-Commerce',
      desc: 'Acquire profitable customers faster with unified, real-time customer data, order history, and omnichannel campaigns.',
      icon: <FiShoppingBag size={22} className="text-success" />,
      color: '#16a34a',
    },
    {
      title: 'Consumer Goods',
      desc: 'Transform your business with consumer goods technology made for tier-1 distributors, modern trade, and D2C brands.',
      icon: <FiTruck size={22} className="text-warning" />,
      color: '#d97706',
    },
    {
      title: 'Manufacturing',
      desc: 'Integrate all your data across a unified value chain to better serve industrial customers and nationwide channel partners.',
      icon: <FiLayers size={22} className="text-info" />,
      color: '#0891b2',
    },
    {
      title: 'Automotive',
      desc: 'Drive personalised ownership experiences, explore new recurring revenue models, and power connected vehicle service networks.',
      icon: <FiCpu size={22} className="text-danger" />,
      color: '#dc2626',
    },
    {
      title: 'Healthcare & Life Sciences',
      desc: 'Elevate your medical workforce with secure AI agents for healthier patient outcomes, clinical trials, and compliance.',
      icon: <FiHeart size={22} className="text-primary" />,
      color: '#7c3aed',
    },
    {
      title: 'Higher Education',
      desc: 'Elevate the education experience with the #1 AI CRM for student recruitment, campus placements, and alumni donor relations.',
      icon: <FiBookOpen size={22} className="text-warning" />,
      color: '#ea580c',
    },
    {
      title: 'Media & Entertainment',
      desc: 'Enhance your digital media solution with advanced sales intelligence and ad-space automation, driving higher seller productivity.',
      icon: <FiActivity size={22} className="text-success" />,
      color: '#059669',
    },
  ];

  // Client Brands / Trusted Logos matching Salesforce India
  const clientLogos = [
    'Tata Realty',
    'Mahindra & Mahindra',
    'Hero FinCorp',
    'Razorpay',
    'Godrej',
    'Genpact',
    'PVR INOX',
    'Balaji Wafers',
    'Flame University',
    'Exide Industries',
    'Shakti Pumps',
    'Secutech',
  ];

  // FAQs matching the prompt
  const faqs = [
    {
      q: 'What is AcxiomCRM?',
      a: "AcxiomCRM is India's #1 Agentic CRM (Customer Relationship Management) platform. We bring companies and customers together by providing a unified set of applications — powered by agentic intelligence and governed relational data — that help sales, service, and executive leadership operate as one. With enterprise Spring Boot architecture and modular React clients, AcxiomCRM helps you find qualified leads, close deals faster, and nurture customer relationships on a single integrated system.",
    },
    {
      q: 'What is CRM software and why do businesses in India need it?',
      a: 'CRM stands for Customer Relationship Management. It is a system for managing all your company’s interactions with leads, active clients, and partners. A modern CRM helps you: 1) Organise contact repositories and lead scoring; 2) Automate date-validated follow-ups, calls, and email cadences; 3) Analyse real-time revenue pipelines and win rates. In India’s fast-moving business climate, having a single 360-degree view of every customer is essential to outpace competitors and scale predictably.',
    },
    {
      q: 'What is agentic AI and how is it used in AcxiomCRM?',
      a: 'Agentic AI refers to autonomous systems that can reason, plan multistep actions, and execute tasks with minimal human intervention. Unlike basic chatbots that merely generate text, agentic AI inside AcxiomCRM: • Automatically scores and routes leads based on qualification criteria; • Predicts deal closing probabilities; • Automates follow-up scheduling with strict business-day validations; • Prepares daily executive revenue briefings and alerts.',
    },
    {
      q: 'How does AcxiomCRM help businesses grow in India?',
      a: 'AcxiomCRM offers tailored solutions designed for Indian enterprises and growing SMBs. Our system scales seamlessly from emerging startups to nationwide enterprises with thousands of dealers. It eliminates manual spreadsheet tracking, prevents lead slippage, enforces role-based access control (Admin, Manager, Sales Executive), and provides out-of-the-box support for Indian enterprise workflows.',
    },
    {
      q: 'Who engineered AcxiomCRM and what technology powers it?',
      a: 'AcxiomCRM was architected and developed by Sai Santanu Sahoo from C.V. Raman Global University, Bhubaneswar. The platform is engineered with Java 21, Spring Boot 3.3.5, Spring Security 6, Hibernate JPA, MySQL 8.0, and a React 18 frontend with Chart.js analytics and role-based access control.',
    },
    {
      q: 'How do I test the CRM and what credentials can I use?',
      a: 'You can access the CRM immediately without installation by clicking any "Go to Login Page" button. The login screen features pre-configured one-click demo credentials for Admin (admin / Admin@123), Sales Manager (manager / Manager@123), and Sales Executive (sales / Sales@123).',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        overflowX: 'hidden',
      }}
    >
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="visually-hidden-focusable p-3 bg-primary text-white position-absolute top-0 start-0 z-3"
      >
        Skip to main content
      </a>

      {/* Top Banner (Salesforce Style) */}
      <div
        className="py-2 px-3 text-center text-white small fw-medium"
        style={{
          background: 'linear-gradient(90deg, #032d60 0%, #0176d3 100%)',
          letterSpacing: '0.01em',
        }}
      >
        <div className="container d-flex flex-wrap align-items-center justify-content-center gap-2">
          <span className="badge bg-warning text-dark fw-bold px-2 py-1">
            NEW
          </span>
          <span>
            AcxiomCRM Agentforce &amp; SMB Growth Kit is now live for India’s
            growing businesses. Go live in just 4 weeks!*
          </span>
          <Link
            to="/login"
            className="text-white text-decoration-underline fw-bold ms-1"
          >
            Access Now &rarr;
          </Link>
        </div>
      </div>

      {/* Salesforce-Style Navigation Header */}
      <header
        className="navbar navbar-expand-lg py-3 px-3 px-md-4 border-bottom sticky-top bg-white"
        style={{
          boxShadow: '0 2px 8px rgba(3, 45, 96, 0.06)',
          zIndex: 1030,
        }}
      >
        <div className="container-xl d-flex align-items-center justify-content-between">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3 text-white shadow-sm"
              style={{
                width: 42,
                height: 42,
                background: 'linear-gradient(135deg, #0176d3 0%, #032d60 100%)',
                fontSize: '1.4rem',
                fontWeight: 800,
              }}
            >
              ☁
            </div>
            <div>
              <div
                className="fw-bold fs-4 tracking-tight"
                style={{ color: '#032d60', lineHeight: 1.1 }}
              >
                Acxiom<span style={{ color: '#0176d3' }}>CRM</span>
              </div>
              <div
                className="text-muted fw-semibold"
                style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}
              >
                INDIA’S #1 AGENTIC CRM
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-4 fw-semibold text-secondary small">
            <a
              href="#agentic-enterprise"
              className="text-decoration-none text-dark hover-blue"
            >
              Agentic Enterprise
            </a>
            <a
              href="#industries"
              className="text-decoration-none text-dark hover-blue"
            >
              Industries
            </a>
            <a
              href="#social-proof"
              className="text-decoration-none text-dark hover-blue"
            >
              Customer Stories
            </a>
            <a
              href="#developer"
              className="text-decoration-none text-dark hover-blue text-primary fw-bold"
            >
              About Developer
            </a>
            <a href="#faqs" className="text-decoration-none text-dark hover-blue">
              FAQs
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-3">
            <a
              href="tel:18004207332"
              className="d-none d-xl-flex align-items-center gap-2 text-decoration-none text-secondary small fw-semibold"
            >
              <FiPhoneCall className="text-primary" />
              <span>1800 420 7332</span>
            </a>

            {isAuthenticated ? (
              <Link
                to="/"
                id="header-dashboard-btn"
                className="btn btn-primary px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm rounded-pill"
                style={{
                  backgroundColor: '#0176d3',
                  borderColor: '#0176d3',
                  fontSize: '0.9rem',
                }}
              >
                <span>Dashboard ({user?.username})</span>
                <FiArrowRight size={15} />
              </Link>
            ) : (
              <Link
                to="/login"
                id="landing-login-btn"
                className="btn px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill text-white"
                style={{
                  background: 'linear-gradient(135deg, #0176d3 0%, #005fb2 100%)',
                  border: 'none',
                  fontSize: '0.92rem',
                  boxShadow: '0 4px 14px rgba(1, 118, 211, 0.35)',
                }}
              >
                <FiLogIn size={16} />
                <span>Go to Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content">
        {/* HERO SECTION — Adapted directly from Salesforce India prompt */}
        <section
          className="position-relative py-5 overflow-hidden"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 0%, #eef4fc 0%, #ffffff 70%)',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <div className="container-xl py-4 py-md-5">
            <div className="row align-items-center g-5">
              {/* Left Column: Salesforce India Copy */}
              <div className="col-lg-7 text-center text-lg-start">
                <div className="d-inline-flex align-items-center gap-2 py-1 px-3 rounded-pill mb-3 border bg-white shadow-xs">
                  <span
                    className="badge rounded-pill text-white fw-bold"
                    style={{ backgroundColor: '#0176d3', fontSize: '0.75rem' }}
                  >
                    Enterprise Suite
                  </span>
                  <span
                    className="text-secondary fw-semibold small"
                    style={{ fontSize: '0.82rem' }}
                  >
                    Engineered for India’s Growing Businesses
                  </span>
                </div>

                <h1
                  className="display-4 fw-extrabold mb-3 tracking-tight"
                  style={{
                    color: '#032d60',
                    fontWeight: 800,
                    lineHeight: 1.15,
                  }}
                >
                  Get Started with AcxiomCRM —{' '}
                  <span style={{ color: '#0176d3' }}>
                    India’s #1 Agentic CRM
                  </span>
                </h1>

                <p
                  className="lead text-secondary mb-4 fs-5"
                  style={{
                    maxWidth: 620,
                    lineHeight: 1.6,
                    color: '#475569',
                  }}
                >
                  Uniquely built for India’s growing businesses, the new SMB &amp;
                  Enterprise Growth Kit helps you sell faster, collaborate
                  smarter, and make confident decisions.{' '}
                  <strong>Live in just 4 weeks!*</strong>
                </p>

                {/* Direct Action Buttons */}
                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start align-items-center gap-3 mb-4">
                  <Link
                    to="/login"
                    id="hero-login-button"
                    className="btn btn-lg px-4 py-3 fw-bold rounded-pill text-white d-inline-flex align-items-center gap-2 shadow-lg"
                    style={{
                      background:
                        'linear-gradient(135deg, #0176d3 0%, #005fb2 100%)',
                      border: 'none',
                      fontSize: '1.05rem',
                      boxShadow: '0 8px 24px rgba(1, 118, 211, 0.4)',
                    }}
                  >
                    <span>Go to Login Page</span>
                    <FiArrowRight size={18} />
                  </Link>

                  <Link
                    to="/login"
                    id="hero-growth-kit-btn"
                    className="btn btn-lg px-4 py-3 fw-bold rounded-pill text-primary border-2 btn-outline-primary d-inline-flex align-items-center gap-2"
                    style={{
                      borderColor: '#0176d3',
                      fontSize: '1.05rem',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <span>Get SMB Growth Kit</span>
                  </Link>

                  <a
                    href="#developer"
                    className="text-decoration-none text-secondary fw-semibold small d-inline-flex align-items-center gap-1 ms-lg-2"
                  >
                    <span>Created by Sai Santanu Sahoo</span>
                    <FiArrowRight size={13} />
                  </a>
                </div>

                {/* Key Bullet Trust Indicators */}
                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 text-muted small fw-medium pt-2">
                  <span className="d-flex align-items-center gap-1">
                    <FiCheckCircle className="text-success" size={16} /> No
                    credit card required
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FiCheckCircle className="text-success" size={16} /> Free
                    instant demo access
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FiCheckCircle className="text-success" size={16} /> MySQL 8
                    &amp; Spring Security
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive CRM Agent Console Preview */}
              <div className="col-lg-5">
                <div
                  className="card border-0 rounded-4 shadow-xl overflow-hidden position-relative"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #d8e2ee',
                    boxShadow: '0 20px 45px rgba(3, 45, 96, 0.12)',
                  }}
                >
                  {/* Console Header Bar */}
                  <div
                    className="p-3 text-white d-flex align-items-center justify-content-between"
                    style={{
                      background:
                        'linear-gradient(135deg, #032d60 0%, #0176d3 100%)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle bg-success"
                        style={{ width: 10, height: 10 }}
                      />
                      <span className="fw-bold small tracking-wide text-uppercase">
                        Acxiom Agentforce Console
                      </span>
                    </div>
                    <span className="badge bg-white text-dark small fw-bold">
                      v1.0 Live
                    </span>
                  </div>

                  {/* Interactive Status & Preview Card */}
                  <div className="p-4" style={{ backgroundColor: '#fcfdfd' }}>
                    <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                      <div>
                        <div
                          className="text-muted text-uppercase"
                          style={{ fontSize: '0.7rem', fontWeight: 700 }}
                        >
                          Customer 360 Context
                        </div>
                        <div
                          className="fw-bold fs-6"
                          style={{ color: '#032d60' }}
                        >
                          Tata Realty &amp; Infrastructure
                        </div>
                      </div>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        High Win Probability: 88%
                      </span>
                    </div>

                    {/* Agentforce Action Card */}
                    <div
                      className="p-3 rounded-3 mb-3"
                      style={{
                        backgroundColor: '#eef4fc',
                        border: '1px solid #cfe2ff',
                      }}
                    >
                      <div className="d-flex align-items-center gap-2 text-primary fw-bold small mb-1">
                        <FiZap size={15} />
                        <span>Autonomous Agent Suggestion:</span>
                      </div>
                      <div className="text-secondary small">
                        Opportunity{' '}
                        <strong>"Commercial Leasing Deal - Phase II"</strong>{' '}
                        amounting to <strong>₹12,50,000</strong> is ready for
                        closing. Follow-up scheduled for tomorrow with MD Sanjay
                        Dutt.
                      </div>
                    </div>

                    {/* Quick Metric Tiles */}
                    <div className="row g-2 text-center mb-3">
                      <div className="col-4">
                        <div className="p-2 rounded bg-white border">
                          <div
                            className="text-muted"
                            style={{ fontSize: '0.68rem', fontWeight: 600 }}
                          >
                            OPEN LEADS
                          </div>
                          <div className="fw-bold text-primary fs-6">14</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded bg-white border">
                          <div
                            className="text-muted"
                            style={{ fontSize: '0.68rem', fontWeight: 600 }}
                          >
                            PIPELINE
                          </div>
                          <div className="fw-bold text-success fs-6">₹48.2L</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded bg-white border">
                          <div
                            className="text-muted"
                            style={{ fontSize: '0.68rem', fontWeight: 600 }}
                          >
                            WIN RATE
                          </div>
                          <div className="fw-bold text-warning fs-6">76%</div>
                        </div>
                      </div>
                    </div>

                    {/* Direct Quick Login Card inside Console */}
                    <Link
                      to="/login"
                      className="btn w-100 py-2 fw-bold text-white d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-xs"
                      style={{
                        backgroundColor: '#0176d3',
                        border: 'none',
                        fontSize: '0.9rem',
                      }}
                    >
                      <FiLogIn size={15} />
                      <span>Sign In to Access Live Console &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WELCOME TO THE AGENTIC ENTERPRISE */}
        <section
          id="agentic-enterprise"
          className="py-5"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="container-xl py-4">
            <div className="text-center max-w-3xl mx-auto mb-5">
              <span
                className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
                style={{
                  backgroundColor: '#eef4fc',
                  color: '#0176d3',
                  fontSize: '0.78rem',
                }}
              >
                Welcome to the Agentic Enterprise
              </span>
              <h2
                className="display-6 fw-bold mb-3"
                style={{ color: '#032d60' }}
              >
                Where humans, agents, and platforms drive customer success
                together.
              </h2>
              <p
                className="text-secondary mx-auto fs-6"
                style={{ maxWidth: 740, lineHeight: 1.6 }}
              >
                Humans and agents work inside the systems that run your business.
                The result: faster decisions, stronger customer relationships,
                and non-stop growth. With AcxiomCRM Headless 360, every
                capability is accessible from any tool, any agent, any
                interface — wherever work happens.
              </p>
            </div>

            {/* 5 Pillar Cards from Salesforce Architecture */}
            <div className="row g-4 mb-4">
              {/* Pillar 1: Slack / Conversational */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 p-4 rounded-4 border-0 shadow-sm hover-lift"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    className="rounded-3 p-3 mb-3 d-inline-flex"
                    style={{
                      backgroundColor: '#e0e7ff',
                      color: '#4338ca',
                      width: 'fit-content',
                    }}
                  >
                    <FiMessageSquare size={24} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#032d60' }}>
                    Collaborative Workflows
                  </h5>
                  <p className="text-secondary small mb-3">
                    Connect team communication, automated alerts, and
                    conversational customer data where work happens without
                    tab-switching.
                  </p>
                  <div className="mt-auto">
                    <Link
                      to="/login"
                      className="text-decoration-none fw-bold small text-primary d-inline-flex align-items-center gap-1"
                    >
                      Connect Workflows &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Tableau / Analytics */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 p-4 rounded-4 border-0 shadow-sm hover-lift"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    className="rounded-3 p-3 mb-3 d-inline-flex"
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      width: 'fit-content',
                    }}
                  >
                    <FiBarChart2 size={24} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#032d60' }}>
                    Agentic Analytics
                  </h5>
                  <p className="text-secondary small mb-3">
                    Turn agentic pipeline metrics into actionable intelligence
                    with real-time conversion rates, deal velocity, and
                    stage-by-stage charts.
                  </p>
                  <div className="mt-auto">
                    <Link
                      to="/login"
                      className="text-decoration-none fw-bold small text-primary d-inline-flex align-items-center gap-1"
                    >
                      Explore Intelligence &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Agentforce */}
              <div className="col-md-6 col-lg-4">
                <div
                  className="card h-100 p-4 rounded-4 border-0 shadow-sm hover-lift"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    className="rounded-3 p-3 mb-3 d-inline-flex"
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#0176d3',
                      width: 'fit-content',
                    }}
                  >
                    <FiZap size={24} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#032d60' }}>
                    Agentforce Engine
                  </h5>
                  <p className="text-secondary small mb-3">
                    Build trusted, agentic experiences that act with purpose —
                    automating customer qualification, reminders, and activity
                    tracking.
                  </p>
                  <div className="mt-auto">
                    <Link
                      to="/login"
                      className="text-decoration-none fw-bold small text-primary d-inline-flex align-items-center gap-1"
                    >
                      Meet Agentforce &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Customer 360 */}
              <div className="col-md-6 col-lg-6">
                <div
                  className="card h-100 p-4 rounded-4 border-0 shadow-sm hover-lift"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    className="rounded-3 p-3 mb-3 d-inline-flex"
                    style={{
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      width: 'fit-content',
                    }}
                  >
                    <FiUsers size={24} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#032d60' }}>
                    Customer 360
                  </h5>
                  <p className="text-secondary small mb-3">
                    Ground every sales decision in proven business context.
                    Unify customer codes, communications, active deals, and past
                    interactions in one master view.
                  </p>
                  <div className="mt-auto">
                    <Link
                      to="/login"
                      className="text-decoration-none fw-bold small text-primary d-inline-flex align-items-center gap-1"
                    >
                      Ground Decisions in Customer 360 &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pillar 5: Data 360 */}
              <div className="col-md-6 col-lg-6">
                <div
                  className="card h-100 p-4 rounded-4 border-0 shadow-sm hover-lift"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    className="rounded-3 p-3 mb-3 d-inline-flex"
                    style={{
                      backgroundColor: '#ede9fe',
                      color: '#7c3aed',
                      width: 'fit-content',
                    }}
                  >
                    <FiShield size={24} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#032d60' }}>
                    Data 360 Foundation
                  </h5>
                  <p className="text-secondary small mb-3">
                    One governed, trusted data foundation powered by MySQL 8,
                    Hibernate JPA transactional integrity, and Spring Security
                    6 RBAC.
                  </p>
                  <div className="mt-auto">
                    <Link
                      to="/login"
                      className="text-decoration-none fw-bold small text-primary d-inline-flex align-items-center gap-1"
                    >
                      View Governed Architecture &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions from Salesforce Section */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <Link
                to="/login"
                className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                style={{ backgroundColor: '#0176d3', border: 'none' }}
              >
                Explore Agentforce Coworker
              </Link>
              <Link
                to="/login"
                className="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold"
                style={{ borderColor: '#0176d3' }}
              >
                Meet Agentic Bot &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 3: TRUSTED BY INDIA'S ENTERPRISES (TESTIMONIALS & BRANDS) */}
        <section
          id="social-proof"
          className="py-5"
          style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
        >
          <div className="container-xl py-4">
            <div className="text-center mb-5">
              <span
                className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
                style={{
                  backgroundColor: '#eef4fc',
                  color: '#0176d3',
                  fontSize: '0.78rem',
                }}
              >
                Social Proof &amp; Leadership
              </span>
              <h2
                className="display-6 fw-bold mb-2"
                style={{ color: '#032d60' }}
              >
                See why companies trust AcxiomCRM to help them grow
              </h2>
              <p className="text-secondary small">
                Over 150,000+ businesses worldwide trust modern agentic CRM
                workflows for predictable revenue.
              </p>
            </div>

            {/* Interactive Testimonial Carousel Card */}
            <div
              className="card border-0 rounded-4 shadow-sm mx-auto mb-5"
              style={{
                maxWidth: 880,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 fw-bold">
                    {testimonials[activeTestimonial].badge}
                  </span>
                  <div className="d-flex align-items-center gap-1 text-warning">
                    <FiStar />
                    <FiStar />
                    <FiStar />
                    <FiStar />
                    <FiStar />
                  </div>
                </div>

                <blockquote
                  className="fs-5 fw-medium mb-4"
                  style={{ color: '#1e293b', fontStyle: 'italic', lineHeight: 1.6 }}
                >
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                <div className="d-flex align-items-center justify-content-between border-top pt-3">
                  <div>
                    <h6
                      className="fw-bold mb-0 fs-6"
                      style={{ color: '#032d60' }}
                    >
                      {testimonials[activeTestimonial].name}
                    </h6>
                    <div className="text-secondary small">
                      {testimonials[activeTestimonial].title}
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous slide"
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === 0 ? testimonials.length - 1 : prev - 1
                        )
                      }
                      className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 36, height: 36 }}
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    <span className="small text-muted fw-semibold">
                      {activeTestimonial + 1} / {testimonials.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Next slide"
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === testimonials.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 36, height: 36 }}
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted Brands Grid (Matching prompt logos: Balaji, Flame, Genpact, Godrej, Mahindra, Pepe Jeans, Razorpay, Secutech) */}
            <div className="text-center pt-2">
              <div
                className="text-muted text-uppercase small fw-bold mb-4"
                style={{ letterSpacing: '0.08em' }}
              >
                Trusted CRM Software by 150,000+ Businesses Worldwide
              </div>
              <div className="row g-3 justify-content-center align-items-center">
                {clientLogos.map((brand, idx) => (
                  <div key={idx} className="col-6 col-sm-4 col-md-3 col-lg-2">
                    <div
                      className="p-3 bg-white rounded-3 border text-center fw-bold shadow-xs"
                      style={{
                        color: '#475569',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      {brand}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: BUILT-IN AI FOR EVERY PART OF YOUR BUSINESS & METRICS */}
        <section
          className="py-5"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
          }}
        >
          <div className="container-xl py-4">
            <div className="row align-items-center g-5 mb-5">
              <div className="col-lg-6">
                <span
                  className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
                  style={{
                    backgroundColor: '#eef4fc',
                    color: '#0176d3',
                    fontSize: '0.78rem',
                  }}
                >
                  Autonomous Productivity
                </span>
                <h2
                  className="display-6 fw-bold mb-3"
                  style={{ color: '#032d60' }}
                >
                  Built-in AI for every part of your business
                </h2>
                <p
                  className="text-secondary fs-6 mb-4"
                  style={{ lineHeight: 1.6 }}
                >
                  Put AI to work across sales, service, and marketing with{' '}
                  <strong>AcxiomCRM Starter Suite</strong> — a CRM that knows your
                  business and can automate the kind of customer experiences
                  you’ll actually be proud of. Start simply with quick and easy
                  setup and prebuilt agents.
                </p>

                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link
                    to="/login"
                    className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                    style={{ backgroundColor: '#0176d3', border: 'none' }}
                  >
                    Start for free
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold"
                    style={{ borderColor: '#0176d3' }}
                  >
                    Start demo
                  </Link>
                </div>
              </div>

              {/* 3M+ Conversations Card */}
              <div className="col-lg-6">
                <div
                  className="card border-0 rounded-4 text-white p-4 p-md-5 shadow-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, #032d60 0%, #0176d3 100%)',
                  }}
                >
                  <h3 className="fw-bold mb-3">
                    3M+ conversations handled by Agentforce and counting
                  </h3>
                  <p className="text-light opacity-90 small mb-4">
                    Everyone talks the AI talk. We’re walking the walk. With 66%
                    autonomous case resolution, 15% more marketing pipeline, and
                    1.8x higher lead conversion, Agentforce delivers real
                    conversational AI across service, sales, and marketing
                    workflows.
                  </p>

                  <div className="row g-3 text-center border-top border-white border-opacity-25 pt-4">
                    <div className="col-4">
                      <div className="display-6 fw-extrabold text-white">
                        66%
                      </div>
                      <div className="small text-light opacity-75">
                        Autonomous Case Resolution
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="display-6 fw-extrabold text-white">
                        +15%
                      </div>
                      <div className="small text-light opacity-75">
                        More Marketing Pipeline
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="display-6 fw-extrabold text-white">
                        1.8x
                      </div>
                      <div className="small text-light opacity-75">
                        Higher Lead Conversion
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INDUSTRY SOLUTIONS (16+ SOLUTIONS) */}
        <section id="industries" className="py-5 bg-white">
          <div className="container-xl py-4">
            <div className="text-center max-w-3xl mx-auto mb-5">
              <span
                className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
                style={{
                  backgroundColor: '#eef4fc',
                  color: '#0176d3',
                  fontSize: '0.78rem',
                }}
              >
                Tailored for Industry Workflows
              </span>
              <h2
                className="display-6 fw-bold mb-2"
                style={{ color: '#032d60' }}
              >
                Launch faster with Agentforce solutions, built for your industry
              </h2>
              <p className="text-secondary small">
                Designed with industry expertise, these out-of-the-box solutions
                align with your workflows, data, and customer needs, so you can
                modernise faster, go to market sooner, and deliver value from day
                one.
              </p>
            </div>

            <div className="row g-4">
              {industries.map((ind, idx) => (
                <div key={idx} className="col-md-6 col-lg-3">
                  <div
                    className="card h-100 p-4 rounded-4 border-0 shadow-xs hover-shadow"
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      className="p-3 rounded-3 mb-3 d-inline-flex"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        width: 'fit-content',
                      }}
                    >
                      {ind.icon}
                    </div>
                    <h5
                      className="fw-bold mb-2 fs-6"
                      style={{ color: '#032d60' }}
                    >
                      {ind.title}
                    </h5>
                    <p
                      className="text-secondary small mb-3"
                      style={{ lineHeight: 1.5 }}
                    >
                      {ind.desc}
                    </p>
                    <div className="mt-auto">
                      <Link
                        to="/login"
                        className="text-decoration-none fw-bold small text-primary d-inline-flex align-items-center gap-1"
                      >
                        Explore {ind.title} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <Link
                to="/login"
                className="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold"
                style={{ borderColor: '#0176d3' }}
              >
                See all Industries in AcxiomCRM &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6: ANALYSTS AGREE & AGENTBLAZER LEARNING */}
        <section
          className="py-5"
          style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
        >
          <div className="container-xl py-4">
            <div className="row g-5">
              {/* Analyst Reports */}
              <div className="col-lg-6">
                <span
                  className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
                  style={{
                    backgroundColor: '#eef4fc',
                    color: '#0176d3',
                    fontSize: '0.78rem',
                  }}
                >
                  Independent Analyst Validation
                </span>
                <h3 className="fw-bold mb-4" style={{ color: '#032d60' }}>
                  See why analysts agree AcxiomCRM should be your Agentic AI
                  partner
                </h3>

                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-3 bg-white border shadow-xs">
                    <span className="badge bg-secondary-subtle text-secondary small fw-bold mb-1">
                      Valoir Report
                    </span>
                    <h6 className="fw-bold mb-1" style={{ color: '#032d60' }}>
                      Agentforce delivers ROI faster and at a lower cost than a
                      DIY approach
                    </h6>
                    <Link
                      to="/login"
                      className="text-decoration-none small text-primary fw-semibold"
                    >
                      Read the Valoir analysis &rarr;
                    </Link>
                  </div>

                  <div className="p-3 rounded-3 bg-white border shadow-xs">
                    <span className="badge bg-secondary-subtle text-secondary small fw-bold mb-1">
                      G2 Leader Grid
                    </span>
                    <h6 className="fw-bold mb-1" style={{ color: '#032d60' }}>
                      AcxiomCRM voted #1 Global CRM Leader on G2 Enterprise Grid
                    </h6>
                    <Link
                      to="/login"
                      className="text-decoration-none small text-primary fw-semibold"
                    >
                      Read the G2 report &rarr;
                    </Link>
                  </div>

                  <div className="p-3 rounded-3 bg-white border shadow-xs">
                    <span className="badge bg-secondary-subtle text-secondary small fw-bold mb-1">
                      Futurum Research
                    </span>
                    <h6 className="fw-bold mb-1" style={{ color: '#032d60' }}>
                      Futurum report explains why Agentforce is the fastest path
                      to enterprise value
                    </h6>
                    <Link
                      to="/login"
                      className="text-decoration-none small text-primary fw-semibold"
                    >
                      Read the Futurum insights &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Become an Agentblazer Track */}
              <div className="col-lg-6">
                <span
                  className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
                  style={{
                    backgroundColor: '#eef4fc',
                    color: '#0176d3',
                    fontSize: '0.78rem',
                  }}
                >
                  Skill &amp; Career Growth
                </span>
                <h3 className="fw-bold mb-2" style={{ color: '#032d60' }}>
                  Become an Agentblazer
                </h3>
                <p className="text-secondary small mb-4">
                  Learn essential AI and Agentforce skills required to shape the
                  future of work for free.
                </p>

                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-3 bg-white border shadow-xs d-flex align-items-center justify-content-between">
                    <div>
                      <span className="badge bg-warning text-dark small fw-bold mb-1">
                        Level 1
                      </span>
                      <h6 className="fw-bold mb-0" style={{ color: '#032d60' }}>
                        Champion
                      </h6>
                      <div className="text-secondary small">
                        Confidently explain Agentforce concepts and business
                        impact.
                      </div>
                    </div>
                    <Link
                      to="/login"
                      className="btn btn-outline-primary btn-sm rounded-pill fw-bold"
                    >
                      Start
                    </Link>
                  </div>

                  <div className="p-3 rounded-3 bg-white border shadow-xs d-flex align-items-center justify-content-between">
                    <div>
                      <span className="badge bg-primary text-white small fw-bold mb-1">
                        Level 2
                      </span>
                      <h6 className="fw-bold mb-0" style={{ color: '#032d60' }}>
                        Innovator
                      </h6>
                      <div className="text-secondary small">
                        Implement Agentforce solutions to drive measurable
                        business outcomes.
                      </div>
                    </div>
                    <Link
                      to="/login"
                      className="btn btn-outline-primary btn-sm rounded-pill fw-bold"
                    >
                      Start
                    </Link>
                  </div>

                  <div className="p-3 rounded-3 bg-white border shadow-xs d-flex align-items-center justify-content-between">
                    <div>
                      <span className="badge bg-dark text-white small fw-bold mb-1">
                        Level 3
                      </span>
                      <h6 className="fw-bold mb-0" style={{ color: '#032d60' }}>
                        Legend
                      </h6>
                      <div className="text-secondary small">
                        Understand advanced concepts and design complex
                        enterprise strategies.
                      </div>
                    </div>
                    <Link
                      to="/login"
                      className="btn btn-outline-primary btn-sm rounded-pill fw-bold"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: DEVELOPER & UNIVERSITY ATTRIBUTION (CRITICAL HIGHLIGHT) */}
        <section
          id="developer"
          className="py-5"
          style={{
            background:
              'linear-gradient(135deg, #032d60 0%, #091e3d 50%, #02142b 100%)',
            color: '#ffffff',
          }}
        >
          <div className="container-xl py-4" style={{ maxWidth: 1000 }}>
            <div
              className="card border-0 rounded-4 overflow-hidden shadow-2xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="row align-items-center g-4">
                  {/* Lead Developer Avatar / Badge */}
                  <div className="col-md-3 text-center">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg mb-3"
                      style={{
                        width: 120,
                        height: 120,
                        background:
                          'linear-gradient(135deg, #0176d3 0%, #005fb2 100%)',
                        border: '4px solid rgba(255, 255, 255, 0.25)',
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      SSS
                    </div>
                    <div>
                      <span className="badge bg-warning text-dark fw-bold px-3 py-1">
                        Lead System Architect
                      </span>
                    </div>
                  </div>

                  {/* Institution Details */}
                  <div className="col-md-9">
                    <div className="d-flex align-items-center gap-2 text-info small fw-bold text-uppercase tracking-wider mb-2">
                      <FiAward size={16} className="text-warning" />
                      <span>Software Engineering &amp; Platform Architecture</span>
                    </div>

                    <h2 className="fw-extrabold text-white mb-2">
                      Made by Sai Santanu Sahoo
                    </h2>

                    <div className="d-flex align-items-center gap-2 text-primary-subtle fs-6 mb-3 fw-semibold">
                      <FiMapPin size={18} className="text-info" />
                      <span>
                        C.V. Raman Global University, Bhubaneswar, Odisha
                      </span>
                    </div>

                    <p
                      className="text-light opacity-90 small mb-4"
                      style={{ lineHeight: 1.7 }}
                    >
                      Designed and engineered <strong>AcxiomCRM</strong> to
                      emulate Salesforce’s enterprise Agentic CRM architecture.
                      Implements a robust Java 21 / Spring Boot 3.3.5 backend with
                      Spring Security 6 role-based authorization, BCrypt
                      hashing, relational MySQL 8 persistence, date-validated
                      follow-up workflows, and an intuitive React 18 frontend
                      featuring live Chart.js pipeline telemetry.
                    </p>

                    {/* Technology Stack Tags */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <span className="badge bg-white text-dark px-3 py-2 fw-semibold">
                        Java 21 / 23
                      </span>
                      <span className="badge bg-white text-dark px-3 py-2 fw-semibold">
                        Spring Boot 3.3.5
                      </span>
                      <span className="badge bg-white text-dark px-3 py-2 fw-semibold">
                        Spring Security 6 &amp; BCrypt
                      </span>
                      <span className="badge bg-white text-dark px-3 py-2 fw-semibold">
                        MySQL 8.0 Engine
                      </span>
                      <span className="badge bg-white text-dark px-3 py-2 fw-semibold">
                        React 18 + Vite
                      </span>
                      <span className="badge bg-white text-dark px-3 py-2 fw-semibold">
                        C.V. Raman Global University
                      </span>
                    </div>

                    {/* Direct Call to Action to Login */}
                    <div>
                      <Link
                        to="/login"
                        id="developer-login-btn"
                        className="btn btn-warning btn-lg px-4 py-2 fw-bold text-dark rounded-pill d-inline-flex align-items-center gap-2 shadow-lg"
                      >
                        <FiLogIn size={18} />
                        <span>Go to Login Page &amp; Test Live CRM &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: SALESFORCE CRM FAQS (EXPANDABLE ACCORDION) */}
        <section id="faqs" className="py-5 bg-white">
          <div className="container-xl py-4" style={{ maxWidth: 900 }}>
            <div className="text-center mb-5">
              <span
                className="badge px-3 py-1 rounded-pill mb-2 fw-bold text-uppercase"
                style={{
                  backgroundColor: '#eef4fc',
                  color: '#0176d3',
                  fontSize: '0.78rem',
                }}
              >
                Clear Answers
              </span>
              <h2
                className="display-6 fw-bold mb-2"
                style={{ color: '#032d60' }}
              >
                Salesforce &amp; AcxiomCRM FAQs
              </h2>
              <p className="text-secondary small">
                Learn how agentic CRM architecture drives customer success for
                Indian businesses.
              </p>
            </div>

            {/* Accordion Component */}
            <div className="d-flex flex-column gap-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border rounded-4 overflow-hidden shadow-xs"
                    style={{
                      borderColor: isOpen ? '#0176d3' : '#e2e8f0',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <button
                      type="button"
                      className="w-100 p-4 text-start bg-white border-0 d-flex align-items-center justify-content-between fw-bold fs-6"
                      style={{ color: '#032d60' }}
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <span className="text-primary ms-3">
                        {isOpen ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        className="px-4 pb-4 pt-1 text-secondary small"
                        style={{
                          lineHeight: 1.7,
                          backgroundColor: '#fafbfc',
                          borderTop: '1px solid #f1f5f9',
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 9: GET STARTED TODAY BANNER (SALESFORCE STYLE) */}
        <section
          className="py-5 text-white"
          style={{
            background: 'linear-gradient(135deg, #0176d3 0%, #032d60 100%)',
          }}
        >
          <div className="container-xl py-4 text-center" style={{ maxWidth: 840 }}>
            <span className="badge bg-white text-primary fw-bold px-3 py-1 mb-3 text-uppercase rounded-pill">
              Get Started Today
            </span>
            <h2 className="display-5 fw-extrabold mb-3">
              There's nothing to install. No credit card required. Free for 30
              days.
            </h2>
            <p className="lead text-light opacity-90 mb-4 mx-auto fs-6">
              Empower your sales, account, and executive teams with India’s
              leading Agentic CRM platform. Instant one-click demo credentials
              configured for test evaluation.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                to="/login"
                id="cta-bottom-login-btn"
                className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow-lg d-inline-flex align-items-center gap-2"
                style={{
                  color: '#0176d3',
                  fontSize: '1.05rem',
                }}
              >
                <FiLogIn size={18} />
                <span>Go to Login Page</span>
              </Link>

              <a
                href="tel:18004207332"
                className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-pill d-inline-flex align-items-center gap-2"
              >
                <FiPhoneCall size={18} />
                <span>Call Us: 1800 420 7332</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER — Matching Salesforce India Enterprise Footer */}
      <footer
        className="pt-5 pb-4 border-top text-secondary small"
        style={{
          backgroundColor: '#032d60',
          color: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container-xl">
          <div className="row g-4 mb-5 text-start">
            {/* Column 1: Brand & Attribution */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-3 text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: 34,
                    height: 34,
                    background: '#0176d3',
                    fontSize: '1.1rem',
                  }}
                >
                  ☁
                </div>
                <span className="fw-bold fs-5 text-white">AcxiomCRM</span>
              </div>
              <p
                className="text-light opacity-75 small mb-3"
                style={{ lineHeight: 1.6 }}
              >
                India's premier Agentic CRM platform, uniting humans, AI agents,
                and governed data to drive predictable customer success.
              </p>
              <div className="p-3 rounded-3 bg-white bg-opacity-10 mb-2">
                <div className="text-warning fw-bold small mb-1">
                  Lead Developer Attribution
                </div>
                <div className="text-white fw-semibold small">
                  Made by Sai Santanu Sahoo
                </div>
                <div className="text-info small">
                  C.V. Raman Global University, Bhubaneswar
                </div>
              </div>
            </div>

            {/* Column 2: Core Platform Modules */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-white text-uppercase tracking-wider small mb-3">
                Agentic CRM
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Customer 360
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Leads Pipeline
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Opportunities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Follow-Ups Engine
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Activity Intelligence
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Industry Solutions */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-white text-uppercase tracking-wider small mb-3">
                Industries
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Financial Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Retail &amp; Consumer Goods
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Manufacturing &amp; Automotive
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Healthcare &amp; Life Sciences
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-decoration-none text-light opacity-75 hover-white"
                  >
                    Higher Education (CVRGU)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Sign In & Trust */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-white text-uppercase tracking-wider small mb-3">
                Enterprise Access
              </h6>
              <p className="text-light opacity-75 small mb-3">
                Ready to evaluate? Sign in with Admin, Sales Manager, or Sales
                Executive test credentials.
              </p>
              <Link
                to="/login"
                id="footer-login-btn"
                className="btn btn-primary w-100 py-2 fw-bold rounded-pill text-white shadow-sm mb-3"
                style={{ backgroundColor: '#0176d3', border: 'none' }}
              >
                <FiLogIn className="me-1" />
                <span>Go to Login Page</span>
              </Link>
              <div className="text-light opacity-50 small">
                Toll Free (India): 1800 420 7332 &bull; Support:
                support@acxiomcrm.in
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="border-top border-white border-opacity-10 pt-4 text-center text-light opacity-60 small">
            <div className="mb-2">
              © {new Date().getFullYear()} AcxiomCRM Inc. &bull; Grounded in
              Trust, Security, and Innovation.
            </div>
            <div>
              Project Developed &amp; Engineered by{' '}
              <strong className="text-white">Sai Santanu Sahoo</strong> &bull;
              Department of Computer Science &amp; Engineering &bull;{' '}
              <strong className="text-info">
                C.V. Raman Global University, Bhubaneswar, Odisha, India
              </strong>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
