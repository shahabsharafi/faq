// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    owner: String,
    category: String,
    price: Number,
    count: Number,
    cover: Number,
    state: Number,
    beginDate: Date,
    expireDate: Date
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Discount', schema);
