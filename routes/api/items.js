const express = require('express');

// get `express` router
const router = express.Router();

// get `Item` model
const Item = require('../../models/Item');

// @route  GET api/items
// @desc   Get all items
// @access Public
router.get('/', (req, res) => {
  Item.find()           // get all items
    .sort({ date: -1})  // sort them by date in descending order
    .then(items => res.status(200).json(items)) // return `json` response
});

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

module.exports = router;