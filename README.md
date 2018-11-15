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

## 1.3 Creating a Database Model
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

## 1.4 Creating Routes
### 1.4.1 Creating Router Middleware
We will create a file `./routes/api/items.js` to hold our API routes that will be returning `json` responses. All our API has to be thematically separated from each other and stored in different files. If in some case our server should render something and return back the pages then it has to be located in other folder, like `routes/pages/index.js`.

Before we will create any API we have to configure our server so that if URI `host/api/item/*` is requested then our `/routes/api/items.js` file has to handle this request. Also we will set the namespace for our `items.js` file. \
Add following lines to `server.js`.
```js
// import `items` route handlers
const items = require('./routes/api/items');

// Initializing express into variable app
const app = express();

// Body-parser has a piece of middleware that we need to add
app.use(bodyParser.json());

// define namespace for `items` routes
app.use('/api/items', items);

// ...
```
__Note:__
Be aware that you have to apply the `items` router middleware after the `body-parser`, otherwise `items` router will be executed before `body-parser`, this way 'parsed body' property `body` will be unavailable in request `req`.

### 1.4.2 Get All Items
Let's create our first route to get all items from database. Copy this into `./routes/api/items.js`.
```js
const express = require('express');

// get `express` router
const router = express.Router();

// get `Item` model
const Item = require('../../models/Item');

// @route  GET api/items
// @desc   Get all items
// @access Public
router.get('/', (req, res) => {
  Item.find()                       // get all items
    .sort({ date: -1})              // sort them by date in descending order
    .then(items => res.json(items)) // return `json` response
});

module.exports = router;
```
Now we can test our route with [Postman](https://www.getpostman.com/).
Send a `GET` request to `http://localhost:5000/api/items` and you should receive an empty array as response.

### 1.4.3 Create a New Item
```js
// @route  POST api/items
// @desc   Create a new item
// @access Public
router.post('/', (req, res) => {
  // create a new item
  const newItem = new Item({
    name : req.body.name,
  });
  // store an item into database
  newItem.save()
    .then(item => res.json(201, item))
    .catch(err => res.status(500).json(err));
});
```
Send a `POST` request to `http://localhost:5000/api/items` and you should receive a new brand item back.

### 1.4.4 Delete an Item
```js
// @route  DELETE api/items/:id
// @desc   Deletes an item
// @access Public
router.delete('/:id', (req, res) => {
  // get an item
  Item.findOneAndDelete({"_id": req.params.id})
    .then((item) => {
      if (!item) {
        return res.status(404).send(item);
      } else {
        return res.status(200).send(item);
      }
    }).catch(err => res.status(500).json(err));
});
```
Send a `DELETE` request to `http://localhost:5000/api/items/<some id>` and you should receive an item that was deleted.

# 2 Client Side
## 2.1 Creating Frontend Template App
Create a folder `./client`. Open it in the console, install `react` generator package called `create-react-app`.
```
npm i -D create-react-app
```
Then we will call our locally installed generator so
```
npx create-react-app .
```
to create an application template in current folder.
This will create a separated `package.json` for our client application.

## 2.2 Setting Up Proxy for Frontend
We need to define a `proxy` in it to refer to our server much easier. If we would like to access our server from client then we have to type something like
```js
axios.get('http://localhost:5000/api/items);
```
It's fine but we can avoid this form by setting a proxz in `package.json`:
```json
"proxy": "http>//localhost:5000"
```
Then we can get the same request with
```js
axios.get('api/items);
```

## 2.3 Setting Up `Concurrently`
We want to run backend and frontend apps together, this way we can start them from 2 command line tools, but we also can install `concurrently` and run them both simultaneously.
we will create `client` script in our `package.json`.
```js
"client": "npm start --prefix client"
```
It first goes to `./client` because of `--prefix`. Also we could set it so:
```json
"client": "cd client && npm start"
```
- it it the same thing at the end.

Let's set up our script for `concurrently`.
```js
"dev": "concurrently \"npm run server\" \"npm run client\""
```
So now we can run backend or frontend app separately or together.
You can try out to run both apps with `npm run dev`.

Also you could set up small script to install all of your client dependencies.
```js
"client-install"
```

## 2.4 Setting Up Bootstrap / Reactstrap
## 2.4.1 Additional Dependencies For Client
```
cd client
yarn add bootstrap reactstrap uuid
```
* bootstrap - UI library
* reactstrap - allows us to use bootstrap components as react components
* uuid - generate random ids (we will build app with static data first)
* react-transition-group -

### 2.4.2 Injecting Bootstrap
In `app.js` we will add line
```js
import 'bootstrap/dist/css/bootstrap.min.css'
```
Now if we reload the client page, then you will see that font has changed, it means that bootstrap is active now.

### 2.4.3 Building Navbar with Reactstrap
Create `./client/src/component/Navbar.js`.

Go to https://reactstrap.github.io/components/. Check out react syntax.
Import all required components for a navbar:
```js
import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from 'reactstrap';
```

#### 2.4.3.1 `this` and Arrow Function In React
If you define a function `toggle` in your component, then you have to bind it to your component in the constructor like this
```js
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bing(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
}
```
to avoid the replacement of context (`this`) when you're adding an event listener.
```html
<NavbarToggler onClick={this.toggle} />
```
Full example is [here](https://reactstrap.github.io/components/navbar/).

There is a way to make it simpler, arrow function binds itself to the context of parent scope.
So code below is equivalent to code above.
```js
export default class Navbar extends Component {
constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
}
```
Okay, now we create a `render` method to render a navbar using all our components;
```js
  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
          <Container>
            <NavbarBrand href="/">Shopping List</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="https://reactstrap.github.io/components/navbar/">Reactstrap/Navbar</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
```

# 3 Creating a `ShoppingList` Component
Make a file `./client/src/components/ShoppingList.js`.
```js
import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';

export default class ShoppingList extends Component {
  state = {
    items: [
      { id: uuid(), name: 'Bananas' },
      { id: uuid(), name: 'Lemon' },
      { id: uuid(), name: 'Pineapple' },
      { id: uuid(), name: 'Paprika' },
    ]
  }

  render() {
    const { items } = this.state;

    return (
      <Container>
        <Button
        color="dark"
        style={{marginBottom: "2rem"}}
        onClick={() => {
          const name = prompt('Enter Item');
          if (name) {
            this.setState(state => ({
              items: [...state.items, {id: uuid(), name}]
            }));
          }
        }}
        >
          Add Item
        </Button>
      </Container>
    );
  }
}
```
Now we will add this component to our `App.js`.
```js
import ShoppingList from './components/ShoppingList'

class App extends Component {
  render() {
    return (
      <div className="App">
      <AppNavbar />
      <ShoppingList />
      <h1>Hello</h1>
      </div>
    );
  }
}
```
Now if you have `React Developer Tools` you can add items in browser and see updated state.

## 3.1 CCS Transition
Now we will create our list with items in `ShoppingList` component.
```js
render() {
    const { items } = this.state;

    return (
      <Container>
        <Button
        color="dark"
        style={{marginBottom: "2rem"}}
        onClick={() => {
          const name = prompt('Enter Item');
          if (name) {
            this.setState(state => ({
              items: [...state.items, {id: uuid(), name}]
            }));
          }
        }}
        >
          Add Item
        </Button>
        <ListGroup>
          <TransitionGroup className="shopping-list">
            {items.map(({id, name}) => (
              <CSSTransition key={id} timeout={10000} classNames="fade">
                <ListGroupItem>
                  <Button
                  className="remove-btn"
                  color="danger"
                  size="sm"
                  onClick={() => {
                    this.setState(state => ({
                      items: state.items.filter(item => item.id != id)
                    }))
                  }}
                  >
                    &times;
                  </Button>
                  {name}
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>

      </Container>
    );
  }
```
`CSSTransition` component modifying class attributes of an element in following way:
* When element appears (it is created).
  *  At the beginning (time == 0) it receives class `fade-enter`
  *  In process further (time ~ [1, timeout - 1]) it receives classes `fade-enter fade-enter-active`
     Here `fade-enter-active` overrides `fade-enter`.
  *  At the end of creation (time == timeout) it receives class `fade-enter-done`
* When element is deleted
  * Time = 0 --> `fade-exit`
  * Time ~ [1, timeout -1] --> `fade-exit fade-exit-active`
    Here `fade-exit-active` overrides `fade-exit`.
  * Time = timeout --> `fade-exit-done`

So we have to define those classes in any `.css` file and connect them to our app.
We will create `ShoppingList.css` in our `components` folder.
```css
.remove-btn {
    margin-right: 0.5rem;
}

.fade-enter {
    opacity: 0.01;
}

.fade-enter-active {
    opacity: 1;
    transition: opacity 10000ms ease-in;
}

.fade-exit {
    opacity: 1;
}

.fade-exit-active {
    opacity: 0.01;
    transition: opacity 10000ms ease-in;
}
```
Additional links:
* http://reactcommunity.org/react-transition-group/css-transition/
* https://www.w3schools.com/css/css3_transitions.asp

So now we should import our new `.css` file into our component and elements on the page should fade in and out.
```js
import './ShoppingList.css';
```