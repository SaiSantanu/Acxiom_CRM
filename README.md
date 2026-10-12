# AcxiomCRM — Enterprise Customer Relationship Management

Welcome to **AcxiomCRM**, a modern enterprise-grade Customer Relationship Management platform built with a decoupled architecture: React (Vite) frontend, Spring Boot (Java) backend, and MySQL 8 database.

This is made by Sai Santanu Sahoo
from C.V. Raman Global University, Bhubaneswar.
---

## 1. Architecture & Technology Stack

| Layer | Technology | Default Port | Description |
|---|---|---|---|
| **Frontend** | React 18, Vite, Bootstrap 5, Axios, React Icons, React Router DOM | `5173` | Responsive enterprise CRM UI with dark navy layout |
| **Backend** | Java 21+, Spring Boot 3.3.5, Spring Data JPA, Hibernate, Jakarta Validation, Maven | `8080` | Layered RESTful backend with CORS & Centralized Exception Handling |
| **Database** | MySQL 8 Community Server | `3306` | Relational persistence (`acxiom_crm`) |

---

## 2. Project Modules & Features

###  Core System Foundation
- Spring Boot 3 + Maven service setup.
- React 18 + Vite shell with responsive Bootstrap 5 navy sidebar layout.
- Centralized Axios client (`/api`) with CORS configuration.
- Global Exception Handler (`@RestControllerAdvice`) returning standardized JSON error payloads.
- Automated service health check endpoint: `GET /api/health`.

###  Customer Management
- Complete Customer JPA Entity (`customers` table) with auto-generated unique `customerCode` (`CUST-XXXXXX`).
- Full CRUD operations: Create, Read, Search, Update, Soft Deactivate, and Permanent Delete.
- Duplicate detection on email and phone numbers.
- Responsive React management page (`/customers`) with modal forms, filters, and real-time backend persistence.

###  Lead Management Pipeline
- Lead JPA Entity (`leads` table) with auto-generated unique `leadCode` (`LEAD-XXXXXX`).
- Configurable lead attributes: source, status (`NEW`, `CONTACTED`, `QUALIFIED`, `UNQUALIFIED`, `LOST`), priority, expected revenue value, and assigned sales representative.
- Comprehensive search and filtering by status.
- Management page (`/leads`) with dynamic modal forms, status badges, and inline validation.

###  Opportunity Management & Sales Pipeline
- Opportunity JPA Entity (`opportunities` table) with auto-generated unique `opportunityCode` (`OPP-XXXXXX`).
- Foreign-key relationships to `Customer` and `Lead` with flattened, circular-reference-safe DTO serialization.
- Pipeline stages: `QUALIFICATION`, `PROPOSAL`, `NEGOTIATION`, `WON`, `LOST`.
- Pipeline statuses: `OPEN`, `WON`, `LOST` (automatically synchronized with stages).
- Financial accuracy: all monetary amounts use `BigDecimal`.
- Win probability ($\in [0, 100]$) with stage auto-suggestions.
- Weighted Pipeline calculation: `amount × probability / 100`.
- Open pipeline totals strictly include eligible `OPEN` opportunities (excluding `WON` and `LOST`).
- Interactive Opportunities page (`/opportunities`) with top KPI metrics, filtering, search, and modal CRUD.
- Live Dashboard KPI cards pulling real open pipeline and won revenue figures.

---

## 3. Project Structure

