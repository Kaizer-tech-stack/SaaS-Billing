import PanelTitle from "../components/common/PanelTitle";
import SearchBox from "../components/common/SearchBox";
import InvoiceTable from "../components/common/InvoiceTable";

function Invoices({ invoices, search, setSearch, onVerify }) {
  return (
    <section className="panel table-panel invoice-register">
      <div className="panel-head-row">
        <PanelTitle
          title="Invoice register"
          sub="Calculated charges and verification"
        />

        <SearchBox value={search} onChange={setSearch} />
      </div>

      <InvoiceTable invoices={invoices} onVerify={onVerify} />
    </section>
  );
}

export default Invoices;
