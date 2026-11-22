import { plans } from "../data/plans";

function isValidQuantity(value) {
  if (typeof value !== "number" && typeof value !== "string") {
    return false;
  }

  if (typeof value === "string" && value.trim() === "") {
    return false;
  }

  const quantity = Number(value);

  return Number.isSafeInteger(quantity) && quantity >= 0;
}

// Algorithm 1: Recursive API request accumulation
export function calculateRequestsRecursively(records, index = 0) {
  if (!Array.isArray(records)) {
    throw new TypeError("Records must be an array.");
  }

  if (!Number.isSafeInteger(index) || index < 0) {
    throw new RangeError("Index must be a non-negative safe integer.");
  }

  // Base case
  if (index >= records.length) {
    return 0;
  }

  const quantity = records[index]?.quantity;

  if (!isValidQuantity(quantity)) {
    throw new RangeError("Usage quantity must be a non-negative safe integer.");
  }

  // Recursive case
  return Number(quantity) + calculateRequestsRecursively(records, index + 1);
}

// Algorithm 2: Flexible multi-metric billing
export function buildInvoice(customer, records) {
  if (!customer || typeof customer !== "object") {
    throw new TypeError("A valid customer is required.");
  }

  if (
    customer.id === undefined ||
    customer.id === null ||
    String(customer.id).trim() === ""
  ) {
    throw new Error("Customer ID is required.");
  }

  if (!Array.isArray(records)) {
    throw new TypeError("Usage records must be an array.");
  }

  if (
    records.some(
      (record) =>
        !record || typeof record !== "object" || Array.isArray(record),
    )
  ) {
    throw new TypeError("Each usage record must be a valid object.");
  }

  const plan = plans[customer.plan];

  if (!plan) {
    throw new Error(`Unknown subscription plan: ${customer.plan}`);
  }

  const customerRecords = records.filter(
    (record) => record.customerId === customer.id,
  );

  // Remove duplicate event IDs (case-insensitive).
  const seen = new Set();

  const unique = customerRecords.filter((record) => {
    const eventId = String(record.eventId || "").toLowerCase();

    if (seen.has(eventId)) return false;

    seen.add(eventId);
    return true;
  });

  const metricBreakdown = {};
  let usageCharge = 0;
  let invalidCount = 0;
  let requests = 0;

  // Calculate every enabled metric in the selected plan.
  for (const [metricName, config] of Object.entries(plan.metrics || {})) {
    if (!config.enabled) continue;

    const metricRecords = unique.filter(
      (record) => record.metric === metricName,
    );

    // Exclude invalid quantities from billing.
    const validRecords = metricRecords.filter((record) =>
      isValidQuantity(record.quantity),
    );

    invalidCount += metricRecords.length - validRecords.length;

    // Preserve recursive API request accumulation.
    const quantity =
      metricName === "API requests"
        ? calculateRequestsRecursively(validRecords)
        : validRecords.reduce(
            (total, record) => total + Number(record.quantity),
            0,
          );

    if (metricName === "API requests") {
      requests = quantity;
    }

    const billable = Math.max(0, quantity - config.included);
    const charge = billable * config.rate;

    usageCharge += charge;

    metricBreakdown[metricName] = {
      enabled: true,
      quantity,
      included: config.included,
      billable,
      rate: config.rate,
      unit: config.unit,
      charge,
    };
  }

  return {
    subscription: plan.fee,
    usageCharge,
    total: plan.fee + usageCharge,
    duplicateCount: customerRecords.length - unique.length,
    invalidCount,
    requests,
    metricBreakdown,
  };
}

// Algorithm 3: Duplicate usage detection
export function findDuplicates(usage) {
  const seen = new Set();

  return usage.filter((record) => {
    const eventId = String(record.eventId ?? "")
      .trim()
      .toLowerCase();

    // Keep records without an event ID.
    // Their uniqueness cannot be established.
    if (!eventId) return true;

    if (seen.has(eventId)) return false;

    seen.add(eventId);
    return true;
  });
}

// Algorithm 4: Invoice generation
export function generateInvoices(customers, usage) {
  return customers.map((customer, index) => ({
    id: `INV-2026-${1101 + index}`,
    customer,
    ...buildInvoice(customer, usage),
    status: customer.status === "Past due" ? "Overdue" : "Ready",
  }));
}
