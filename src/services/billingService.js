import { plans } from "../data/plans";

// Algorithm 1: Recursive API request accumulation
export function calculateRequestsRecursively(records, index = 0) {
  if (!Array.isArray(records)) {
    throw new TypeError("Records must be an array.");
  }

  // Base case
  if (index >= records.length) {
    return 0;
  }

  const quantity = Number(records[index].quantity);

  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new RangeError("Usage quantity must be a non-negative safe integer.");
  }

  // Recursive case
  return quantity + calculateRequestsRecursively(records, index + 1);
}

export function buildInvoice(customer, records) {
  const plan = plans[customer.plan];

  if (!plan) {
    throw new Error(`Unknown subscription plan: ${customer.plan}`);
  }

  const customerRecords = records.filter(
    (record) => record.customerId === customer.id,
  );

  // Remove duplicate event IDs (case-insensitive)
  const seen = new Set();

  const unique = customerRecords.filter((record) => {
    const eventId = String(record.eventId || "").toLowerCase();

    if (seen.has(eventId)) return false;

    seen.add(eventId);
    return true;
  });

  // Only API request records are billable
  const apiRecords = unique.filter(
    (record) => record.metric === "API requests",
  );

  // Exclude invalid quantities from billing
  const validApiRecords = apiRecords.filter((record) => {
    const quantity = Number(record.quantity);

    return Number.isSafeInteger(quantity) && quantity >= 0;
  });

  const invalidCount = apiRecords.length - validApiRecords.length;

  // Recursive calculation
  const requests = calculateRequestsRecursively(validApiRecords);

  // Billing formula: B(n) = F + r max(0, n - I)
  const billable = Math.max(0, requests - plan.included);
  const usageCharge = billable * plan.rate;

  return {
    subscription: plan.fee,
    usageCharge,
    total: plan.fee + usageCharge,
    duplicateCount: customerRecords.length - unique.length,
    invalidCount,
    requests,
  };
}

export function findDuplicates(usage) {
  const seen = new Set();

  return usage.filter((record) => {
    const eventId = String(record.eventId || "").toLowerCase();

    if (seen.has(eventId)) return true;

    seen.add(eventId);
    return false;
  });
}

export function generateInvoices(customers, usage) {
  return customers.map((customer, index) => ({
    id: `INV-2026-${1101 + index}`,
    customer,
    ...buildInvoice(customer, usage),
    status: customer.status === "Past due" ? "Overdue" : "Ready",
  }));
}
