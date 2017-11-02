'use strict'

var express = require('express');
const constants = require('../../_infrastructure/constants');
const Online = require('../../features/account/online');

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var router = express.Router();

var register = function (option) {

    router.use(function (req, res, next) {
        if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
            Online.findOne({ 'username': req.decoded._doc.username }, function (err, obj) {
                if (err) {
                    next();
                } else {
                    console.log('bbbbbbbbb');
                    console.log(obj);
                    if (!obj) {
                        console.log('aaaaaaaaaaaaa');
                        obj = new Online();
                        obj.username = req.decoded._doc.username;
                    }
                    obj.lastRequest = new Date();
                    obj.save(function (err) {
                        next();
                    });
                }
            });
        } else {
            next();
        }
    });

    option.app.use('/api', router);

}

module.exports = {
    register: register
}
