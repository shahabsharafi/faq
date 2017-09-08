'use strict'

var tokenMiddleware = require('./token');
var uploadMiddleware = require('./upload');
var extentionMiddleware = require('./extention');

var register = function (option) {
    uploadMiddleware.register(option);
    tokenMiddleware.register(option);
    extentionMiddleware.register(option);
}

module.exports = {
    register: register
}
