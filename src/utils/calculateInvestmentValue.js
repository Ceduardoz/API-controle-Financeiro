export function calculateInvestmentValue(investment) {
  const investedAmount = Number(investment.investedAmount);
  const annualRate = Number(investment.annualRate);

  const startDate = new Date(investment.startDate);
  const now = new Date();

  const diffMs = now - startDate;
  const days = diffMs / (1000 * 60 * 60 * 24);

  const annualRateDecimal = annualRate / 100;

  const value = investedAmount * Math.pow(1 + annualRateDecimal / 365, days);

  return Number(value.toFixed(2));
}
