export function calculateAccountBalance(account) {
  let balance = Number(account.initialBalance);

  for (const transaction of account.outgoingTransactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "INCOME") {
      balance += amount;
    } else if (transaction.type === "EXPENSE") {
      balance -= amount;
    } else if (transaction.type === "TRANSFER") {
      balance -= amount;
    }
  }

  for (const transaction of account.incomingTransactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "TRANSFER") {
      balance += amount;
    }
  }

  return Number(balance.toFixed(2));
}
