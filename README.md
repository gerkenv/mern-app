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

# 4 Implementing Redux
We need to install some dependencies from the `client` folder.
```
yarn add redux react-redux redux-thunk
```
* redux - redux standalone library
* redux-react - binding named thing together
* redux-thunk - different way to dispatch from our action to our reducer (for asynchronous actions)

## 4.1 Store
A store holds the whole state tree of your application. The only way to change the state inside it is to dispatch an action on it.

Let's first create a store - `./.client/src/store.js`.
```js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'
// equivalent to
// import rootReducer from './reducers/index.js'

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // following line is required for `Redux Dev Tools`
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
```

In order to integrate this store in our application we have to go to `App.js` and bring in the `Provider`.
```js
import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar'
import ShoppingList from './components/ShoppingList'

import { Provider } from 'react-redux';
import store from './store'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <AppNavbar />
        <ShoppingList />
      </div>
      </Provider>
    );
  }
}

export default App;
```
In order to use redux in our components, in order to get stuff from the state and out it into component properties we have to wrap everything into `Provider`.
Now we are able to access stuff from our state, from our components, so we can share state.

## 4.2 Reducers
We will create a `root reducer`, we will create folder called `reducers`, and our `root reducer` will defined in file called `index.js`. `Root reducer` is basically only unites all reducers and binds them to specific store properties. Since currently we have only shopping items then we will define the `itemReducer`, but if we would have a users section, then we would need a `userReducer` and so on. Each reducer is responsible for one particular property of our store.

So let's create `./client/src/reducers/index.js`.
Why `index.js`? Why not `rootReducer.js`? Because then we can import it with
```js
import rootReducer from '/reducers';
// and it will be absolutely the same as
import rootReducer from '/reducers/index';
```
So coming back to our new `index.js`
```js
import { combineReducers } from 'redux';
import itemReducer from './itemReducer';

export default combineReducers({
  item: itemReducer
});
```
`combineReducers` is exactly the function that binds certain reducer to certain store property.

Now we will create the `./client/src/reducers/itemReducer`.
This reducer will be managing such actions as `ADD_ITEM`, `GET_ITEMS`, `REMOVE_ITEM`, etc.
Depending on the action it will be modifying our store.

Of course, if we take our backend in the chain, then the sequence is defined as follows:
1. Some component dispatches an action.
2. Reducer receives an action and send request to our backend API.
3. Reducer receives response from our backend server and modifies a store.
4. When the store gets updated it triggers re-rendering of our `Provider` component.
5. Smart components get the data from the store which is saved as `prop` of `Provider`.
6. Dumb components receives the data to display from smart components.

Our new `itemReducer`.
```js
import uuid from 'uuid';

const initialState = {
  items: [
    { id: uuid(), name: 'Bananas' },
    { id: uuid(), name: 'Lemon' },
    { id: uuid(), name: 'Pineapple' },
    { id: uuid(), name: 'Paprika' }
  ]
};
```

In our reducers we need to evaluate an actions type, so we need too create actions types.

## 4.3 Action Types
So for any action like `GET_ITEMS`, `ADD_ITEM`, `DELETE_ITEM` we have to define types.
Let's create their definition in `./client/src/actions/types.js`.
```js
export const GET_ITEMS = 'GET_ITEMS';
export const ADD_ITEMS = 'ADD_ITEM';
export const DELETE_ITEMS = 'DELETE_ITEM';
```
Sometime thes `types` also called `constants` because they are supposed to be immutable.

## 4.4 Binding Actions With Reducer
Now we can unclude our type definition in our `itemReducer` and define how the `store.item` should change on a certain actions.
```js
import uuid from 'uuid';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM } from '../actions/types';

const initialState = {
  items: [
    { id: uuid(), name: 'Bananas' },
    { id: uuid(), name: 'Lemon' },
    { id: uuid(), name: 'Pineapple' },
    { id: uuid(), name: 'Paprika' }
  ]
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_ITEMS:
      return {
        ...state
      };
    default:
      return state;
  }
}
```

## 4.5 Action Definition
Now we have to define action that can be used in our `ShoppingList` component. Remember that we have already defined actin types. We will use them.
```js
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM } from '../actions/types';

export const getItem = () => {
  // will be returned to our `itemReducer`
  return {
    type: GET_ITEMS,
    // `payload` is not required in this action
  }
}
```

## 4.6 Connecting Component with Redux
Now our initial state is set in our `itemReducer`, so we do not need to set in our `ShoppingList` component.
We will remove the part, where we set our initial state.
```diff
 export default class ShoppingList extends Component {
-  state = {
-    items: [
-      { id: uuid(), name: 'Bananas' },
-      { id: uuid(), name: 'Lemon' },
-      { id: uuid(), name: 'Pineapple' },
-      { id: uuid(), name: 'Paprika' },
-    ]
-  }

   render() {
```
So in order to get our state into component we have to import `connect` function
```js
import { connect } from 'react-redux';
import { getItems } from '../actions/itemActions';
```
And we have to export our component differently:
```diff
- export default ShoppingList;
+ export default connect(mapStateToProps, {getItems})(ShoppingList);
```
This will connect our state (store) and our actions with `ShoppingList` component.
* `mapStateToProps` - is taking a store and mapping a store property required by component into component `props`. This way we will able to refer it our component so `this.props.items`;
* { getItems, ...} - object containing actions required for this component will be also accesible as component `props`, like `this.props.getItems()`.

Let's define a function that will be slicing our store.
```js
const mapStateToProps = (state) => ({
  item: state.item
});
```
It returns an object that holds a reference to the property `items` of the `Provider` `store` (state). Remember that we have associated exactly the `items` property with `itemReducer` in our root reducer in `./client/src/reducers/index.js`. And `itemReducer` can handle `getItems` action.

Last thing we need to add redux `PropTypes` in our `ShoppingList` component.
```js
import PropTypes from 'prop-types';
```
And the underneath our class we add following lines
```js
ShoppingList.propTypes = {
  getItems: PropTypes.func.isRequired, // action
  item: PropTypes.object.isRequired    // state (part of the store)
}
```
Because we want to access our actions in component through `props`. And we want to set the type `func` to it because the whole point of `PropTypes` - simply showing the type of property.

The last thing that is left is to call `getItem`.
* then it will send / dispatch action `{ type: GET_ITEMS }` to the reducers (`itemAction.js`).
* what should basically return unchanged state `{...state}`.
* Then `mapStateToProps` will get the updated `state.items` and save it as component `props`.

So the right place to call `getItems` is a react component life cycle function `componentDidMount`.
```js
class ShoppingList extends Component {

  componentDidMount() {
    this.props.getItems();
  }
```
The `componentDidMount()` method runs after the component output has been rendered to the DOM.
This is a good place to set up an event listener or make an action that should happen only once.
__note__:
If you have set up an event listener you should unbind it in `componentWillUnmount()`. This method is called when a component is being removed from the DOM.

Now we have to replace the way we get our `items` in component.
```diff
   render() {
-    const { items } = this.state;
+    const { items } = this.props.item;
```
Because now the `item` slice of store it is mapped to `this.props.item` in function `mapStateToProps` and our reducer initially sets the array called `items` to `item` slice of store, so the full path is to shopping list items is `this.props.item.items`. And we are using ES6 destructing to get it.

So now our state lives in `redux` store and not in component's own state.

Some additional information:
* https://www.sohamkamani.com/blog/2017/03/31/react-redux-connect-explained/

