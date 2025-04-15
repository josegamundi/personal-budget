const express = require('express');
const envelopesRouter = express.Router();

const budget = require('./data');
const {
    createEnvelope
} = require('./utils');

// Create envelope
envelopesRouter.post('/', (req, res, next) => {
    const newEnvelope = req.body;
    try {
        createEnvelope(budget, newEnvelope);
        res.status(200).send(budget);
    } catch(error) {
        res.status(400).send(error.message);
    }
});

// Get all envelopes
envelopesRouter.get('/', (req, res, next) => {
    res.status(200).send(budget.envelopes);   
});

module.exports = envelopesRouter;