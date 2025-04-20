// Checking tools

const checkValueType = (value, type) => {

    if (type === "array") {
        if (Array.isArray(value)) return true;
    } else if (typeof value === type) {
        return true;
    }
    return false;
};

const checkObject = (objTemplate, obj) => {

    if (typeof obj !== "object") throw new Error(`The object to check is not an object`);

    outerLoop: for (const propTemplate in objTemplate) {
        for (const prop in obj) {
            if (propTemplate === prop) {
                if (checkValueType(obj[prop], objTemplate[propTemplate])) {
                    continue outerLoop;
                };
                throw new Error(`Property '${prop}' doesn't match the value type '${objTemplate[propTemplate]}'.`);
            }
        }
        throw new Error(`The '${propTemplate}' property is missing from the object.`);
    }
    return true;
};

// Validation templates

const budgetTemplate = {
    balance: "number",
    envelopes: "array",
    transactions: "array",
    records: "object"
};

const envelopeTemplate = {
    title: "string",
    balance: "number"
}

const transactionInfoTemplate = {
    from: "string",
    to: "string",
    amount: "number",
    comment: "string"
}

// Exports

module.exports = {
    checkObject,
    budgetTemplate,
    envelopeTemplate,
    transactionInfoTemplate
}