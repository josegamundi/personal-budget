// Essentials

const {
    checkObject,
    throwErrorInDetail,
    budgetTemplate,
    envelopeTemplate,
    transactionInfoTemplate
} = require('./validations.js');

const budget = require('./data.js');

// Complements

const checkBudget = () => {

    try {
        checkObject(budgetTemplate, budget);
    } catch(error) {
        throwErrorInDetail(`There is a problem with the budget.`, error, 500);
    }
};

const recordTransaction = (transactionInfoObj) => {

    try {
        checkObject(transactionInfoTemplate, transactionInfoObj);
    } catch(error) {
        throwErrorInDetail(`The transaction record failed.`, error, 500);
    }
    
    // Add the current date and an ID to the record
    transactionInfoObj.date = new Date();
    transactionInfoObj.id = budget.records.lastTransactionId += 1;

    // Add the transaction record to the budget records
    budget.transactions.push(transactionInfoObj);
}

// Features

const createEnvelope = (envelopeObj) => {

    checkBudget();

    try {
        checkObject(envelopeTemplate, envelopeObj);
    } catch(error) {
        throwErrorInDetail(`The envelope is invalid.`, error, 400);
    }
    
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
    };
    recordTransaction(transactionInfo);

    return envelopeObj;
}

const getEnvelopes = () => {

    checkBudget();

    const envelopes = budget.envelopes;

    if (envelopes.length === 0) {
        throwErrorInDetail(`The envelope list is empty.`, '', 404);
    }

    return envelopes;
};

const getEnvelopeById = (id) => {

    if (typeof id !== "number") {
        throwErrorInDetail(`Invalid value type: The envelope ID is not a number.`, '', 400);
    }

    const envelopes = getEnvelopes();
    const envelope = envelopes.find((enve) => enve.id === id);
    
    if (!envelope) {
        throwErrorInDetail(`Envelope not found.`, '', 404);
    }
    
    return envelope;
}

// Exports

module.exports = {
    createEnvelope,
    getEnvelopes,
    getEnvelopeById
};