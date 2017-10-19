var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Discount = require('./discount');
    const Attribute = require('../attribute/attribute');
    const Account = require('../account/account');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Discount);

    var mapper = function (obj, callback) {
        var attrs = {};

        var _part1 = function (callback) {
            if (obj.owner && obj.owner._id) {
                obj.owner = obj.owner._id;
                if (callback) callback();
            } else if (obj.owner && obj.owner.username) {
                Account.findOne({ username: obj.owner.username }, function (err, user) {
                    if (err) {
                        if (callback) callback(err)
                    } else {
                        obj.owner = user._id;
                        if (callback) callback();
                    }
                })
            } else {
                if (callback) callback();
            }
        }

        var _part2 = function (callback) {
            console.log(obj.type);
            if (obj.type) {
                if (obj.type.value != "limited") {
                    obj.expireDate = null;
                }
                obj.type = obj.type._id;
                console.log(obj.type);
                if (callback) callback();
            } else {
                Attribute.findOne({
                    type: 'discount_state',
                    value: 'enabled'
                }, function (err, type) {
                    if (err) {
                        if (callback) callback(err)
                    } else {
                        obj.type = type._id;
                        console.log(obj.type);
                        if (callback) callback();
                    }
                });
            }
        }

        var _part3 = function (callback) {
            console.log(obj);
            if (obj.category)
                obj.category = obj.category._id;
            obj.price = obj.price || 0;
            obj.count = obj.count || 0;
            obj.total = obj.price * obj.count;
            if (callback) callback();
        }

        utility.taskRunner([_part1, _part2, _part3], callback);
    }
    controller({ router: router, model: Discount, repository: repository, mapper: mapper });
    /*
    router.get('/select', function (req, res) {
        Discount.find({type: { $in: ['59e4ed2ae6fcb740d07801ee', '59e4ed2ae6fcb740d07801ec']}})
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(null);
        }
    }
    */
    option.app.use('/api/discounts', router);
}

module.exports = {
    name: 'discount',
    register: register
};
