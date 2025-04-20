// Essentials

const {
    checkObject,
    budgetTemplate,
    envelopeTemplate,
    transactionInfoTemplate
} = require('./validations.js');

const budget = require('./data.js');

// Features

const recordTransaction = (transactionInfoObj) => {

    checkObject(transactionInfoTemplate, transactionInfoObj);

    // Add the current date and an ID to the record
    transactionInfoObj.date = new Date();
    transactionInfoObj.id = budget.records.lastTransactionId += 1;

    // Add the transaction record to the budget records
    budget.transactions.push(transactionInfoObj);
}

const createEnvelope = (envelopeObj) => {

    checkObject(budgetTemplate, budget);
    checkObject(envelopeTemplate, envelopeObj);
    
    // Add an ID to the envelope
    envelopeObj.id = budget.records.lastEnvelopeId += 1;

    // Push the new envelope to the budget
    budget.balance += envelopeObj.balance;
    budget.envelopes.push(envelopeObj);

    // Record the transaction information
    const transactionInfo = {
        from: "deposit",
        to: envelopeObj.title,
        amount: envelopeObj.balance,
        comment: `${envelopeObj.title} envelope created with $${envelopeObj.balance}`
    }
    recordTransaction(transactionInfo);

    return envelopeObj;
}

// Exports

module.exports = {
    createEnvelope
};