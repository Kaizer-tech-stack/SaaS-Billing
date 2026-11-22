import { useMemo, useState } from "react";
import {
  Calculator,
  Network,
  CheckCircle2,
  CircleAlert,
  RefreshCw,
} from "lucide-react";

import { plans } from "../data/plans";
import { buildInvoice } from "../services/billingService";
import { analyzeConfigurations } from "../utils/configurationAnalyzer";
import { money } from "../utils/formatters";
import PanelTitle from "../components/common/PanelTitle";

const BILLING_CYCLES = ["Monthly"];

const PAYMENT_METHODS = ["Credit / Debit Card", "E-wallet", "Bank Transfer"];

// ==========================================
// ALGORITHM TESTING FUNCTIONS
// ==========================================

const TEST_CUSTOMER = {
  id: "CUS-TEST",
  name: "Test Customer",
  plan: "Starter",
  status: "Active",
};

function createTestRecord(eventId, quantity, metric = "API requests") {
  return {
    id: `TEST-${eventId}`,
    eventId,
    customerId: TEST_CUSTOMER.id,
    metric,
    quantity,
  };
}

function runBillingTests() {
  const cases = [
    {
      name: "Empty usage records",
      input: "No usage records",
      records: [],
      expected: {
        requests: 0,
        total: 19,
        duplicateCount: 0,
        invalidCount: 0,
      },
    },
    {
      name: "Below included allowance",
      input: "5,000 API requests",
      records: [createTestRecord("EVT-001", 5000)],
      expected: {
        requests: 5000,
        total: 19,
        duplicateCount: 0,
        invalidCount: 0,
      },
    },
    {
      name: "Exact included allowance",
      input: "10,000 API requests",
      records: [createTestRecord("EVT-002", 10000)],
      expected: {
        requests: 10000,
        total: 19,
        duplicateCount: 0,
        invalidCount: 0,
      },
    },
    {
      name: "Above included allowance",
      input: "15,000 API requests",
      records: [createTestRecord("EVT-003", 15000)],
      expected: {
        requests: 15000,
        total: 29,
        duplicateCount: 0,
        invalidCount: 0,
      },
    },
    {
      name: "Duplicate event detection",
      input: "8,000 + duplicate 7,000 requests",
      records: [
        createTestRecord("EVT-004", 8000),
        createTestRecord("EVT-004", 7000),
      ],
      expected: {
        requests: 8000,
        total: 19,
        duplicateCount: 1,
        invalidCount: 0,
      },
    },
    {
      name: "Invalid negative quantity",
      input: "-50 and 12,000 API requests",
      records: [
        createTestRecord("EVT-005", -50),
        createTestRecord("EVT-006", 12000),
      ],
      expected: {
        requests: 12000,
        total: 23,
        duplicateCount: 0,
        invalidCount: 1,
      },
    },
    {
      name: "Large usage volume",
      input: "1,000,000 API requests",
      records: [createTestRecord("EVT-007", 1000000)],
      expected: {
        requests: 1000000,
        total: 1999,
        duplicateCount: 0,
        invalidCount: 0,
      },
    },
    {
      name: "Non-API metric excluded",
      input: "5,000 API requests + 50,000 storage units",
      records: [
        createTestRecord("EVT-008", 5000),
        createTestRecord("EVT-009", 50000, "Storage GB"),
      ],
      expected: {
        requests: 5000,
        total: 19,
        duplicateCount: 0,
        invalidCount: 0,
      },
    },
  ];

  return cases.map((test) => {
    const actual = buildInvoice(TEST_CUSTOMER, test.records);

    const passed =
      actual.requests === test.expected.requests &&
      Math.abs(actual.total - test.expected.total) < 0.000001 &&
      actual.duplicateCount === test.expected.duplicateCount &&
      actual.invalidCount === test.expected.invalidCount;

    return {
      name: test.name,
      input: test.input,
      expected: `${test.expected.requests.toLocaleString()} requests | ${money(test.expected.total)} | ${test.expected.duplicateCount} duplicates | ${test.expected.invalidCount} invalid`,
      actual: `${actual.requests.toLocaleString()} requests | ${money(actual.total)} | ${actual.duplicateCount} duplicates | ${actual.invalidCount} invalid`,
      passed,
    };
  });
}

function createTestCompatibility(defaultValue = true) {
  return Object.fromEntries(
    Object.keys(plans).flatMap((plan) =>
      PAYMENT_METHODS.map((method) => [`${plan}|${method}`, defaultValue]),
    ),
  );
}

