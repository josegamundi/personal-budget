// Essentials

const {
    checkObject,
    throwErrorInDetail,
    budgetTemplate,
    envelopeTemplate,
    transactionInfoTemplate
} = require('./validations.js');

const budget = require('./data.js');

// Features

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

const createEnvelope = (envelopeObj) => {

    try {
        checkObject(budgetTemplate, budget);
    } catch(error) {
        throwErrorInDetail(`There is a problem with the budget.`, error, 500);
    }

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

const getEnvelope = (id) => {

    const envelopeList = budget.envelopes;
    
    // Check if there are envelopes in the list.
    if (envelopeList.length === 0) {
        throw new Error(`The envelope list is empty.`);
    }

    // Get an envelope by ID
    if (id && typeof id === "number") {
        
        const envelope = envelopeList.find((enve) => enve.id === id);
        
        if (!envelope) {
            throwErrorInDetail(`Envelope not found.`, '', 404);
        }
        
        return envelope;
    }

    return envelopeList;
};

// Exports

module.exports = {
    createEnvelope,
    getEnvelope
};