const budget = {
    balance: 1000,
    envelopes: [
        {
            title: "main",
            balance: 1000,
            id: 1
        }
    ],
    transactions: [
        {   
            from: "deposit",
            to: "main",
            amount: 1000,
            comment: "Budget started",
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