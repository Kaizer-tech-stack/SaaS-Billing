import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Users,
  X,
} from "lucide-react";

import "./App.css";

// Data
import { seedCustomers, seedUsage } from "./data/seedData";

// Services
import { generateInvoices, findDuplicates } from "./services/billingService";

// Utilities
import { money } from "./utils/formatters";

// Layout components
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import PageHeader from "./components/layout/PageHeader";

// Pages
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import UsageRecords from "./pages/UsageRecords";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";

// Modals
import RecordModal from "./components/modals/RecordModal";

function App() {
  // Main application state
  const [page, setPage] = useState("Dashboard");

  const [customers, setCustomers] = useState(seedCustomers);
  const [usage, setUsage] = useState(seedUsage);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [toast, setToast] = useState("");

  // Generate invoices automatically
  const invoices = useMemo(
    () => generateInvoices(customers, usage),
    [customers, usage],
  );

  // Detect duplicate usage events
  const duplicates = useMemo(() => findDuplicates(usage), [usage]);

  // Calculate total revenue
  const revenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);

  // Notification handler
  const notify = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2800);
  };

  // Add a new customer
  const addCustomer = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    setCustomers((old) => [
      ...old,
      {
        id: `CUS-${1001 + old.length}`,
        name: data.get("name").trim(),
        email: data.get("email").trim(),
        plan: data.get("plan"),
        status: "Active",
      },
    ]);
    setSelectedCustomer(null);

    setModal("");
    notify("Customer added successfully.");
  };

  // Open customer for editing
  const editCustomer = (customer) => {
    setSelectedCustomer(customer);
    setModal("customer");
  };

  // Update existing customer
  const updateCustomer = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    setCustomers((old) =>
      old.map((customer) =>
        customer.id === selectedCustomer.id
          ? {
              ...customer,
              name: data.get("name").trim(),
              email: data.get("email").trim(),
              plan: data.get("plan"),
              status: data.get("status"),
            }
          : customer,
      ),
    );

    setSelectedCustomer(null);
    setModal("");

    notify("Customer updated successfully.");
  };

  // Add a new usage record

  const addUsage = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const eventId = data.get("eventId").trim();

    const duplicate = usage.some(
      (record) => record.eventId.toLowerCase() === eventId.toLowerCase(),
    );

    if (duplicate) {
      notify("Duplicate event ID. This record was not saved.");
      return;
    }

    setUsage((old) => [
      ...old,
      {
        id: `USG-${String(
          Math.max(
            0,
            ...old.map((record) => Number(record.id.replace("USG-", "")) || 0),
          ) + 1,
        ).padStart(4, "0")}`,
        eventId,
        customerId: data.get("customerId"),
        metric: data.get("metric"),
        quantity: Number(data.get("quantity")),
        date: data.get("date"),
      },
    ]);

    setSelectedUsage(null);
    setModal("");

    notify("Usage record saved successfully.");
  };

  // Open usage record for editing
  const editUsage = (record) => {
    setSelectedUsage(record);
    setModal("usage");
  };

  // Open usage record for viewing
  const viewUsage = (record) => {
    setSelectedUsage(record);
    setModal("viewUsage");
  };

  // Update existing usage record
  const updateUsage = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const eventId = data.get("eventId").trim();

    // Check whether another record already uses this event ID
    //This prevents EVT_001 and evt_001 from being treated as different event IDs.
    const duplicate = usage.some(
      (record) =>
        record.id !== selectedUsage.id &&
        record.eventId.toLowerCase() === eventId.toLowerCase(),
    );

    if (duplicate) {
      notify("This event ID already exists. Please use a unique ID.");
      return;
    }

    setUsage((old) =>
      old.map((record) =>
        record.id === selectedUsage.id
          ? {
              ...record,
              eventId,
              customerId: data.get("customerId"),
              metric: data.get("metric"),
              quantity: Number(data.get("quantity")),
              date: data.get("date"),
            }
          : record,
      ),
    );

    setSelectedUsage(null);
    setModal("");

    notify("Usage record updated successfully.");
  };

  // Navigation configuration
  const nav = [
    ["Dashboard", LayoutDashboard],
    ["Customers", Users],
    ["Usage Records", Activity],
    ["Invoices", FileText],
    ["Reports", BarChart3],
  ];

  // Filter customers
  const filteredCustomers = customers.filter(
    (customer) =>
      `${customer.name} ${customer.email} ${customer.id}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All" || customer.status === filter),
  );

  // Filter usage records
  const filteredUsage = usage.filter((record) => {
    const customerName =
      customers.find((customer) => customer.id === record.customerId)?.name ||
      "";

    return `${record.id} ${record.eventId} ${customerName} ${record.metric}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // Verify invoice
  const verifyInvoice = (invoice) => {
    notify(`${invoice.id}: recalculated total is ${money(invoice.total)}.`);
  };

  // Render selected page
  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return (
          <Dashboard
            invoices={invoices}
            customers={customers}
            usage={usage}
            duplicates={duplicates}
            revenue={revenue}
            onVerify={verifyInvoice}
          />
        );

      case "Customers":
        return (
          <Customers
            customers={filteredCustomers}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            onEditCustomer={editCustomer}
          />
        );

      case "Usage Records":
        return (
          <UsageRecords
            usage={filteredUsage}
            customers={customers}
            duplicates={duplicates}
            search={search}
            setSearch={setSearch}
            onEditUsage={editUsage}
            onViewUsage={viewUsage}
          />
        );

      case "Invoices":
        return (
          <Invoices
            invoices={invoices.filter((invoice) =>
              `${invoice.id} ${invoice.customer.name}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            )}
            search={search}
            setSearch={setSearch}
            onVerify={verifyInvoice}
          />
        );

      case "Reports":
        return (
          <Reports
            invoices={invoices}
            customers={customers}
            usage={usage}
            duplicates={duplicates}
            revenue={revenue}
          />
        );

      default:
        return <div>Page not found.</div>;
    }
  };

  return (
    <div className="layout">
      <Sidebar
        page={page}
        setPage={(nextPage) => {
          setPage(nextPage);
          setSearch("");
        }}
        nav={nav}
        duplicates={duplicates}
      />

      <main className="main">
        <Navbar page={page} duplicates={duplicates} />

        <section className="content">
          <PageHeader
            page={page}
            onAddCustomer={() => setModal("customer")}
            onAddUsage={() => setModal("usage")}
          />

          {renderPage()}
        </section>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {toast}

          <button onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Customer and usage modal */}

      {modal && (
        <RecordModal
          modal={modal}
          customers={customers}
          selectedCustomer={selectedCustomer}
          selectedUsage={selectedUsage}
          onClose={() => {
            setModal("");
            setSelectedCustomer(null);
            setSelectedUsage(null);
          }}
          onAddCustomer={addCustomer}
          onUpdateCustomer={updateCustomer}
          onAddUsage={addUsage}
          onUpdateUsage={updateUsage}
        />
      )}
    </div>
  );
}

export default App;
