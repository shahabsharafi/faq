'use strict'

var express = require('express');

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var router = express.Router();

var register = function (option) {

    const multer = require('multer');
    const Guid = require('guid');
    const config = require('../../config');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, config.uploadPath)
        },
        filename: function (req, file, cb) {
            var guid = Guid.create();
            var ext = file.originalname.split('.').pop();
            cb(null, guid.value + '.' + ext)
        }
    })

    const upload = multer({ dest: config.uploadPath, storage: storage });

    option.app.use('/api', upload.any());

}

module.exports = {
    register: register
}
