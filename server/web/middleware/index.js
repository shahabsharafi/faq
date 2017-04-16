'use strict'

var tokenMiddleware = require('./token')

var register = function (option) {
    tokenMiddleware.register(option);
}

module.exports = {
    register: register
}