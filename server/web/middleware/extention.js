'use strict'

var express = require('express');
const constants = require('../../_infrastructure/constants');

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var router = express.Router();

var register = function (option) {

    router.use(function (req, res, next) {
        res.send_err = function (e, er) {
            var code = 500;
            var err = { success: false, message: constants.message_unknown_error };
            if (typeof e === 'number') {
                code = e;
                if (typeof er === 'string') {
                    err.message = er;
                } else if (typeof er === 'object') {
                    err = er;
                }
            } else if (typeof e === 'string') {
                err.message = e;
            } else if (typeof e === 'object') {
                err = e;
            }
            this.status(code).send(err);
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
