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

module.exports = envelopesRouter;