import { plans } from "../data/plans";

export function buildInvoice(customer, records) {
  const plan = plans[customer.plan];

  const customerRecords = records.filter(
    (record) => record.customerId === customer.id,
  );

  const seen = new Set();

  const unique = customerRecords.filter((record) => {
    if (seen.has(record.eventId)) return false;

    seen.add(record.eventId);
    return true;
  });

  const requests = unique
    .filter((record) => record.metric === "API requests")
    .reduce((sum, record) => sum + record.quantity, 0);

  const billable = Math.max(0, requests - plan.included);

  return {
    subscription: plan.fee,
    usageCharge: billable * plan.rate,
    total: plan.fee + billable * plan.rate,
    duplicateCount: customerRecords.length - unique.length,
    requests,
  };
}

export function findDuplicates(usage) {
  return usage.filter(
    (record, index) =>
      usage.findIndex((item) => item.eventId === record.eventId) !== index,
  );
}

export function generateInvoices(customers, usage) {
  return customers.map((customer, index) => ({
    id: `INV-2026-${1101 + index}`,
    customer,
    ...buildInvoice(customer, usage),
    status: customer.status === "Past due" ? "Overdue" : "Ready",
  }));
}
