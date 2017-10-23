// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    name: String,
    type: Number,
    questions: [{
        no: Number,
        title: String,
        condition: { no: Number, value: String },
        answers: [{ text: String, value: String }]
    }],
    results: [{
        account: { type: String, ref: 'Account' },
        no: Number,
        answer: String
    }]
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Poll', schema);
