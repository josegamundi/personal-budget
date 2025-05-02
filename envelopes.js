// Essentials

const express = require('express');
const envelopesRouter = express.Router();

const {
    createEnvelope,
    getEnvelopes,
    getEnvelopeById,
    addAmountToEnvelope,
    extractAmountFromEnvelope,
    transferBetweenEnvelopes
} = require('./utils');

// Endpoints

// Create an envelope
envelopesRouter.post('/', (req, res, next) => {
    res.status(201).send(createEnvelope(req.body));
});

// Get all the envelopes
envelopesRouter.get('/', (req, res, next) => {
    res.send(getEnvelopes());
});

// Get an envelope
envelopesRouter.get('/:id', (req, res, next) => {
    res.send(getEnvelopeById(Number(req.params.id)));
});

// Add amount to envelope
envelopesRouter.put('/deposit/:id', (req, res, next) => {
    res.send(addAmountToEnvelope(
        Number(req.query.amount),
        Number(req.params.id),
        "deposit"
    ));
});

// Extract amount from envelope
envelopesRouter.put('/withdraw/:id', (req, res, next) => {
    res.send(extractAmountFromEnvelope(
        Number(req.query.amount),
        Number(req.params.id),
        "withdraw"
    ));
});

// Transfer amount between envelopes
envelopesRouter.post('/transfer/:from/:to', (req, res, next) => {
    res.send(transferBetweenEnvelopes(
        Number(req.query.amount),
        Number(req.params.from),
        Number(req.params.to)
    ));
});

// Delete an envelope
envelopesRouter.delete("/:id", (req, res, next) => {
    res.send(getEnvelopeById(Number(req.params.id), "delete"));
});

// Error catching
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

// Exports

module.exports = envelopesRouter;