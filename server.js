const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const items = require('./routes/api/items');

// Initializing express into variable app
const app = express();

// Body-parser has a piece of middleware that we need to add
app.use(bodyParser.json());

// define namespace for `items` routes
app.use('/api/items', items);

// Get mongo DB URI from configuration
const dbURI = require('./config/keys').mongoURI;

// Connect to mongo DB
mongoose.connect(dbURI)
  .then(() => {
    console.log("Database connection is established.")
  }).catch((err) => {
    console.err("Database connection is not established:", err);
  });

// Set a port
// heroku stores port in this environment variable
const port = process.env.PORT || 5000;

// create server instance
app.listen(port, () => console.log(`Server started on port ${port}`));