```text
AcxiomCRM/
├── .env.example                     # Environment template (NO credentials committed)
├── .gitignore                       # Multi-tier ignore rules (secrets, build targets, logs)
├── README.md                        # Project documentation and operational guide
├── frontend/                        # React + Vite application
│   ├── package.json                 # Dependencies: react-router-dom, axios, bootstrap, react-icons
│   ├── vite.config.js               # Dev server configured on port 5173
│   ├── index.html                   # HTML entry point with metadata
│   └── src/
│       ├── main.jsx                 # Application entry point with Bootstrap imports
│       ├── App.jsx                  # Main routing definition
│       ├── index.css                # Enterprise styling tokens & responsive layout
│       ├── components/
│       │   ├── Sidebar.jsx          # Responsive navy sidebar with CRM navigation
│       │   ├── Navbar.jsx           # Top navigation bar with live status indicator
│       │   ├── CustomerForm.jsx     # Customer Add/Edit modal form with inline validation
│       │   ├── LeadForm.jsx         # Lead Add/Edit modal form
│       │   └── OpportunityForm.jsx  # Opportunity Add/Edit modal with customer/lead pickers
│       ├── layouts/
│       │   └── MainLayout.jsx       # Layout shell wrapping sidebar, navbar, and content
│       ├── pages/
│       │   ├── Dashboard.jsx        # CRM metrics & live backend health verification
│       │   ├── Customers.jsx        # Customer CRUD management page
│       │   ├── Leads.jsx            # Lead management page with pipeline filters
│       │   ├── Opportunities.jsx    # Opportunity management page with weighted pipeline KPIs
│       │   ├── FollowUps.jsx        # Follow-ups module placeholder
│       │   ├── Activities.jsx       # Activities module placeholder
│       │   ├── Reports.jsx          # Reports module placeholder
│       │   └── Settings.jsx         # Settings module placeholder
│       └── services/
│           ├── api.js               # Centralized Axios client (base URL: http://localhost:8080/api)
│           ├── crmService.js        # Health check service
│           ├── customerService.js   # Customer REST operations
│           ├── leadService.js       # Lead REST operations
│           └── opportunityService.js# Opportunity REST operations and pipeline summary
└── backend/                         # Spring Boot Maven application
    ├── pom.xml                      # Maven configuration with Spring Web, Data JPA, MySQL, Validation
    └── src/
        ├── main/
        │   ├── java/com/acxiom/crm/
        │   │   ├── AcxiomCrmApplication.java
        │   │   ├── config/
        │   │   │   └── CorsConfig.java
        │   │   ├── controller/
        │   │   │   ├── HealthController.java
        │   │   │   ├── CustomerController.java
        │   │   │   ├── LeadController.java
        │   │   │   └── OpportunityController.java
        │   │   ├── service/
        │   │   │   ├── HealthService.java
        │   │   │   ├── CustomerService.java
        │   │   │   ├── LeadService.java
        │   │   │   └── OpportunityService.java
        │   │   ├── repository/
        │   │   │   ├── CustomerRepository.java
        │   │   │   ├── LeadRepository.java
        │   │   │   └── OpportunityRepository.java
        │   │   ├── entity/
        │   │   │   ├── Customer.java
        │   │   │   ├── Lead.java
        │   │   │   ├── Opportunity.java
        │   │   │   └── ... (Enums: CustomerStatus, LeadStatus, OpportunityStage, etc.)
        │   │   ├── dto/
        │   │   │   ├── ApiResponse.java
        │   │   │   ├── CustomerRequest.java / CustomerResponse.java
        │   │   │   ├── LeadRequest.java / LeadResponse.java
        │   │   │   ├── OpportunityRequest.java / OpportunityResponse.java
        │   │   │   └── PipelineSummaryResponse.java
        │   │   └── exception/
        │   │       ├── GlobalExceptionHandler.java
        │   │       ├── ErrorResponse.java
        │   │       ├── ResourceNotFoundException.java
        │   │       └── DuplicateResourceException.java
        │   └── resources/
        │       └── application.properties   # Externalized configuration with secure .env resolution
```

---

## 4. Security & Environment Configuration

**Security Principle:** Production secrets, database passwords, and environment credentials are **never committed** to source control.

1. Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your local database credentials in `.env`:
   ```env
   DB_URL=jdbc:mysql://localhost:3306/acxiom_crm?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   DB_USERNAME=root
   DB_PASSWORD=your_actual_mysql_password
   SERVER_PORT=8080
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
3. The Spring Boot backend automatically reads configuration values from the local environment and `.env` file via `spring.config.import`.

---

## 5. Prerequisites

- **Java JDK**: 21 or higher (verified with Oracle JDK 23)
- **Apache Maven**: 3.9+ (verified with Maven 3.9.9)
- **Node.js & npm**: Node 18+ and npm 9+ (verified with Node v22.14 / npm 11.5)
- **MySQL Server**: MySQL 8.0+ running on port 3306

---

## 6. How to Run

### 1. Database Setup
```sql
CREATE DATABASE IF NOT EXISTS acxiom_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080` (API base: `http://localhost:8080/api`).*

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 7. API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend and database connectivity status |
| `GET` | `/api/customers` | List customers (supports `?search=` and `?status=`) |
| `POST` | `/api/customers` | Create new customer (with uniqueness checks) |
| `PUT` | `/api/customers/{id}` | Update customer |
| `DELETE` | `/api/customers/{id}` | Deactivate or delete customer (`?permanent=true`) |
| `GET` | `/api/leads` | List leads (supports `?search=` and `?status=`) |
| `POST` | `/api/leads` | Create new lead |
| `PUT` | `/api/leads/{id}` | Update lead |
| `DELETE` | `/api/leads/{id}` | Deactivate (mark `LOST`) or permanent delete |
| `GET` | `/api/opportunities` | List opportunities (supports `?search=`, `?stage=`, `?status=`, `?customerId=`) |
| `GET` | `/api/opportunities/summary` | Pipeline metrics (open pipeline, weighted value, won revenue) |
| `POST` | `/api/opportunities` | Create opportunity with validation & relationship checks |
| `PUT` | `/api/opportunities/{id}` | Update opportunity |
| `DELETE` | `/api/opportunities/{id}` | Deactivate (mark `LOST`) or permanent delete |
