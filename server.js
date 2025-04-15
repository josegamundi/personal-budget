const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Add module and middleware for parsing request bodies:
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Check server connection
app.get('/', (req, res, next) => {
    res.status(200).send("Hello, World");
});


// Connect envelope router
const envelopesRouter = require('./envelopes');
app.use('/api/envelopes', envelopesRouter);

app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
});