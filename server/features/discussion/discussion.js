// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    title: String,
    from: {
        type: String,
        ref: 'Account'
    },
    to: {
        type: String,
        ref: 'Account'
    },
    state: Number,
    department: {
        type: String,
        ref: 'Department'
    },
    createDate: Date,
    expDate: Date,
    items: [{
        owner: {
            type: String,
            ref: 'Account'
        },
        createDate: Date,
        text: String
    }]
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Discussion', schema);
