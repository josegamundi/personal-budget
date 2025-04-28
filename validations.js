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

const checkNumber = (value) => {

    if (!checkValueType(value, "number")) {
        throwErrorInDetail(`Invalid value type: The value is not a number.`, '', 400);
    }
    if (value <= 0) {
        throwErrorInDetail(`The value must be greater than 0`, '', 400); 
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
    return true;
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
    return true;
};

const checkTransactionData = (obj) => {

    const transactionDataTemplate = {
        type: "string",
        from: "string",
        to: "string",
        amount: "number",
        budgetBalance: "number",
        date: "object",
        id: "number"
    }

    try {
        checkObject(transactionDataTemplate, obj);
    } catch(error) {
        throwErrorInDetail(`Transaction data recording has failed.`, error, 500);
    }
    return true;
};

// Exports

module.exports = {
    checkNumber,
    throwErrorInDetail,
    checkBudget,
    checkEnvelope,
    checkTransactionData
};