'use strict'

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require('express');

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var router = express.Router();

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
var register = function (option) {

    console.log('register authenticate middleware')

    router.use(function (req, res, next) {

        if (req.url == '/user/authenticate') {
            next();
            return;
        }

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.params['token'] || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, option.app.get('superSecret'), function (err, decoded) {

                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }

    });

    option.app.use('/api', router);

}

module.exports = {
    register: register
}
