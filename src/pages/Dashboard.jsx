import {
  CreditCard,
  Users,
  Activity,
  CircleAlert,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import PanelTitle from "../components/common/PanelTitle";
import InvoiceTable from "../components/common/InvoiceTable";
import { money } from "../utils/formatters";

function Dashboard({
  invoices,
  customers,
  usage,
  duplicates,
  revenue,
  onVerify,
  onCardClick,
}) {
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  const cleanInvoices = invoices.filter(
    (invoice) => invoice.duplicateCount === 0,
  ).length;

  const maxInvoiceTotal = Math.max(
    ...invoices.map((invoice) => invoice.total),
    1,
  );

  const integrityPercentage =
    invoices.length > 0
      ? Math.round((cleanInvoices / invoices.length) * 100)
      : 100;

  const stats = [
    {
      label: "Total billed",
      value: money(revenue),
      note: "Subscription + usage charges",
      icon: CreditCard,
      color: "emerald",
      trend: "Billing overview",
      destination: "Invoices",
    },
    {
      label: "Active customers",
      value: activeCustomers,
      note: "Currently active accounts",
      icon: Users,
      color: "cyan",
      trend: "Customer accounts",
      destination: "Customers",
    },
    {
      label: "Usage records",
      value: usage.length,
      note: "Recorded usage events",
      icon: Activity,
      color: "violet",
      trend: "Usage activity",
      destination: "Usage Records",
    },
    {
      label: "Duplicate records",
      value: duplicates.length,
      note: "Records requiring review",
      icon: CircleAlert,
      color: "orange",
      trend: duplicates.length > 0 ? "Needs attention" : "No issues detected",
      destination: "Usage Records",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Dashboard metrics */}
      <section className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className={`dashboard-stat-card ${stat.color}`}
              key={stat.label}
              role="button"
              tabIndex={0}
              aria-label={`Open ${stat.label}`}
              onClick={() => onCardClick(stat.destination)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onCardClick(stat.destination);
                }
              }}
            >
              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <Icon size={21} />
                </div>

                <span className="dashboard-stat-trend">
                  <ArrowUpRight size={13} />
                  {stat.trend}
                </span>
              </div>

              <div className="dashboard-stat-info">
                <span>{stat.label}</span>
                <h2>{stat.value}</h2>
                <small>{stat.note}</small>
              </div>
            </article>
          );
        })}
      </section>

      {/* Billing overview and invoice integrity */}
      <section className="dashboard-overview-grid">
        <article className="dashboard-panel billing-overview">
          <div className="dashboard-panel-heading">
            <PanelTitle
              title="Billing overview"
              sub="Estimated invoice total by customer"
            />

            <span className="dashboard-period-label">ALL INVOICES</span>
          </div>

          <div className="billing-chart-summary">
            <div>
              <span>Total billed</span>
              <h2>{money(revenue)}</h2>
            </div>

            <div className="billing-chart-indicator">
              <TrendingUp size={15} />
              <span>Current total</span>
            </div>
          </div>

          {invoices.length > 0 ? (
            <div className="modern-bar-chart">
              <div className="chart-y-axis">
                <span>{money(maxInvoiceTotal)}</span>
                <span>{money(maxInvoiceTotal * 0.66)}</span>
                <span>{money(maxInvoiceTotal * 0.33)}</span>
                <span>$0</span>
              </div>

              <div className="chart-content">
                <div className="chart-grid-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="chart-bars">
                  {invoices.map((invoice) => {
                    const height = Math.max(
                      5,
                      (invoice.total / maxInvoiceTotal) * 100,
                    );

                    return (
                      <div className="modern-chart-column" key={invoice.id}>
                        <div className="modern-chart-value">
                          {money(invoice.total)}
                        </div>

                        <div className="modern-bar-track">
                          <div
                            className="modern-bar-fill"
                            style={{ height: `${height}%` }}
                            title={`${invoice.customer.name}: ${money(invoice.total)}`}
                          />
                        </div>

                        <span className="modern-chart-label">
                          {invoice.customer.name.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-empty-chart">
              No invoice data available yet.
            </div>
          )}

          <div className="chart-footer">
            <span>
              <i className="chart-legend-dot" />
              Invoice totals
            </span>
            <small>Based on current customer usage and plans</small>
          </div>
        </article>

        <article className="dashboard-panel integrity-panel">
          <div className="dashboard-panel-heading">
            <PanelTitle
              title="Invoice integrity"
              sub="Automated verification checks"
            />

            <div className="integrity-shield">
              <ShieldCheck size={22} />
            </div>
          </div>

          <div className="integrity-content">
            <div
              className="modern-integrity-ring"
              style={{
                background: `conic-gradient(#16d6ad ${integrityPercentage}%, #123e49 ${integrityPercentage}% 100%)`,
              }}
            >
              <div className="modern-integrity-inner">
                <strong>
                  {cleanInvoices}/{invoices.length}
                </strong>
                <span>Clean</span>
              </div>
            </div>

            <div className="integrity-description">
              <h4>Verification summary</h4>
              <p>
                Invoices are recalculated from recorded usage. Duplicate event
                IDs are excluded from billing totals.
              </p>
            </div>
          </div>

          <div className="integrity-check-list">
            <div className="modern-integrity-check">
              <CheckCircle2 size={17} />
              <span>Duplicate detection enabled</span>
              <b>Active</b>
            </div>

            <div className="modern-integrity-check">
              <CheckCircle2 size={17} />
              <span>Usage-based billing calculated</span>
              <b>Active</b>
            </div>

            <div
              className={`modern-integrity-check ${
                duplicates.length > 0 ? "integrity-warning" : ""
              }`}
            >
              {duplicates.length > 0 ? (
                <CircleAlert size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}
              <span>Duplicate record review</span>
              <b>{duplicates.length > 0 ? "Review" : "Clear"}</b>
            </div>
          </div>
        </article>
      </section>

      {/* Recent invoices */}
      <section className="dashboard-panel dashboard-invoices">
        <div className="dashboard-invoices-heading">
          <PanelTitle
            title="Recent invoices"
            sub="Calculated billing records for all customers"
          />

          <span className="invoice-count">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}
          </span>
        </div>

        <InvoiceTable invoices={invoices} onVerify={onVerify} />
      </section>
    </div>
  );
}

export default Dashboard;
