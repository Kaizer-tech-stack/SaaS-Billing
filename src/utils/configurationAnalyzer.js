export function analyzeConfigurations({
  planNames,
  billingCycles,
  paymentMethods,
  compatibility,
}) {
  const configurations = [];
  const rejectedConfigurations = [];

  const totalPossible =
    planNames.length * billingCycles.length * paymentMethods.length;

  for (const plan of planNames) {
    for (const cycle of billingCycles) {
      for (const method of paymentMethods) {
        const key = `${plan}|${method}`;

        const configuration = {
          plan,
          cycle,
          method,
        };

        if (compatibility[key] === true) {
          configurations.push(configuration);
        } else {
          rejectedConfigurations.push(configuration);
        }
      }
    }
  }

  const validCount = configurations.length;
  const invalidCount = rejectedConfigurations.length;

  const validityPercentage =
    totalPossible > 0 ? (validCount / totalPossible) * 100 : 0;

  return {
    totalPossible,
    validCount,
    invalidCount,
    validityPercentage,
    configurations,
    rejectedConfigurations,
  };
}
