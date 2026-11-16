import { X } from "lucide-react";
import ModalButtons from "../common/ModalButtons";

function RecordModal({
  modal,
  customers,
  selectedCustomer,
  selectedUsage,
  onClose,
  onAddCustomer,
  onUpdateCustomer,
  onAddUsage,
  onUpdateUsage,
}) {
  if (!modal) return null;

  const isEditingCustomer = Boolean(selectedCustomer);
  const isEditingUsage = Boolean(selectedUsage);
  const isViewingUsage = modal === "viewUsage";

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="modal">
        <div className="modal-title">
          <h2>
            {modal === "customer"
              ? isEditingCustomer
                ? "Edit customer"
                : "Add customer"
              : isViewingUsage
                ? "Usage record details"
                : isEditingUsage
                  ? "Edit usage record"
                  : "Record usage"}
          </h2>

          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* CUSTOMER FORM */}
        {modal === "customer" && (
          <form
            key={selectedCustomer?.id || "new-customer"}
            onSubmit={isEditingCustomer ? onUpdateCustomer : onAddCustomer}
          >
            <label>
              Company name
              <input
                name="name"
                required
                placeholder="Acme Software"
                defaultValue={selectedCustomer?.name || ""}
              />
            </label>

            <label>
              Billing email
              <input
                name="email"
                type="email"
                required
                placeholder="billing@company.com"
                defaultValue={selectedCustomer?.email || ""}
              />
            </label>

            <label>
              Plan
              <select
                name="plan"
                defaultValue={selectedCustomer?.plan || "Starter"}
              >
                <option>Starter</option>
                <option>Growth</option>
                <option>Enterprise</option>
              </select>
            </label>

            {isEditingCustomer && (
              <label>
                Account status
                <select name="status" defaultValue={selectedCustomer.status}>
                  <option value="Active">Active</option>
                  <option value="Past due">Past due</option>
                </select>
              </label>
            )}

            <ModalButtons onCancel={onClose} />
          </form>
        )}

        {/* VIEW USAGE - READ ONLY */}
        {isViewingUsage && selectedUsage && (
          <div className="usage-details">
            <label>Record ID</label>
            <p>{selectedUsage.id}</p>

            <label>Event ID</label>
            <p>{selectedUsage.eventId}</p>

            <label>Customer</label>
            <p>
              {customers.find(
                (customer) => customer.id === selectedUsage.customerId,
              )?.name || "Unknown customer"}
            </p>

            <label>Metric</label>
            <p>{selectedUsage.metric}</p>

            <label>Quantity</label>
            <p>{selectedUsage.quantity.toLocaleString()}</p>

            <label>Date</label>
            <p>{selectedUsage.date}</p>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* ADD / EDIT USAGE FORM */}
        {modal === "usage" && (
          <form
            key={selectedUsage?.id || "new-usage"}
            onSubmit={isEditingUsage ? onUpdateUsage : onAddUsage}
          >
            <label>
              Customer
              <select
                name="customerId"
                required
                defaultValue={selectedUsage?.customerId || ""}
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Unique event ID
              <input
                name="eventId"
                required
                placeholder="evt_12345"
                defaultValue={selectedUsage?.eventId || ""}
              />
            </label>

            <label>
              Metric
              <select
                name="metric"
                defaultValue={selectedUsage?.metric || "API requests"}
              >
                <option>API requests</option>
                <option>Storage (GB)</option>
                <option>Transactions</option>
              </select>
            </label>

            <label>
              Quantity
              <input
                name="quantity"
                type="number"
                min="1"
                required
                defaultValue={selectedUsage?.quantity || ""}
              />
            </label>

            <label>
              Date
              <input
                name="date"
                type="date"
                required
                defaultValue={selectedUsage?.date || ""}
              />
            </label>

            <ModalButtons onCancel={onClose} />
          </form>
        )}
      </section>
    </div>
  );
}

export default RecordModal;
