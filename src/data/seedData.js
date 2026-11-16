export const seedCustomers = [
  {
    id: "CUS-1001",
    name: "Northstar Labs",
    email: "billing@northstar.io",
    plan: "Growth",
    status: "Active",
  },
  {
    id: "CUS-1002",
    name: "Pixel Forge",
    email: "finance@pixelforge.co",
    plan: "Starter",
    status: "Active",
  },
  {
    id: "CUS-1003",
    name: "Cloudline Systems",
    email: "accounts@cloudline.dev",
    plan: "Enterprise",
    status: "Active",
  },
  {
    id: "CUS-1004",
    name: "Brightpath Studio",
    email: "admin@brightpath.app",
    plan: "Growth",
    status: "Past due",
  },
];
export const seedUsage = [
  {
    id: "USG-0001",
    eventId: "evt_001",
    customerId: "CUS-1001",
    metric: "API requests",
    quantity: 145000,
    date: "2026-11-02",
  },
  {
    id: "USG-0002",
    eventId: "evt_002",
    customerId: "CUS-1002",
    metric: "API requests",
    quantity: 18500,
    date: "2026-11-04",
  },
  {
    id: "USG-0003",
    eventId: "evt_003",
    customerId: "CUS-1003",
    metric: "API requests",
    quantity: 1250000,
    date: "2026-11-05",
  },
  {
    id: "USG-0004",
    eventId: "evt_004",
    customerId: "CUS-1004",
    metric: "API requests",
    quantity: 78000,
    date: "2026-11-06",
  },
  // Intentional duplicate event for testing.
  {
    id: "USG-0005",
    eventId: "evt_002",
    customerId: "CUS-1002",
    metric: "API requests",
    quantity: 18500,
    date: "2026-11-04",
  },
];