function runCountingTests() {
  const allCompatible = createTestCompatibility(true);
  const oneDisabled = { ...allCompatible };
  oneDisabled["Starter|Bank Transfer"] = false;

  const starterDisabled = { ...allCompatible };

  PAYMENT_METHODS.forEach((method) => {
    starterDisabled[`Starter|${method}`] = false;
  });

  const noCompatibleMethods = createTestCompatibility(false);

  const cases = [
    {
      name: "All combinations supported",
      input: "3 plans × 1 cycle × 3 methods",
      args: {
        planNames: Object.keys(plans),
        billingCycles: BILLING_CYCLES,
        paymentMethods: PAYMENT_METHODS,
        compatibility: allCompatible,
      },
      expected: { totalPossible: 9, validCount: 9, invalidCount: 0 },
    },
    {
      name: "One payment option disabled",
      input: "Starter + Bank Transfer disabled",
      args: {
        planNames: Object.keys(plans),
        billingCycles: BILLING_CYCLES,
        paymentMethods: PAYMENT_METHODS,
        compatibility: oneDisabled,
      },
      expected: { totalPossible: 9, validCount: 8, invalidCount: 1 },
    },
    {
      name: "All Starter methods disabled",
      input: "Three Starter payment options disabled",
      args: {
        planNames: Object.keys(plans),
        billingCycles: BILLING_CYCLES,
        paymentMethods: PAYMENT_METHODS,
        compatibility: starterDisabled,
      },
      expected: { totalPossible: 9, validCount: 6, invalidCount: 3 },
    },
    {
      name: "Only one payment method",
      input: "3 plans × 1 cycle × 1 method",
      args: {
        planNames: Object.keys(plans),
        billingCycles: BILLING_CYCLES,
        paymentMethods: ["E-wallet"],
        compatibility: allCompatible,
      },
      expected: { totalPossible: 3, validCount: 3, invalidCount: 0 },
    },
    {
      name: "No available payment methods",
      input: "3 plans × 1 cycle × 0 methods",
      args: {
        planNames: Object.keys(plans),
        billingCycles: BILLING_CYCLES,
        paymentMethods: [],
        compatibility: allCompatible,
      },
      expected: { totalPossible: 0, validCount: 0, invalidCount: 0 },
    },
    {
      name: "No compatible combinations",
      input: "All plan-payment pairs disabled",
      args: {
        planNames: Object.keys(plans),
        billingCycles: BILLING_CYCLES,
        paymentMethods: PAYMENT_METHODS,
        compatibility: noCompatibleMethods,
      },
      expected: { totalPossible: 9, validCount: 0, invalidCount: 9 },
    },
  ];

  return cases.map((test) => {
    const actual = analyzeConfigurations(test.args);

    const passed =
      actual.totalPossible === test.expected.totalPossible &&
      actual.validCount === test.expected.validCount &&
      actual.invalidCount === test.expected.invalidCount;

    return {
      name: test.name,
      input: test.input,
      expected: `${test.expected.validCount} valid | ${test.expected.invalidCount} excluded | ${test.expected.totalPossible} total`,
      actual: `${actual.validCount} valid | ${actual.invalidCount} excluded | ${actual.totalPossible} total`,
      passed,
    };
  });
}

