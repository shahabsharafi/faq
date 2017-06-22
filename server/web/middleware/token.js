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
var parseBearerToken = function (req) {
  var auth;
  if (!req.headers || !(auth = req.headers.authorization)) {
    return null;
  }
  var parts = auth.split(' ');
  if (2 > parts.length) return null;
  var schema = parts.shift().toLowerCase();
  var token = parts.join(' ');
  if ('bearer' != schema) return null;
  return token;
}

var register = function (option) {

    console.log('register authenticate middleware')

    router.use(function (req, res, next) {

        var ignoreUrls = [
            '/accounts/resetpassword',
            '/accounts/signup',
            '/accounts/sendcode',
            '/accounts/authenticate',
            '/discussions/test',
            '/accounts/setup',
            '/roles/setup',
            '/attributes/setup',
            '/departments/setup',
            '/access'
        ];

        for (var i = 0; i < ignoreUrls.length; i++) {
            var url = ignoreUrls[i];
            if (req.url.startsWith(url)) {
                next();
                return;
            }
        }

        var token = parseBearerToken(req);

        // check header or url parameters or post parameters for token
        if (!token) {
            token = req.body.token || req.params['token'] || req.headers['x-access-token'];
        }

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, option.app.get('superSecret'), function (err, decoded) {

                if (err) {
                    console.log('err token');
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    console.log('success token');
                    console.log(decoded._doc.username);
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
