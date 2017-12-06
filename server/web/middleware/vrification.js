'use strict'

var express = require('express');
const Account = require('../../features/account/account');

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var router = express.Router();

var register = function (option) {

    var getAccess = function (model) {
        var arr = [];
        if (model.isUser)
            arr.push("access_user");
        if (model.isOperator)
            arr.push("access_operator");
        if (model.isManager)
            arr.push("access_manager");
        return arr;
    }

    router.use(function (req, res, next) {
        if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
            if (req.decoded._doc.blocked) {
                console.log('5');
                return res.json({
                    success: false,
                    message: 'User blocked.'
                });
            } else {
                console.log('6');
                req.access = getAccess(req.decoded._doc);
                next();
            }
        } else{
            next();
        }
    });

    option.app.use('/api', router);

}

module.exports = {
    register: register
}
