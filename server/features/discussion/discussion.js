// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    title: String,
    display: String,
    from: {
        type: String,
        ref: 'Account'
    },
    to: {
        type: String,
        ref: 'Account'
    },
    state: Number,//0: created, 1: recived, 2:finished, 3: report
    operatorRead: Boolean,
    userRead: Boolean,
    department: {
        type: String,
        ref: 'Department'
    },
    createDate: Date,
    answerDate: Date,
    expDate: Date,
    items: [{
        owner: {
            type: String,
            ref: 'Account'
        },
        createDate: Date,
        text: String
    }],
    tags: [String]
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Discussion', schema);
