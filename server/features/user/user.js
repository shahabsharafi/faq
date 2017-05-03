// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    username: String,
    password: String,
    email: String,
    sms: String,
    activation: {
        state: Boolean,
        code: String
    },
    profile: {
        firstName: String,
        lastName: String,
        fatherName: String,
        birthDay: Date,
        no: String,
        placeOfIssues: String,
        nationalCode: String,
        birthPlace: String,
        status: Number
    },
    contact: {
        mobile: String,
        house: String,
        work: String,
        email: String,
        contry: String,
        city: String,
        address: String,
        pcode: String
    },
    education: {
        grade: String,
        majors: String,
        universities: String,
        level: String
    },
    extra: {
        language: String,
        dialect: String
    }
}));
