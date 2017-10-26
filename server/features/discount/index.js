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
            var _plus10Year = function(d) {
                if (d) {
                    d = new Date(d);
                } else {
                    d = new Date();
                }
                var year = d.getFullYear();
                var month = d.getMonth();
                var day = d.getDate();
                return new Date(year + 10, month, day)
            }
            if (obj.type) {
                if (obj.type.value != "limited") {
                    obj.expireDate = _plus10Year(obj.beginDate);
                }
                obj.type = obj.type._id;
                if (callback) callback();
            } else {
                Attribute.findOne({
                    type: 'discount_type',
                    value: 'enabled'
                }, function (err, type) {
                    if (err) {
                        if (callback) callback(err)
                    } else {
                        obj.type = type._id;
                        obj.expireDate = _plus10Year(obj.beginDate);
                        if (callback) callback();
                    }
                });
            }
        }

        var _part3 = function (callback) {
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

    router.get('/select/:department', function (req, res) {
        var attrs = {};

        var _part1 = function (callback) {
            Attribute.findOne({ type: 'discount_type', value: 'enabled' }, function (err, obj) {
                attrs.enabled = obj._id;
                if (callback) callback(err)
            });
        }

        var _part2 = function (callback) {
            Attribute.findOne({ type: 'discount_type', value: 'limited' }, function (err, obj) {
                attrs.limited = obj._id;
                if (callback) callback(err)
            });
        }

        var _part3 = function (callback) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, obj) {
                    if (err) {
                        if (callback) callback(err);
                    } else {
                        attrs.orgCode = obj.orgCode || '';
                        if (callback) callback();
                    }
                });
            } else {
                if (callback) callback(err);
            }
        }

        var _part4 = function (callback) {
            var department = req.params.department;
            d = ((new Date()).toJSON()).substr(0, 10) + 'T00:00:00.000Z';
            Discount.findOne({
                $and: [
                    { $or: [{ orgCode: null }, { orgCode: '' }, { orgCode: attrs.orgCode }] },
                    { $or: [{ category: null }, { category: department }] },
                    { $or: [{ type: attrs.enabled }, { type: attrs.limited, expireDate: {$gt: d} }] }
                ]
            })
            .populate(['type', 'owner', 'category'])
            .sort({ price: -1, expireDate: -1, beginDate: -1, isOrganization: -1 })
            .exec(function(err, data) {
                attrs.data = data;
                if (callback) callback(err);
            })
        }

        utility.taskRunner([_part1, _part2, _part3, _part4], function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(attrs.data);
            }
            return;
        });
    })

    option.app.use('/api/discounts', router);
}

module.exports = {
    name: 'discount',
    register: register
};
