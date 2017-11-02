'use strict'

var tokenMiddleware = require('./token');
var uploadMiddleware = require('./upload');
var extentionMiddleware = require('./extention');
var onlineMiddleware = require('./online');

var register = function (option) {
    uploadMiddleware.register(option);
    tokenMiddleware.register(option);
    extentionMiddleware.register(option);
    onlineMiddleware.register(option);
}

module.exports = {
    register: register
}
