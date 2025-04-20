const express = require('express');
const envelopesRouter = express.Router();

const budget = require('./data');
const {
    createEnvelope
} = require('./utils');

// Create envelope
envelopesRouter.post('/', (req, res, next) => {
    try {
        const envelope = createEnvelope(req.body);
        res.status(201).send(envelope);
    } catch(error) {
        res.status(500).send(error.message);
    }
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

module.exports = envelopesRouter;