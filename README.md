# MERN application
Application is based on video series [Learn The MERN Stack](https://www.youtube.com/watch?v=PBTYxXADG_k) created by [Brad Traversy](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA).

Application itself is a shopping list.

# 1. Building Basic Express Server
## 1.1 Setting up project configuration
First we will create a package configuration. We will call `npm init` and enter the infrmation, so at the end we will get this:
```json
{
  "name": "mern-app",
  "version": "1.0.0",
  "description": "Example shopping list build with the MERN stack.",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
  },
  "author": "gerkenv@gmail.com",
  "license": "ISC"
}
```
Now we will install our dependencies:
```
npm i -s express body-parser mongoose concurrently
```
* `express` - backend framework to create our routes (API).
* `body-parser` - to handle a body of incoming requests (for POST requests).
* `mongoose` - package to interact with MongoDB.
* `concurrently` - helps to run more than one npm script at the time

We also want `nodemon` to automatically reload our application when source is changes. An since we need it only for development, then we will install it with `-D` flag.
```
npm i -D nodemon
```
Now we are going to add a couple of scripts to run our app.
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "server": "nodemon server.js"
  },
```
* `start` - to run server in production.
* `server` - to run server with watching and automatic reloading.

## 1.2 Creating a Server
We will create a file called `server.js`.
Then we bring in what we need.
```js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initializing express into variable app
const app = express();

// Body-parser has a piece of middleware that we need to add
app.use(bodyParser.json());

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
```
Now we can start our server with `npm run server`.

## Creating a Database Model
Let's create a file `./models/Item.js`;
We will create a model of an item of a shopping list. It should contain a name and a data, initially we will be setting it to the data of creation.
```js
const mongoose = require('mongoose');

// getting class definition
const Schema = mongoose.Schema;

// creating new `Schema` class instance
const ItemSchema = new Schema({
  name: {
    type: string,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// export schema
module.exports = Item = mongoose.model('item', ItemSchema);
```
Now this model can be exported and used to save and load items from database.