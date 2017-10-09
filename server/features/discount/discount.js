// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    price: Number,
    count: Number,
    total: Number,
    used: Number,
    type: {
        type: String,
        ref: 'Attribute'
    },
    beginDate: Date,
    expireDate: Date
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Discount', schema);