function AlgorithmLab({ customers, usage }) {
  const [activeTab, setActiveTab] = useState("billing");

  // Recursive billing state
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id || "",
  );

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  );

  const invoiceResult = useMemo(() => {
    if (!selectedCustomer) {
      return {
        invoice: null,
        error: "Please select a customer.",
      };
    }

    try {
      return {
        invoice: buildInvoice(selectedCustomer, usage),
        error: null,
      };
    } catch (error) {
      return {
        invoice: null,
        error: error.message || "Unable to calculate the invoice.",
      };
    }
  }, [selectedCustomer, usage]);

  const invoice = invoiceResult.invoice;
  const invoiceError = invoiceResult.error;

  const selectedPlan = selectedCustomer ? plans[selectedCustomer.plan] : null;

  const billableRequests =
    selectedPlan && invoice
      ? Math.max(0, invoice.requests - selectedPlan.included)
      : 0;

  // Fundamental Counting Principle state
  const planNames = Object.keys(plans);

  const [compatibility, setCompatibility] = useState(() =>
    Object.fromEntries(
      planNames.flatMap((plan) =>
        PAYMENT_METHODS.map((method) => [`${plan}|${method}`, true]),
      ),
    ),
  );

  const analysis = useMemo(
    () =>
      analyzeConfigurations({
        planNames,
        billingCycles: BILLING_CYCLES,
        paymentMethods: PAYMENT_METHODS,
        compatibility,
      }),
    [planNames, compatibility],
  );

  const testResults = useMemo(
    () => ({
      billing: runBillingTests(),
      counting: runCountingTests(),
    }),
    [],
  );

  const allTests = [
    ...testResults.billing.map((test) => ({
      ...test,
      algorithm: "Recursive Billing",
    })),
    ...testResults.counting.map((test) => ({
      ...test,
      algorithm: "Counting Principle",
    })),
  ];

  const passedTests = allTests.filter((test) => test.passed).length;
  const failedTests = allTests.length - passedTests;

  const toggleCompatibility = (plan, method) => {
    const key = `${plan}|${method}`;

    setCompatibility((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const resetCompatibility = () => {
    setCompatibility(
      Object.fromEntries(
        planNames.flatMap((plan) =>
          PAYMENT_METHODS.map((method) => [`${plan}|${method}`, true]),
        ),
      ),
    );
  };

  return (
    <div className="algorithm-lab">
      <section className="algorithm-intro">
        <div>
          <span className="algorithm-eyebrow">BILYNTRA COMPUTATION CENTER</span>
          <h2>Algorithm Lab</h2>
          <p>
            Explore the mathematical algorithms powering subscription billing
            and configuration analysis.
          </p>

          {/* Algorithm Testing and Validation */}
          <section className="panel algorithm-panel algorithm-testing-panel">
            <PanelTitle
              title="Algorithm Testing & Validation"
              sub="Automated test execution for both mathematical algorithms"
            />

            <div className="test-summary">
              <div className="test-summary-card">
                <span>Total test cases</span>
                <strong>{allTests.length}</strong>
              </div>

              <div className="test-summary-card">
                <span>Passed</span>
                <strong className="test-passed">{passedTests}</strong>
              </div>

              <div className="test-summary-card">
                <span>Failed</span>
                <strong className="test-failed">{failedTests}</strong>
              </div>

              <div className="test-summary-card">
                <span>Success rate</span>
                <strong>
                  {allTests.length
                    ? ((passedTests / allTests.length) * 100).toFixed(1)
                    : "0.0"}
                  %
                </strong>
              </div>
            </div>

            {["Recursive Billing", "Counting Principle"].map((algorithm) => {
              const tests = allTests.filter(
                (test) => test.algorithm === algorithm,
              );

              return (
                <div className="test-group" key={algorithm}>
                  <h4>{algorithm}</h4>

                  <div className="table-scroll">
                    <table className="algorithm-test-table">
                      <thead>
                        <tr>
                          <th>Test case</th>
                          <th>Input</th>
                          <th>Expected output</th>
                          <th>Actual output</th>
                          <th>Result</th>
                        </tr>
                      </thead>

                      <tbody>
                        {tests.map((test, index) => (
                          <tr key={`${algorithm}-${test.name}`}>
                            <td>
                              <b>TC-{index + 1}</b>
                              <small>{test.name}</small>
                            </td>

                            <td>{test.input}</td>

                            <td>{test.expected}</td>

                            <td>{test.actual}</td>

                            <td>
                              <span
                                className={
                                  test.passed
                                    ? "test-status passed"
                                    : "test-status failed"
                                }
                              >
                                {test.passed ? "PASS" : "FAIL"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            <div className="test-methodology">
              <h4>Testing methodology</h4>
              <p>
                Each test supplies a predefined input to the actual algorithm
                implementation. The resulting output is compared with an
                independently specified expected result.
              </p>
              <p>
                A test passes only when all checked output values match. These
                tests execute automatically when the Algorithm Lab loads.
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* Algorithm navigation */}
      <div className="algorithm-tabs">
        <button
          type="button"
          className={activeTab === "billing" ? "active" : ""}
          onClick={() => setActiveTab("billing")}
        >
          <Calculator size={17} />
          Recursive Billing
        </button>

        <button
          type="button"
          className={activeTab === "counting" ? "active" : ""}
          onClick={() => setActiveTab("counting")}
        >
          <Network size={17} />
          Configuration Analyzer
        </button>
      </div>

      {activeTab === "billing" && (
        <div className="algorithm-content">
          <section className="panel algorithm-panel">
            <PanelTitle
              title="Recursive Billing Engine"
              sub="Calculate actual customer invoices using recursive API usage accumulation"
            />

            <div className="algorithm-formula">
              <span>Recursive definition</span>
              <strong>T(0) = 0</strong>
              <strong>T(k) = T(k - 1) + qₖ</strong>
              <p>
                Each valid API usage record contributes its request quantity to
                the cumulative total.
              </p>
            </div>

            <div className="algorithm-controls">
              <label htmlFor="algorithm-customer">Select customer</label>

              <select
                id="algorithm-customer"
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
                disabled={customers.length === 0}
              >
                <option value="" disabled>
                  Select a customer
                </option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — {customer.plan}
                  </option>
                ))}
              </select>
            </div>

            {invoiceError ? (
              <div className="algorithm-empty" role="alert">
                {invoiceError}
              </div>
            ) : invoice && selectedCustomer && selectedPlan ? (
              <>
                <div className="algorithm-result-grid">
                  <div className="algorithm-result-card">
                    <span>Valid API requests</span>
                    <strong>{invoice.requests.toLocaleString()}</strong>
                  </div>

                  <div className="algorithm-result-card">
                    <span>Billable requests</span>
                    <strong>{billableRequests.toLocaleString()}</strong>
                  </div>

                  <div className="algorithm-result-card">
                    <span>Duplicate records</span>
                    <strong>{invoice.duplicateCount}</strong>
                  </div>

                  <div className="algorithm-result-card">
                    <span>Invalid API records</span>
                    <strong>{invoice.invalidCount}</strong>
                  </div>
                </div>

                <div className="algorithm-invoice-result">
                  <div>
                    <span>Customer</span>
                    <strong>{selectedCustomer.name}</strong>
                  </div>

                  <div>
                    <span>Subscription plan</span>
                    <strong>{selectedCustomer.plan}</strong>
                  </div>

                  <div>
                    <span>Monthly subscription</span>
                    <strong>{money(selectedPlan.fee)}</strong>
                  </div>

                  <div>
                    <span>Usage charge</span>
                    <strong>{money(invoice.usageCharge)}</strong>
                  </div>

                  <div className="algorithm-total">
                    <span>Calculated invoice total</span>
                    <strong>{money(invoice.total)}</strong>
                  </div>
                </div>

                <div className="algorithm-explanation">
                  <h4>Calculation breakdown</h4>

                  <p>
                    Total valid requests: {invoice.requests.toLocaleString()}
                  </p>

                  <p>
                    Included requests: {selectedPlan.included.toLocaleString()}
                  </p>

                  <p>
                    Billable requests: max(0,{" "}
                    {invoice.requests.toLocaleString()} -{" "}
                    {selectedPlan.included.toLocaleString()}) ={" "}
                    {billableRequests.toLocaleString()}
                  </p>

                  <p>
                    Usage charge: {billableRequests.toLocaleString()} ×{" "}
                    {selectedPlan.rate} = {money(invoice.usageCharge)}
                  </p>

                  <strong>
                    Final bill: {money(selectedPlan.fee)} +{" "}
                    {money(invoice.usageCharge)} = {money(invoice.total)}
                  </strong>
                </div>

                <div className="algorithm-proof">
                  <h4>
                    <CheckCircle2 size={17} />
                    Structural Induction Explanation
                  </h4>

                  <p>
                    <b>Base Case:</b> If the usage record list is empty, there
                    are no API requests to accumulate. Therefore, T(0) = 0.
                  </p>

                  <p>
                    <b>Inductive Hypothesis:</b> Assume that the recursive
                    function correctly calculates the total API requests from
                    the first k valid usage records.
                  </p>

                  <p>
                    <b>Inductive Step:</b> When another valid usage record is
                    added, its quantity is added to the previous total: T(k + 1)
                    = T(k) + qₖ₊₁.
                  </p>

                  <p>
                    <b>Conclusion:</b> By structural induction, the recursive
                    definition correctly accumulates the API request quantities
                    for every finite list of valid usage records.
                  </p>
                </div>
              </>
            ) : (
              <div className="algorithm-empty">
                No customers are available. Add a customer first to test
                recursive billing.
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "counting" && (
        <div className="algorithm-content">
          <section className="panel algorithm-panel">
            <PanelTitle
              title="Subscription Configuration Analyzer"
              sub="Generate and count valid subscription configurations"
            />

            <div className="algorithm-formula">
              <span>Fundamental Counting Principle</span>
              <strong>N = P × C × M</strong>
              <p>
                Total possible configurations are calculated by multiplying the
                number of choices in each category. Compatibility rules are then
                applied to identify valid configurations.
              </p>
            </div>

            <div className="configuration-section">
              <div className="configuration-heading">
                <div>
                  <h4>Payment compatibility rules</h4>
                  <p>
                    Select which payment methods each plan supports. These are
                    demonstration rules.
                  </p>
                </div>

                <button
                  type="button"
                  className="algorithm-reset-btn"
                  onClick={resetCompatibility}
                >
                  <RefreshCw size={14} />
                  Reset
                </button>
              </div>

              <div className="compatibility-table">
                <div className="compatibility-row compatibility-header">
                  <span>Subscription plan</span>
                  {PAYMENT_METHODS.map((method) => (
                    <span key={method}>{method}</span>
                  ))}
                </div>

                {planNames.map((plan) => (
                  <div className="compatibility-row" key={plan}>
                    <strong>{plan}</strong>

                    {PAYMENT_METHODS.map((method) => {
                      const key = `${plan}|${method}`;

                      return (
                        <label className="compatibility-option" key={key}>
                          <input
                            type="checkbox"
                            checked={compatibility[key] === true}
                            onChange={() => toggleCompatibility(plan, method)}
                            aria-label={`${plan} supports ${method}`}
                          />

                          <span>
                            {compatibility[key] ? "Supported" : "Unavailable"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="counting-summary">
              <div className="counting-stat">
                <span>Total possible</span>
                <strong>{analysis.totalPossible}</strong>
              </div>

              <div className="counting-stat">
                <span>Valid combinations</span>
                <strong className="counting-valid">
                  {analysis.validCount}
                </strong>
              </div>

              <div className="counting-stat">
                <span>Excluded combinations</span>
                <strong className="counting-invalid">
                  {analysis.invalidCount}
                </strong>
              </div>

              <div className="counting-stat">
                <span>Validity percentage</span>
                <strong>{analysis.validityPercentage.toFixed(1)}%</strong>
              </div>
            </div>

            <div className="algorithm-explanation">
              <h4>Mathematical Calculation</h4>

              <p>
                <b>Step 1 - Identify the available choices:</b>
              </p>

              <p>Subscription plans: {planNames.length}</p>
              <p>Billing cycles: {BILLING_CYCLES.length} (Monthly)</p>
              <p>Payment methods: {PAYMENT_METHODS.length}</p>

              <p>
                <b>Step 2 - Apply the Fundamental Counting Principle:</b>
              </p>

              <strong>
                {planNames.length} × {BILLING_CYCLES.length} ×{" "}
                {PAYMENT_METHODS.length} = {analysis.totalPossible} possible
                configurations
              </strong>

              <p>
                <b>Step 3 - Apply compatibility rules:</b>
              </p>

              <p>
                The algorithm checks whether each subscription plan supports the
                selected payment method. Unsupported combinations are excluded.
              </p>

              <p>Valid configurations: {analysis.validCount}</p>

              <p>Excluded configurations: {analysis.invalidCount}</p>

              <strong>
                {analysis.validCount} valid + {analysis.invalidCount} excluded ={" "}
                {analysis.totalPossible} total configurations
              </strong>
            </div>

            <div className="configuration-results">
              <h4>
                <CheckCircle2 size={17} />
                Valid configurations ({analysis.validCount})
              </h4>

              {analysis.configurations.length > 0 ? (
                <div className="configuration-list">
                  {analysis.configurations.map((item, index) => (
                    <div
                      className="configuration-item"
                      key={`${item.plan}-${item.cycle}-${item.method}`}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item.plan}</strong>
                      <span>{item.cycle}</span>
                      <span>{item.method}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="algorithm-empty">
                  No valid configurations. Enable at least one compatible
                  payment method.
                </p>
              )}
            </div>

            {analysis.invalidCount > 0 && (
              <div className="configuration-excluded">
                <h4>
                  <CircleAlert size={17} />
                  Excluded configurations ({analysis.invalidCount})
                </h4>

                {analysis.rejectedConfigurations.map((item) => (
                  <div
                    className="configuration-item excluded"
                    key={`${item.plan}-${item.cycle}-${item.method}`}
                  >
                    <strong>{item.plan}</strong>
                    <span>{item.cycle}</span>
                    <span>{item.method}</span>
                    <span>Unavailable</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default AlgorithmLab;
