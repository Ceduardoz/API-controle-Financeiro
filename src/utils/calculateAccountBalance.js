export function calculateAccountBalance(account) {
  let balance = Number(account.initialBalance || 0);
  const outgoing = account.outgoingTransactions || [];
  const incoming = account.incomingTransactions || [];

  for (const transaction of outgoing) {
    const amount = Number(transaction.amount);

    if (transaction.type === "INCOME") {
      balance += amount;
    } else if (
      transaction.type === "EXPENSE" ||
      transaction.type === "TRANSFER"
    ) {
      balance -= amount;
    }
  }

  for (const transaction of incoming) {
    const amount = Number(transaction.amount);
    if (transaction.type === "TRANSFER") {
      balance += amount;
    }
  }

  return Number(balance.toFixed(2));
}

export function calculateAvailableBalance(account) {
  const totalBalance = calculateAccountBalance(account);
  const reserved = Number(account.reservedBalance || 0);

  return Number((totalBalance - reserved).toFixed(2));
}
