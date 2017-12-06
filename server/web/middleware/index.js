'use strict'

var uploadMiddleware = require('./upload');
var tokenMiddleware = require('./token');
var vrificationMiddleware = require('./vrification');
var extentionMiddleware = require('./extention');
var onlineMiddleware = require('./online');

var register = function (option) {
    uploadMiddleware.register(option);
    tokenMiddleware.register(option);
    vrificationMiddleware.register(option);
    extentionMiddleware.register(option);
    onlineMiddleware.register(option);
}

module.exports = {
    register: register
}
