import { CircleAlert, Eye, Pencil } from "lucide-react";

import PanelTitle from "../components/common/PanelTitle";
import SearchBox from "../components/common/SearchBox";
import Status from "../components/common/Status";
import Empty from "../components/common/Empty";

function UsageRecords({
  usage,
  customers,
  duplicates,
  search,
  setSearch,
  onEditUsage,
  onViewUsage,
}) {
  return (
    <>
      <div className="notice">
        <CircleAlert />
        <span>
          <b>{duplicates.length} duplicate event(s) detected.</b> Duplicate
          event IDs are excluded from billing totals.
        </span>
      </div>

      <section className="panel table-panel">
        <div className="panel-head-row">
          <PanelTitle
            title="Usage ledger"
            sub="Raw usage events received this billing period"
          />

          <SearchBox value={search} onChange={setSearch} />
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Event ID</th>
                <th>Customer</th>
                <th>Metric</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Validation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {usage.map((record) => {
                const duplicate = usage.some(
                  (item) =>
                    item.id !== record.id && item.eventId === record.eventId,
                );

                const customer = customers.find(
                  (item) => item.id === record.customerId,
                );

                return (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.eventId}</td>
                    <td>{customer?.name || "Unknown customer"}</td>
                    <td>{record.metric}</td>
                    <td>{record.quantity.toLocaleString()}</td>
                    <td>{record.date}</td>

                    <td>
                      <Status status={duplicate ? "Duplicate" : "Unique"} />
                    </td>

                    <td>
                      <div className="usage-actions">
                        <button
                          type="button"
                          className="view-usage-btn"
                          onClick={() => onViewUsage(record)}
                          title="View usage record"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          className="edit-usage-btn"
                          onClick={() => onEditUsage(record)}
                          title="Edit usage record"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!usage.length && <Empty cols={8} />}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default UsageRecords;
