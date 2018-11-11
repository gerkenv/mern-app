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