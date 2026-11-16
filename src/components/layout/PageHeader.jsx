import { Plus } from "lucide-react";

function PageHeader({ page, onAddCustomer, onAddUsage }) {
  const descriptions = {
    Dashboard: "Monitor your billing performance and account activity.",
    Customers: "Manage customer accounts and subscription plans.",
    "Usage Records": "Track usage events and identify duplicate records.",
    Invoices: "Review calculated invoices and billing verification.",
    Reports: "Analyze revenue, subscriptions, and usage activity.",
  };

  return (
    <div className="page-head">
      <div>
        <p className="eyebrow">BILLING OPERATIONS</p>

        <h1>{page === "Dashboard" ? "Good day, Admin" : page}</h1>

        <p className="page-description">{descriptions[page]}</p>
      </div>

      <div className="page-actions">
        {page === "Customers" && (
          <button className="primary" onClick={onAddCustomer}>
            <Plus size={16} />
            Add customer
          </button>
        )}

        {page === "Usage Records" && (
          <button className="primary" onClick={onAddUsage}>
            <Plus size={16} />
            Record usage
          </button>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
