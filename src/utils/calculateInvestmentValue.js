const getBusinessDays = (start, end) => {
  let count = 0;
  let curDate = new Date(start.getTime());
  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

export function calculateInvestmentValue(investment) {
  const amount = Number(investment.investedAmount);
  const percentOfCDI = Number(investment.annualRate);

  const CDI_ANUAL = 14.65 / 100;

  const effectiveAnnualRate = CDI_ANUAL * (percentOfCDI / 100);

  const businessDays = getBusinessDays(
    new Date(investment.startDate),
    new Date(),
  );

  const grossValue =
    amount * Math.pow(1 + effectiveAnnualRate, businessDays / 252);
  const profit = grossValue - amount;

  const daysDiff = Math.floor(
    (new Date() - new Date(investment.startDate)) / (1000 * 60 * 60 * 24),
  );

  switch (investment.type) {
    case "CDB":
    case "CDI":
      let irTax = 0.225; // Até 180 dias
      if (daysDiff > 720)
        irTax = 0.15; // +2 anos
      else if (daysDiff > 360)
        irTax = 0.175; // +1 ano
      else if (daysDiff > 180) irTax = 0.2; // +6 meses

      return Number((amount + profit * (1 - irTax)).toFixed(2));

    case "LCI":
    case "LCA":
      return Number(grossValue.toFixed(2));

    default:
      return Number(grossValue.toFixed(2));
  }
}
