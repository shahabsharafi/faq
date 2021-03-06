// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    owner: { type: String, ref: 'Account' },
    message: { type: String, ref: 'Message' },
    createDate: Date,
    issueDate: Date,
    expireDate: Date
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('QMessage', schema);
