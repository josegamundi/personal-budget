const {
    checkBudget,
    isEnvelopeValid
} = require('./validations.js');

const recordTransaction = (budget, record) => {
    record.date = new Date();
    record.id = budget.records.lastTransactionId += 1;
    budget.transactions.push(record);
}

const createEnvelope = (budget, envelope) => {

    checkBudget(budget);

    if (!isEnvelopeValid(envelope)) {
        throw new Error("The envelope doesn't meet the required structure.");
    }
    envelope.id = budget.records.lastEnvelopeId += 1;
    budget.balance += envelope.balance;
    budget.envelopes.push(envelope);

    recordTransaction(budget, {
        from: "deposit",
        to: envelope.title,
        amount: envelope.balance,
        comment: `${envelope.title} envelope created with $${envelope.balance}`
    });
}


module.exports = {
    createEnvelope
};