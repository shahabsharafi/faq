const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    username: String,
    password: String,
    blocked: Boolean,
    disabled: Boolean,
    email: String,
    mobile: String,
    isOperator: Boolean,
    isUser: Boolean,
    isOrganization: Boolean,
    isManager: Boolean,
    sexPrevention: Boolean,
    price: Number,
    percentage: Number,
    isAdmin: Boolean,
    orgCode: String,
    comments: [{
        createDate: Date,
        text: String
    }],
    profile: {
        firstName: String,
        lastName: String,
        fatherName: String,
        birthDay: Date,
        no: String,
        placeOfIssues: String,
        nationalCode: String,
        birthPlace: String,
        sex: {
            type: String,
            ref: 'Attribute'
        },
        status: {
            type: String,
            ref: 'Attribute'
        },
        jobState: {
            type: String,
            ref: 'Attribute'
        },
        religion: {
            type: String,
            ref: 'Attribute'
        },
        sect: {
            type: String,
            ref: 'Attribute'
        },
        reference: {
            type: String,
            ref: 'Attribute'
        }
    },
    contact: {
        house: String,
        work: String,
        country: {
            type: String,
            ref: 'Attribute'
        },
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
