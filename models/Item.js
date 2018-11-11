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