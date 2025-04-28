// Global checkers

const checkValueType = (value, type) => {

    if (type === "array") {
        if (Array.isArray(value)) return true;
    } else if (typeof value === type) {
        return true;
    }
    return false;
};

const checkObject = (objTemplate, obj) => {

    if (typeof obj !== "object") throw new Error(`The object to check is not an object.`);

    outerLoop: for (const propTemplate in objTemplate) {
        for (const prop in obj) {
            if (propTemplate === prop) {
                if (checkValueType(obj[prop], objTemplate[propTemplate])) {
                    continue outerLoop;
                };
                throw new Error(`Invalid value type: Property '${prop}' is not a '${objTemplate[propTemplate]}'.`);
            }
        }
        throw new Error(`The '${propTemplate}' property is missing from the object.`);
    }
    return true;
};

// Error in detail

const throwErrorInDetail = (message, prevError, httpStatusCode) => {
    throw new Error(message, {
        cause: {
            detail: prevError || { message: `No other errors were detected.` },
            code: httpStatusCode
        }
    });
};

// Local checkers

const checkBudget = (obj) => {

    const budgetTemplate = {
        balance: "number",
        envelopes: "array",
        history: "array",
        records: "object"
    };

    try {
        checkObject(budgetTemplate, obj);
    } catch(error) {
        throwErrorInDetail(`There is a problem with the budget.`, error, 500);
    }
};

const checkEnvelope = (obj) => {

    const envelopeTemplate = {
        title: "string",
        balance: "number"
    }

    try {
        checkObject(envelopeTemplate, obj);
    } catch(error) {
        throwErrorInDetail(`The envelope is invalid.`, error, 400);
    }
};

const checkTransactionData = (obj) => {

    const transactionDataTemplate = {
        type: "string",
        target: "string",
        amount: "number",
        date: "object",
        id: "number"
    }

    try {
        checkObject(transactionDataTemplate, obj);
    } catch(error) {
        throwErrorInDetail(`Transaction data recording has failed.`, error, 500);
    }
};

const checkUpdateBalance = (obj) => {

    const updateBalanceTemplate = {
        transactionType: "string",
        amount: "string"
    }

    try {
        checkObject(updateBalanceTemplate, obj);
    } catch(error) {
        throwErrorInDetail(`The transaction has failed.`, error, 400);
    }
};

// Exports

module.exports = {
    throwErrorInDetail,
    checkBudget,
    checkEnvelope,
    checkTransactionData,
    checkUpdateBalance
};