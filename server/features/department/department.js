// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    type: String,
    caption: String,
    parentId: String,
    description: String,
    language: String,
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Department', schema);
