'use strict'

var express = require('express');
const constants = require('../../_infrastructure/constants');

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var router = express.Router();

var register = function (option) {

    router.use(function (req, res, next) {
        res.send_err = function (message) {
            this.status(500).send({ success: false, message: message || constants.message_unknown_error });
        };
        res.send_ok = function (obj) {
            if (obj)
                this.status(200).json(obj);
            else
                this.status(200).send({ success: true });
        };
        next();
    });

    option.app.use('/api', router);

}

module.exports = {
    register: register
}
