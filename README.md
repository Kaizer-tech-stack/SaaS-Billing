# Bilyntra

**Subscription Billing and Configuration Analysis System**

Bilyntra is a web-based subscription billing and configuration analysis application designed to simplify usage tracking, billing calculations, invoice management, and subscription analysis.

It helps users organize customer subscriptions, monitor usage records, calculate billing charges, detect duplicate usage events, and analyze billing configurations through an organized dashboard.

## Features

### 1. Dashboard

- Displays important billing and subscription statistics.
- Provides an overview of customers, invoices, and revenue.
- Shows recent billing activities and relevant information.

### 2. Customer Management

- View customer records.
- Add and update customer information.
- Search and organize customer data.

### 3. Usage Records

- Monitor customer usage events.
- Search and filter usage records.
- Identify duplicate usage events.
- View usage record details.

### 4. Invoice Management

- Calculate customer billing based on subscription plans.
- Generate invoice records.
- Prevent duplicate usage events from being included in billing.
- View invoice information and billing breakdowns.

### 5. Reports and Analytics

- View revenue summaries.
- Analyze subscription plan distribution.
- Monitor billing health and invoice statuses.
- Review usage analytics.
- Generate customer billing reports and export reports.

### 6. Algorithm Lab

- Demonstrates recursive billing calculations.
- Explains the billing formula.
- Analyzes valid and rejected subscription configurations.
- Runs algorithm test cases and displays their results.

### 7. Responsive Interface

- Desktop, tablet, and mobile-friendly layouts.
- Mobile slide-out navigation.
- Organized interface for easier navigation.

## Technologies Used

- **React** – Builds the user interface.
- **Vite** – Provides the development environment and build tools.
- **JavaScript (JSX)** – Handles application logic and components.
- **CSS** – Handles styling and responsive layouts.
- **Lucide React** – Provides interface icons.

## Project Structure

```text
Bilyntra/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── modals/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/Kaizer-tech-stack/SaaS-Billing.git
```

Replace `https://github.com/Kaizer-tech-stack/SaaS-Billing.git` with your actual repository URL.

### 2. Open the Project

```bash
cd Bilyntra
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access Bilyntra.

## Available Commands

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Builds the application for production.

```bash
npm run lint
```

Runs the configured ESLint checks, if available.

## Current System Scope

Bilyntra currently uses local application state and predefined seed data to demonstrate its features and billing workflows.

Its billing calculations, duplicate detection, configuration analysis, and reporting features are implemented within the application. A persistent backend database and live external billing integrations are not currently part of this implementation.

## Project Goal

The goal of Bilyntra is to demonstrate how subscription billing operations and configuration analysis can be organized into a single application while applying programming concepts such as recursion, iteration, data validation, duplicate detection, and mathematical billing calculations.

---

**Bilyntra — Simplifying Subscription Billing and Configuration Analysis.**
