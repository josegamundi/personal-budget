const budget = {
    balance: 1000,
    envelopes: [
        {
            title: "main",
            balance: 1000,
            id: 1
        }
    ],
    history: [
        {
            type: "deposit",
            from: "unknown",
            to: "main", 
            amount: 1000,
            budgetBalance: 1000,
            date: new Date(),
            id: 1
        }
    ],
    records: {
        lastEnvelopeId: 1,
        lastTransactionId: 1
    }
}

module.exports = budget;