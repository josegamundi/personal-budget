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

const getEnvelopes = () => {

    checkBudget(budget);
    return budget.envelopes;
};

const getEnvelopeById = (id, option) => {

    checkNumber(id, "envelope ID");

    const envelopes = getEnvelopes();
    const envelopeIndex = envelopes.findIndex((enve) => enve.id === id);
    if (envelopeIndex === -1) {
        throwErrorInDetail(`The envelope ID:${id} does not return any matches.`, 404);
    }
    const envelope = envelopes[envelopeIndex];

    if (option === "delete") {
        if (envelope.balance > 0) {
            throwErrorInDetail(`The ${envelope.title} envelope must be empty before being deleted.`, 400);
        }
        return [
            envelopes.splice(envelopeIndex, 1)[0],
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

const createEnvelope = (envelope) => {

    checkBudget(budget);
    checkEnvelope(envelope);
    
    envelope.title = envelope.title.toLowerCase();

    if (getEnvelopes().findIndex((enve) => enve.title === envelope.title) !== -1) {
        throwErrorInDetail(`The ${envelope.title} envelope already exists`, 400);
    }
    
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

const addAmountToEnvelope = (amount, id, option) => {
    
    checkNumber(amount, "amount to add");

    const envelope = getEnvelopeById(id);
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
    
    checkNumber(amount, "amount to be extracted");
    
    const envelope = getEnvelopeById(id);
    if (envelope.balance <= 0) {
        throwErrorInDetail(`The balance of the ${envelope.title} envelope is empty.`, 400);
    } else if (amount > envelope.balance) {
        throwErrorInDetail(`The amount you want to withdraw is greater than the balance of the ${envelope.title} envelope.`, 400);
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