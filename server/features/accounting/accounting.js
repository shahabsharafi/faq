// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    createDate: Date,
    debit: Number,
    credit: Number,
    description: String,
    account: {
        type: String,
        ref: 'Account'
    }
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Accounting', schema);
