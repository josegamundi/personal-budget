const checkBudget = (budget) => {
    const propList = [
        "balance",
        "envelopes",
        "transactions",
        "records"
    ];

    loop: for (let i = 0; i < propList.length; i++) {
        for (const prop in budget) {
            if (propList[i] === prop) continue loop;
        }
        switch (propList[i]) {
            case "balance":
                    budget.balance = 0;
                break;
            case "envelopes":
                    budget.envelopes = [];
                break;
            case "transactions":
                    budget.transactions = [];
                break;
            case "records":
                    budget.records = {};
                break;
        }
        console.log(`Property '${propList[i]}' is missing and has been added to the Budget`);
    }
    
    console.log('Budget is good to go!');
};

const isEnvelopeValid = (envelope) => {
    const propList = [
        "title",
        "balance"
    ];

    loop: for (let i = 0; i < propList.length; i++) {
        for (const prop in envelope) {
            if (propList[i] === prop) continue loop; 
        }
        console.log(`The '${propList[i]}' property of envelope is missing.`);
        return false;
    };

    if (typeof envelope.title !== "string") {
        envelope.title = String(envelope.title);
    }
    if (typeof envelope.balance !== "number") {
        envelope.balance = Number(envelope.balance);
    }

    console.log('Envelope is good to go!');
    return true;
};

module.exports = {
    checkBudget,
    isEnvelopeValid
}