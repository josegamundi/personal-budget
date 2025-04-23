// Essentials

const express = require('express');
const envelopesRouter = express.Router();

const {
    createEnvelope,
    getEnvelopes,
    getEnvelopeById
} = require('./utils');

// Endpoints

// Create an envelope
envelopesRouter.post('/', (req, res, next) => {
    req.messageBack = createEnvelope(req.body);
    req.statusCode = 201;
    next();
});

// Get all the envelopes
envelopesRouter.get('/', (req, res, next) => {
    req.messageBack = getEnvelopes();
    next();
});

// Get an envelope
envelopesRouter.get('/:id', (req, res, next) => {
    req.messageBack = getEnvelopeById(Number(req.params.id));
    next();
});

// Handlers

// Successful response 
envelopesRouter.use('/', (req, res, next) => {
    const messageBack = req.messageBack || 'OK';
    const statusCode = req.statusCode || 200;
    res.status(statusCode).send(messageBack);
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