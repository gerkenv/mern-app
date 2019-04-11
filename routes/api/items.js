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
    // return `json` response
    .then(items => res.status(200).json(items))
    // send an error
    .catch(err => res.status(500).json(err));
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
    // return `json` response
    .then(item => res.status(201).json(item))
    // send an error
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
        // send an error
        return res.status(404).send(item);
      } else {
        // return `json` response
        return res.status(200).send(item);
      }
    // send an error
    }).catch(err => res.status(500).json(err));
});

module.exports = router;