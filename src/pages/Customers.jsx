import { Pencil } from "lucide-react";

import PanelTitle from "../components/common/PanelTitle";
import SearchBox from "../components/common/SearchBox";
import Status from "../components/common/Status";
import Empty from "../components/common/Empty";

function Customers({
  customers,
  search,
  setSearch,
  filter,
  setFilter,
  onEditCustomer,
}) {
  return (
    <section className="panel table-panel">
      <div className="panel-head-row">
        <PanelTitle
          title="Customer directory"
          sub="Manage your subscribed customer accounts"
        />

        <SearchBox value={search} onChange={setSearch} />
      </div>

      <div className="filter-row">
        {["All", "Active", "Past due"].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Company</th>
              <th>Billing email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>

                <td>
                  <b>{customer.name}</b>
                </td>

                <td>{customer.email}</td>

                <td>{customer.plan}</td>

                <td>
                  <Status status={customer.status} />
                </td>

                <td>
                  <button
                    type="button"
                    className="edit-customer-btn"
                    onClick={() => onEditCustomer(customer)}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {!customers.length && <Empty cols={6} />}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Customers;
