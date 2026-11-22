export const plans = {
  Starter: {
    fee: 19,
    billingCycle: "monthly",

    metrics: {
      "API requests": {
        enabled: true,
        included: 10000,
        rate: 0.002,
        unit: "requests",
      },

      "Storage (GB)": {
        enabled: false,
        included: 0,
        rate: 0,
        unit: "GB",
      },

      Transactions: {
        enabled: false,
        included: 0,
        rate: 0,
        unit: "transactions",
      },
    },

    // Temporary compatibility with the existing billing engine.
    included: 10000,
    rate: 0.002,
  },

  Growth: {
    fee: 79,
    billingCycle: "monthly",

    metrics: {
      "API requests": {
        enabled: true,
        included: 100000,
        rate: 0.0015,
        unit: "requests",
      },

      "Storage (GB)": {
        enabled: false,
        included: 0,
        rate: 0,
        unit: "GB",
      },

      Transactions: {
        enabled: true,
        included: 25000,
        rate: 0.005,
        unit: "transactions",
      },
    },

    // Temporary compatibility with the existing billing engine.
    included: 100000,
    rate: 0.0015,
  },

  Enterprise: {
    fee: 249,
    billingCycle: "monthly",

    metrics: {
      "API requests": {
        enabled: true,
        included: 1000000,
        rate: 0.001,
        unit: "requests",
      },

      "Storage (GB)": {
        enabled: true,
        included: 500,
        rate: 0.1,
        unit: "GB",
      },

      Transactions: {
        enabled: true,
        included: 100000,
        rate: 0.003,
        unit: "transactions",
      },
    },

    // Temporary compatibility with the existing billing engine.
    included: 1000000,
    rate: 0.001,
  },
};
