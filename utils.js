// Essentials

const {
    throwErrorInDetail,
    checkNumber,
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
            "create",
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

const getEnvelopeById = (id, option) => {

    checkNumber(id);

    const envelopes = getEnvelopes();
    const envelopeIndex = envelopes.findIndex((enve) => enve.id === id);
    if (envelopeIndex === -1) {
        throwErrorInDetail(`Envelope not found.`, '', 404);
    }
    const envelope = envelopes[envelopeIndex];

    if (option === "delete") {
        if (envelope.balance > 0) {
            throw new Error(`The envelope must be empty before being deleted.`);
        }
        return [
            envelopes.splice(envelopeIndex, 1),
            recordTransaction(
                "delete",
                "unknown",
                envelope.title,
                envelope.balance
            )
        ];
    };
    
    return envelope;
};

const addAmountToEnvelope = (amount, id, option) => {
    
    checkNumber(amount);

    let envelope;
    try {
        envelope = getEnvelopeById(id);
    } catch(error) {
        throwErrorInDetail(`Invalid destination.`, error, 404);
    }
    envelope.balance += amount;

    if (option === "deposit") {
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

const extractAmountFromEnvelope = (amount, id, option) => {
    
    checkNumber(amount);
    
    let envelope;
    try {
        envelope = getEnvelopeById(id);
    } catch(error) {
        throwErrorInDetail(`Invalid origin.`, error, 404);
    }
    if (envelope.balance <= 0) {
        throw new Error(`The ${envelope.title} balance is empty.`);
    } else if (amount > envelope.balance) {
        throw new Error(`The amount you want to withdraw is greater than the envelope balance.`);
    }
    envelope.balance -= amount;

    if (option === "withdraw") {
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