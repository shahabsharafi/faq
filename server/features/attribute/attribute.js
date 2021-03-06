// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    type: String,
    caption: String,
    value: String,
    order: Number,
    parentId: String
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Attribute', schema);
