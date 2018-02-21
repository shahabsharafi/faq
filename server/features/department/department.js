// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    type: String,
    caption: String,
    parentId: String,
    description: String,
    language: String,
    selectable: Boolean,
    requireAttribute: Boolean,
    price: Number,
    percentage: Number,
    operatorRule: String,
    userRule: String,
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }]
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Department', schema);
