# Bilyntra — System Architecture

## 1. Introduction

This document describes the architecture and internal organization of Bilyntra, a web-based Subscription Billing and Configuration Analysis System.

The application follows a component-based frontend architecture using React. Its code is organized into reusable components, pages, data modules, services, utilities, and stylesheets.

## 2. Architectural Overview

Bilyntra uses a layered frontend structure:

1. **Presentation Layer** — Displays the user interface through React pages and reusable components.
2. **Application Layer** — Handles application state, user interactions, navigation, and page-level operations.
3. **Service Layer** — Performs billing calculations and related business operations.
4. **Utility Layer** — Contains reusable functions for configuration analysis and data formatting.
5. **Data Layer** — Provides predefined application data and subscription plan information.

### Architecture Flow

```text
             USER
               |
               v
       REACT USER INTERFACE
               |
               v
        APPLICATION PAGES
               |
       +-------+-------+
       |               |
       v               v
   COMPONENTS      APP STATE
       |               |
       +-------+-------+
               |
               v
        BUSINESS LOGIC
               |
       +-------+-------+
       |               |
       v               v
    SERVICES        UTILITIES
       |               |
       +-------+-------+
               |
               v
         APPLICATION DATA
```

## 3. Project Directory Structure

```text
src/
├── components/
│   ├── common/
│   ├── layout/
│   └── modals/
├── data/
│   ├── plans.js
│   └── seedData.js
├── pages/
│   ├── AlgorithmLab.jsx
│   ├── Customers.jsx
│   ├── Dashboard.jsx
│   ├── Invoices.jsx
│   ├── Reports.jsx
│   └── UsageRecords.jsx
├── services/
│   └── billingService.js
├── styles/
│   ├── algorithm-lab.css
│   ├── component.css
│   ├── dashboard.css
│   ├── global.css
│   ├── layout.css
│   ├── reports.css
│   ├── responsive.css
│   └── variable.css
├── utils/
│   ├── configurationAnalyzer.js
│   └── formatters.js
├── App.jsx
└── main.jsx
```

## 4. Main Architectural Components

### 4.1 Components

The components directory contains reusable interface elements.

- `common/` — Shared interface elements such as tables, buttons, status indicators, search boxes, and empty states.
- `layout/` — Navigation and structural elements such as the sidebar, navbar, and page header.
- `modals/` — Dialog components used for viewing and editing records.

### 4.2 Pages

The pages directory contains the main application modules.

Each page focuses on a specific system responsibility, including customer management, usage tracking, invoice management, reporting, and algorithm testing.

### 4.3 Data

The data directory contains predefined application records and subscription plan configurations.

- `plans.js` — Defines subscription plan information and billing-related values.
- `seedData.js` — Provides sample customers, usage records, invoices, and other initial data.

### 4.4 Services

The services directory contains business logic that performs important application operations.

- `billingService.js` — Handles subscription billing calculations, usage validation, duplicate event handling, and invoice computation.

### 4.5 Utilities

The utilities directory contains reusable functions.

- `configurationAnalyzer.js` — Analyzes possible subscription configurations and evaluates their compatibility.
- `formatters.js` — Provides reusable formatting functions for displaying application values.

### 4.6 Styles

The styles directory separates CSS rules into organized files for global styling, layouts, components, individual pages, and responsive behavior.

## 5. Data Flow

The general data flow of Bilyntra is:

1. The application initializes with predefined data.
2. React components display the available records.
3. Users interact with the interface through forms, buttons, filters, and navigation.
4. Application state is updated based on user actions.
5. Services and utilities process relevant information.
6. Updated information is reflected in the interface.

## 6. State Management

Bilyntra currently uses React state and related React hooks to manage application data and user interface interactions.

Application state includes information such as customer records, usage records, invoices, search values, filters, selected pages, and modal visibility.

## 7. Current Architecture Limitations

The current version is a frontend-focused implementation.

- Application data is maintained in local application state and predefined seed data.
- Persistent database storage is not currently implemented.
- Backend API integration is not currently implemented.
- Authentication and role-based account permissions are not currently implemented.

These limitations define the current scope and provide possible directions for future development.

## 8. Summary

Bilyntra uses a modular React architecture that separates interface components, application pages, business logic, utilities, data, and styling.

This organization improves code readability, reusability, and maintainability while providing a foundation for future system enhancements.
