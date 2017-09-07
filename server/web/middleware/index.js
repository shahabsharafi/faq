'use strict'

var tokenMiddleware = require('./token')
var uploadMiddleware = require('./upload')

var register = function (option) {
    uploadMiddleware.register(option);
    tokenMiddleware.register(option);
}

module.exports = {
    register: register
}
