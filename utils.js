// Essentials

const {
    throwErrorInDetail,
    checkBudget,
    checkEnvelope,
    checkTransactionData,
    checkUpdateBalance
} = require('./validations.js');

const budget= require('./data.js');

// Features

const recordTransaction = (type, target, amount) => {
    
    const data = {
        type, 
        target, 
        amount, 
        date: new Date(),
        id: budget.records.lastTransactionId += 1
    }

    checkTransactionData(data);

    budget.history.push(data);
};

const createEnvelope = (envelopeObj) => {

    checkBudget(budget);
    checkEnvelope(envelopeObj);
    
    envelopeObj.id = budget.records.lastEnvelopeId += 1;

    budget.balance += envelopeObj.balance;
    budget.envelopes.push(envelopeObj);

    recordTransaction(
        "deposit",
        envelopeObj.title,
        envelopeObj.balance
    );
    
    return envelopeObj;
}

const getEnvelopes = () => {

    checkBudget(budget);

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

const updateBalance = (queryObj, enveId) => {

    checkUpdateBalance(queryObj);

    let { transactionType, amount } = queryObj;
    amount = Number(amount);

    if (amount <= 0) {
        throwErrorInDetail(`The amount must be greater than 0`, '', 400);
    }

    const envelope = getEnvelopeById(enveId);

    if (transactionType === 'withdraw') {
        if (!budget.balance <= 0) {
            budget.balance -= amount;
            envelope.balance -= amount;
        } else {
            throwErrorInDetail(`The envelope balance is empty.`, '', 400);
        }
    } else if (transactionType === 'deposit') {
        budget.balance += amount;
        envelope.balance += amount;
    } else {
        throwErrorInDetail(`Invalid transaction type.`, '', 400);
    }

    recordTransaction(
        transactionType,
        envelope.title,
        amount
    );

    return budget;
};

// Exports

module.exports = {
    createEnvelope,
    getEnvelopes,
    getEnvelopeById,
    updateBalance
};