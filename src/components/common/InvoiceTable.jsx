import { ShieldCheck } from "lucide-react";
import { money } from "../../utils/formatters";
import Status from "./Status";
import Empty from "./Empty";

function InvoiceTable({ invoices, onVerify }) {
  return (
    <div className="table-scroll">
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Subscription</th>
            <th>Usage charge</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((i) => (
            <tr key={i.id}>
              <td>
                <span className="invoice-id">{i.id}</span>
              </td>

              <td>
                <span className="invoice-customer">{i.customer.name}</span>
              </td>

              <td>
                <span className="invoice-amount">{money(i.subscription)}</span>
              </td>

              <td>
                <span className="invoice-amount">{money(i.usageCharge)}</span>
              </td>

              <td>
                <span className="invoice-total">{money(i.total)}</span>
              </td>

              <td>
                <Status status={i.status} />
              </td>

              <td>
                <button
                  type="button"
                  className="verify"
                  onClick={() => onVerify(i)}
                  title={`Verify invoice ${i.id}`}
                >
                  <ShieldCheck size={15} />
                  <span>Verify</span>
                </button>
              </td>
            </tr>
          ))}

          {!invoices.length && <Empty cols={7} />}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
