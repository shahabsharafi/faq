const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    mobile: String,
    isOperator: Boolean,
    isUser: Boolean,
    isManager: Boolean,
    price: Number,
    isAdmin: Boolean,
    profile: {
        firstName: String,
        lastName: String,
        fatherName: String,
        birthDay: Date,
        no: String,
        placeOfIssues: String,
        nationalCode: String,
        birthPlace: String,
        sex: Number,
        status: Number
    },
    contact: {
        house: String,
        work: String,
        province: {
            type: String,
            ref: 'Attribute'
        },
        city: {
            type: String,
            ref: 'Attribute'
        },
        address: String,
        pcode: String
    },
    education: {
        grade: {
            type: String,
            ref: 'Attribute'
        },
        major: {
            type: String,
            ref: 'Attribute'
        },
        university: {
            type: String,
            ref: 'Attribute'
        },
        level: {
            type: String,
            ref: 'Attribute'
        }
    },
    extra: {
        language: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }],
        dialect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }]
    }
});

schema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Account', schema);
