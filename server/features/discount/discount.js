// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    owner: { type: String, ref: 'Account' },
    category: { type: String, ref: 'Department' },
    price: Number,
    count: Number,
    total: Number,
    used: Number,
    type: { type: String, ref: 'Attribute' },
    isOrganization: Boolean,
    orgCode: String,
    beginDate: Date,
    expireDate: Date
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Discount', schema);
