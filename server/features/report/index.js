var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Account = require('../account/account');
    const Discussion = require('../discussion/discussion');
    const Discount = require('../discount/discount');
    const Charge = require('../charge/charge');

    var router = option.express.Router();

    router.get('/balance', function (req, res) {
        var attrs = { list: [] };

        var _part1 = function (callback) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, obj) {
                    if (err) {
                        if (callback) callback(err);
                    } else {
                        attrs.user = obj._id;
                        if (callback) callback();
                    }
                });
            } else {
                if (callback) callback({ success: false });
            }
        }

        var _part2 = function (callback) {
            Discussion.find({ to: attrs.user._id }, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = attrs.list;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        l.push({
                            sourceId: item._id,
                            source: 'discussion_wage',
                            date: item.createDate,
                            debit: 0,
                            credit: item.wage,
                            type: 'credit',
                        });
                    }
                    attrs.list = l;
                    if (callback) callback();
                }
            });
        }

        var _part3 = function (callback) {
            Discussion.find({ from: attrs.user._id }, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = attrs.list;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        l.push({
                            sourceId: item._id,
                            source: 'discussion_peyment',
                            date: item.createDate,
                            price: item.price,
                            discount: item.discount,
                            total: item.peyment,
                            debit: item.peyment,
                            type: 'debit',
                            credit: 0
                        });
                    }
                    attrs.list = l;
                    if (callback) callback();
                }
            });
        }

        var _part4 = function (callback) {
            Discount.find({ owner: attrs.user._id }, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = attrs.list;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        l.push({
                            sourceId: item._id,
                            source: 'discount_buy',
                            date: item.createDate,
                            price: item.price,
                            count: item.count,
                            total: item.total,
                            debit: item.total,
                            type: 'debit',
                            credit: 0
                        });
                    }
                    attrs.list = l;
                    if (callback) callback();
                }
            });
        }

        var _part5 = function (callback) {
            Charge.find({ account: attrs.user._id }, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = attrs.list;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        l.push({
                            sourceId: item._id,
                            source: 'charge',
                            date: item.createDate,
                            debit: 0,
                            credit: item.amount,
                            type: 'credit',
                            description: item.description
                        });
                    }
                    attrs.list = l;
                    if (callback) callback();
                }
            });
        }

        utility.taskRunner([_part1, _part2, _part3, _part4, _part5], function (err) {
            if (err) {
                res.send_err(err);
            } else {
                res.send_ok(attrs.list);
            }
        });
    });


    option.app.use('/api/report', router);
}

module.exports = {
    name: 'report',
    register: register
};
