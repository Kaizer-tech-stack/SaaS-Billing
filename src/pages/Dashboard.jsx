import {
  CreditCard,
  Users,
  Activity,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";

import Stat from "../components/common/Stat";
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

  return (
    <>
      <div className="stats">
        <Stat
          icon={<CreditCard />}
          label="Total billed this month"
          value={money(revenue)}
          note="Subscription + usage charges"
        />

        <Stat
          icon={<Users />}
          label="Active customers"
          value={activeCustomers}
          note="Paying accounts"
        />

        <Stat
          icon={<Activity />}
          label="Usage records"
          value={usage.length}
          note="Events this period"
        />

        <Stat
          icon={<CircleAlert />}
          label="Duplicate records"
          value={duplicates.length}
          note="Require review"
        />
      </div>

      <div className="two-col">
        <section className="panel">
          <PanelTitle
            title="Billing overview"
            sub="Estimated invoice total by customer"
          />

          <div className="big-number">{money(revenue)}</div>

          <div className="bars">
            {invoices.map((invoice) => (
              <div className="bar-col" key={invoice.id}>
                <span>{money(invoice.total)}</span>

                <div className="bar-track">
                  <i
                    style={{
                      height: `${Math.max(
                        8,
                        (invoice.total / maxInvoiceTotal) * 100,
                      )}%`,
                    }}
                  />
                </div>

                <small>{invoice.customer.name.split(" ")[0]}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelTitle
            title="Invoice integrity"
            sub="Automated verification checks"
          />

          <div className="integrity">
            <div className="ring">
              {cleanInvoices}/{invoices.length}
              <small>clean</small>
            </div>

            <div>
              <b>Verification summary</b>
              <p>
                Invoices are independently recalculated from raw usage.
                Duplicate event IDs are excluded from billing totals.
              </p>

              <div className="integrity-check">
                <CheckCircle2 size={15} />
                Duplicate detection enabled
              </div>

              <div className="integrity-check">
                <CheckCircle2 size={15} />
                Usage-based billing calculated
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="panel table-panel">
        <PanelTitle
          title="Recent invoices"
          sub="Calculated billing records for all customers"
        />

        <InvoiceTable invoices={invoices} onVerify={onVerify} />
      </section>
    </>
  );
}

export default Dashboard;
