const express = require('express');
const envelopesRouter = express.Router();

const budget = require('./data');
const {
    createEnvelope
} = require('./utils');

// Create envelope
envelopesRouter.post('/', (req, res, next) => {
    const envelope = createEnvelope(req.body);
    res.status(201).send(envelope);
});

/*
// Get all envelopes
envelopesRouter.get('/', (req, res, next) => {
    res.status(200).send(budget.envelopes);  
});

// Get an envelope
envelopesRouter.get('/:id', (req, res, next) => {
    const envelopeId = Number(req.params.id);
    const respond = budget.envelopes.find((envelope) => envelope.id === envelopeId);
    res.status(200).send(respond);
});
*/

// Error handler:
envelopesRouter.use((err, req, res, next) => {
    
    if (err["cause"]) {
        const message = `
            ${err.message}
            ${err["cause"].detail.message}
        `;
        const statusCode = err["cause"].code;
        res.status(statusCode).send(message);
    } 

    res.status(500).send(err.message);
});

module.exports = envelopesRouter;