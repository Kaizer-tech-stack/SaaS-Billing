import { useState } from "react";
import { plans } from "../data/plans";
import {
  Activity,
  CircleAlert,
  CreditCard,
  Download,
  Users,
} from "lucide-react";

import Stat from "../components/common/Stat";
import PanelTitle from "../components/common/PanelTitle";
import Status from "../components/common/Status";
import { money } from "../utils/formatters";

function Reports({ invoices, customers, usage, duplicates, revenue }) {
  // Billing Formula Simulator
  const [selectedPlan, setSelectedPlan] = useState("Starter");
  const [requestInput, setRequestInput] = useState("10000");

  const currentPlan = plans[selectedPlan];

  const requestCount = Math.max(0, Math.floor(Number(requestInput) || 0));

  const calculateBill = (requests) => {
    const billableRequests = Math.max(0, requests - currentPlan.included);

    return currentPlan.fee + billableRequests * currentPlan.rate;
  };

  const currentBill = calculateBill(requestCount);
  const nextBill = calculateBill(requestCount + 1);

  const billableRequests = Math.max(0, requestCount - currentPlan.included);

  const actualIncrease = nextBill - currentBill;

  const expectedIncrease =
    requestCount >= currentPlan.included ? currentPlan.rate : 0;

  const inductionPassed =
    Math.abs(actualIncrease - expectedIncrease) < 0.0000001;

  const preciseMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  // Customer statistics
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  // Invoice statistics
  const readyInvoices = invoices.filter(
    (invoice) => invoice.status === "Ready",
  ).length;

  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === "Overdue",
  ).length;

  // API request statistics
  const totalRequests = usage
    .filter((record) => record.metric === "API requests")
    .reduce((total, record) => total + Number(record.quantity || 0), 0);

  // Subscription distribution
  const planCounts = ["Starter", "Growth", "Enterprise"].map((plan) => {
    const count = customers.filter((customer) => customer.plan === plan).length;

    return {
      name: plan,
      count,
      percentage: customers.length > 0 ? (count / customers.length) * 100 : 0,
    };
  });

  // Usage breakdown by metric
  const usageBreakdown = Object.values(
    usage.reduce((groups, record) => {
      const metric = record.metric || "Other";

      if (!groups[metric]) {
        groups[metric] = {
          name: metric,
          quantity: 0,
          events: 0,
        };
      }

      groups[metric].quantity += Number(record.quantity || 0);
      groups[metric].events += 1;

      return groups;
    }, {}),
  );

  const maxUsage = Math.max(1, ...usageBreakdown.map((item) => item.quantity));

  // Export customer billing report as CSV
  const exportReport = () => {
    const headers = [
      "Customer",
      "Email",
      "Plan",
      "Subscription",
      "Usage Charges",
      "Total",
      "Status",
    ];

    const rows = invoices.map((invoice) => [
      invoice.customer.name,
      invoice.customer.email,
      invoice.customer.plan,
      invoice.subscription,
      invoice.usageCharge,
      invoice.total,
      invoice.status,
    ]);

    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "billflow-customer-billing-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      {/* Summary cards */}
      <div className="stats">
        <Stat
          icon={<CreditCard />}
          label="Total revenue"
          value={money(revenue)}
          note="Estimated billing total"
        />

        <Stat
          icon={<Users />}
          label="Total customers"
          value={customers.length}
          note={`${activeCustomers} active accounts`}
        />

        <Stat
          icon={<Activity />}
          label="API requests"
          value={totalRequests.toLocaleString()}
          note="Recorded usage"
        />

        <Stat
          icon={<CircleAlert />}
          label="Duplicate events"
          value={duplicates.length}
          note="Excluded from billing"
        />
      </div>

      {/* Analytics panels */}
      <div className="reports-grid">
        {/* Subscription breakdown */}
        <section className="panel report-panel">
          <PanelTitle
            title="Subscription breakdown"
            sub="Customer distribution by plan"
          />

          <div className="report-breakdown">
            {planCounts.map((plan) => (
              <div className="breakdown-item" key={plan.name}>
                <div className="breakdown-info">
                  <span>{plan.name}</span>
                  <b>{plan.count} customers</b>
                </div>

                <div className="report-progress">
                  <div
                    className="report-progress-fill"
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>

                <span className="breakdown-percentage">
                  {plan.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </section>
        {/* Mathematical Induction Explanation */}
        <section className="panel report-panel induction-explanation">
          <PanelTitle
            title="Why the billing formula works"
            sub="Mathematical induction applied to the selected subscription plan"
          />

          <div className="induction-intro">
            <p>
              We want to prove that for every whole-number request count
              starting at the included allowance, the billing formula calculates
              the correct amount.
            </p>

            <div className="induction-general-formula">
              B(n) = F + r(n − I), for n ≥ I
            </div>
          </div>

          <div className="induction-step-card">
            <span className="induction-step-number">01</span>
            <div>
              <h4>Base Case</h4>
              <p>Start at the included request allowance:</p>
              <div className="induction-equation">B(I) = F + r(I − I)</div>
              <div className="induction-equation">
                B({currentPlan.included.toLocaleString()}) ={" "}
                {preciseMoney(currentPlan.fee)} +{" "}
                {preciseMoney(currentPlan.rate)} × 0
              </div>
              <strong>B(I) = {preciseMoney(currentPlan.fee)}</strong>
              <p>
                The formula works at the starting point because the customer has
                not exceeded the included requests.
              </p>
            </div>
          </div>

          <div className="induction-step-card">
            <span className="induction-step-number">02</span>
            <div>
              <h4>Inductive Hypothesis</h4>
              <p>
                Assume the formula is true for some whole number k, where k is
                at least the included allowance.
              </p>
              <div className="induction-equation">B(k) = F + r(k − I)</div>
              <p>
                This assumption will help us prove the formula for the next
                request count, k + 1.
              </p>
            </div>
          </div>

          <div className="induction-step-card">
            <span className="induction-step-number">03</span>
            <div>
              <h4>Inductive Step</h4>
              <p>We need to prove that the formula also works for k + 1.</p>
              <div className="induction-equation">
                B(k + 1) = F + r((k + 1) − I)
              </div>
              <div className="induction-equation">
                B(k + 1) = F + r(k − I) + r
              </div>
              <div className="induction-equation">B(k + 1) = B(k) + r</div>
              <strong>
                B(k + 1) = B(k) + {preciseMoney(currentPlan.rate)}
              </strong>
              <p>
                By the inductive hypothesis, adding one API request increases
                the bill by exactly the plan's extra request rate.
              </p>
            </div>
          </div>

          <div className="induction-conclusion">
            <strong>Conclusion</strong>
            <p>
              Since the base case is true and the inductive step is valid, the
              billing formula holds for every whole-number request count greater
              than or equal to {currentPlan.included.toLocaleString()} for the{" "}
              {selectedPlan} plan.
            </p>
          </div>
        </section>

        {/* Billing health */}
        <section className="panel report-panel">
          <PanelTitle title="Billing health" sub="Invoice status overview" />

          <div className="billing-health-list">
            <div className="health-row">
              <span>
                <i className="health-dot neutral" />
                Total invoices
              </span>
              <b>{invoices.length}</b>
            </div>

            <div className="health-row">
              <span>
                <i className="health-dot success" />
                Ready invoices
              </span>
              <b>{readyInvoices}</b>
            </div>

            <div className="health-row">
              <span>
                <i className="health-dot danger" />
                Overdue invoices
              </span>
              <b>{overdueInvoices}</b>
            </div>

            <div className="health-row">
              <span>
                <i className="health-dot warning" />
                Duplicate events
              </span>
              <b>{duplicates.length}</b>
            </div>
          </div>
        </section>
      </div>

      {/* Usage analytics */}
      <section className="panel report-panel usage-analytics">
        <PanelTitle
          title="Usage analytics"
          sub="Recorded quantity by usage metric"
        />

        {usageBreakdown.length > 0 ? (
          <div className="usage-breakdown">
            {usageBreakdown.map((item) => (
              <div className="usage-breakdown-item" key={item.name}>
                <div className="usage-breakdown-heading">
                  <div>
                    <b>{item.name}</b>
                    <span>{item.events} recorded events</span>
                  </div>

                  <strong>{item.quantity.toLocaleString()}</strong>
                </div>

                <div className="report-progress">
                  <div
                    className="report-progress-fill usage-progress-fill"
                    style={{
                      width: `${(item.quantity / maxUsage) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="report-empty">No usage data available.</p>
        )}
      </section>
      {/* Billing Formula Simulator */}
      <section className="panel report-panel billing-simulator">
        <PanelTitle
          title="Billing Formula Simulator"
          sub="Test subscription pricing and mathematical induction"
        />

        <div className="simulator-controls">
          <div className="simulator-field">
            <label htmlFor="simulator-plan">Subscription plan</label>

            <select
              id="simulator-plan"
              value={selectedPlan}
              onChange={(event) => setSelectedPlan(event.target.value)}
            >
              {Object.keys(plans).map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          <div className="simulator-field">
            <label htmlFor="simulator-requests">Total API requests (n)</label>

            <input
              id="simulator-requests"
              type="number"
              min="0"
              step="1"
              value={requestInput}
              onChange={(event) => setRequestInput(event.target.value)}
            />
          </div>
        </div>

        <div className="simulator-plan-info">
          <div>
            <span>Monthly fee</span>
            <strong>{preciseMoney(currentPlan.fee)}</strong>
          </div>

          <div>
            <span>Included requests</span>
            <strong>{currentPlan.included.toLocaleString()}</strong>
          </div>

          <div>
            <span>Extra request rate</span>
            <strong>{preciseMoney(currentPlan.rate)}</strong>
          </div>
        </div>

        <div className="simulator-results">
          <div className="simulator-result">
            <span>Current bill B(n)</span>
            <strong>{preciseMoney(currentBill)}</strong>
            <small>{requestCount.toLocaleString()} requests</small>
          </div>

          <div className="simulator-result">
            <span>Next bill B(n + 1)</span>
            <strong>{preciseMoney(nextBill)}</strong>
            <small>{(requestCount + 1).toLocaleString()} requests</small>
          </div>

          <div className="simulator-result">
            <span>Billable requests</span>
            <strong>{billableRequests.toLocaleString()}</strong>
            <small>Requests beyond plan allowance</small>
          </div>
        </div>

        <div className="simulator-formula">
          <h4>Billing formula</h4>

          <p>B(n) = F + r × max(0, n − I)</p>

          <p>
            B({requestCount.toLocaleString()}) = {preciseMoney(currentPlan.fee)}{" "}
            + {preciseMoney(currentPlan.rate)} × max(0,{" "}
            {requestCount.toLocaleString()} −{" "}
            {currentPlan.included.toLocaleString()})
          </p>

          <strong>Calculated total: {preciseMoney(currentBill)}</strong>
        </div>

        <div className="induction-check">
          <div>
            <h4>Mathematical induction check</h4>
            <p>Compare B(n + 1) − B(n) with the expected increase.</p>
          </div>

          <span className={inductionPassed ? "check-passed" : "check-failed"}>
            {inductionPassed ? "✓ Passed" : "✕ Failed"}
          </span>
        </div>

        <div className="induction-details">
          <div>
            <span>Actual increase</span>
            <strong>{preciseMoney(actualIncrease)}</strong>
          </div>

          <div>
            <span>Expected increase</span>
            <strong>{preciseMoney(expectedIncrease)}</strong>
          </div>

          <div>
            <span>Result</span>
            <strong>
              {requestCount >= currentPlan.included
                ? "Overage rate applies"
                : "Still within included usage"}
            </strong>
          </div>
        </div>
      </section>

      {/* Customer billing report */}
      <section className="panel table-panel customer-billing-report">
        <div className="report-table-header">
          <PanelTitle
            title="Customer billing report"
            sub="Invoice totals and billing status per customer"
          />

          <button
            type="button"
            className="export-report-btn"
            onClick={exportReport}
            disabled={!invoices.length}
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

        <div className="table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Subscription</th>
                <th>Usage charges</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <b className="report-customer-name">
                      {invoice.customer.name}
                    </b>
                  </td>

                  <td>{invoice.customer.plan}</td>

                  <td>{money(invoice.subscription)}</td>

                  <td>{money(invoice.usageCharge)}</td>

                  <td>
                    <b className="report-total">{money(invoice.total)}</b>
                  </td>

                  <td>
                    <Status status={invoice.status} />
                  </td>
                </tr>
              ))}

              {!invoices.length && (
                <tr>
                  <td colSpan={6} className="report-empty">
                    No report data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Reports;
