// Essentials

const {
    checkNumber,
    throwErrorInDetail,
    checkBudget,
    checkEnvelope,
    checkTransactionData
} = require('./validations.js');

const budget= require('./data.js');

// Features

const recordTransaction = (type, from, to, amount) => {
    
    const data = {
        type,
        from,
        to,
        amount,
        budgetBalance: budget.balance,
        date: new Date(),
        id: budget.records.lastTransactionId += 1
    }
    checkTransactionData(data);
    budget.history.push(data);

    return data;
};

const createEnvelope = (envelope) => {

    checkBudget(budget);
    checkEnvelope(envelope);
    
    envelope.id = budget.records.lastEnvelopeId += 1;

    budget.balance += envelope.balance;
    budget.envelopes.push(envelope);

    return [
        envelope,
        recordTransaction(
            "creation",
            "unknown",
            envelope.title,
            envelope.balance
        )
    ];
};

const getEnvelopes = () => {

    checkBudget(budget);

    const envelopes = budget.envelopes;
    if (envelopes.length === 0) {
        throwErrorInDetail(`The envelope list is empty.`, '', 404);
    }

    return envelopes;
};

const getEnvelopeById = (id) => {

    checkNumber(id);

    const envelopes = getEnvelopes();
    const envelope = envelopes.find((enve) => enve.id === id);
    if (!envelope) {
        throwErrorInDetail(`Envelope not found.`, '', 404);
    }
    
    return envelope;
};

const addAmountToEnvelope = (amount, id, deposit = false) => {
    
    checkNumber(amount);

    let envelope;
    try {
        envelope = getEnvelopeById(id);
    } catch(error) {
        throwErrorInDetail(`Invalid destination.`, error, 404);
    }
    envelope.balance += amount;

    if (deposit) {
        budget.balance += amount;
        return [
            envelope,
            recordTransaction(
                "deposit",
                "unknown",
                envelope.title,
                amount
            )
        ]
    }

    return envelope;
};

const extractAmountFromEnvelope = (amount, id, withdraw = false) => {
    
    checkNumber(amount);
    
    let envelope;
    try {
        envelope = getEnvelopeById(id);
    } catch(error) {
        throwErrorInDetail(`Invalid origin.`, error, 404);
    }
    if (envelope.balance <= 0) {
        throw new Error(`The ${envelope.title} balance is empty.`);
    }
    envelope.balance -= amount;

    if (withdraw) {
        budget.balance -= amount;
        return [
            envelope,
            recordTransaction(
                "withdraw",
                envelope.title,
                "unknown",
                amount
            )
        ]
    }

    return envelope;
};

const transferBetweenEnvelopes = (amount, fromId, toId) => {
    
    const origin = extractAmountFromEnvelope(amount, fromId);
    const destination = addAmountToEnvelope(amount, toId);
    
    return [
        origin,
        destination,
        recordTransaction(
            "transfer",
            origin.title,
            destination.title,
            amount
        )
    ];
};

// Exports

module.exports = {
    createEnvelope,
    getEnvelopes,
    getEnvelopeById,
    addAmountToEnvelope,
    extractAmountFromEnvelope,
    transferBetweenEnvelopes
};