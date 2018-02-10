var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Account = require('../account/account');
    const Discussion = require('../discussion/discussion');
    const Discount = require('../discount/discount');
    const Charge = require('../charge/charge');
    const jalali = require('../../lib/jalali');

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

    router.get('/quick', function (req, res) {
        var attrs = { };

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
            var d1 = new Date();
            var d2 = new Date();
            d2.setDate(d1.getDate()-1);

            var j1 = jalali.gregorianToJalali(d1.getFullYear(), d1.getMonth() + 1, d1.getDate());
            var g1 = (j1[1] == 1)
                ? jalali.jalaliToGregorian(j1[0] - 1, 1 , j1[2])
                : jalali.jalaliToGregorian(j1[0] , j1[1] - 1 , j1[2]);
            var m1 = new Date(g1[0], g1[1], g1[2]);

            var j2 = jalali.gregorianToJalali(g1[0], g1[1], g1[2]);
            var g2 = (j2[1] == 1)
                ? jalali.jalaliToGregorian(j2[0] - 1, 1 , j2[2])
                : jalali.jalaliToGregorian(j2[0] , j2[1] - 1 , j2[2]);
            var m2 = new Date(g2[0], g2[1], g2[2]);

            attrs.d1 = d1;
            attrs.d2 = d2;
            attrs.m1 = m1;
            attrs.m2 = m2;

            callback();
        }

        var _part3 = function (callback) {
            Discussion.aggregate([
                { $match: {'to': attrs.user, 'createDate': attrs.d1 } },
                { $group : { _id : null, count: { $sum: 1 } } }
            ]).exec(function (err, obj) {
                if (err) {
                    callback(err);
                } else {
                    attrs.c_d1 = obj.length > 0 ? obj[0].count : 0;
                    callback();
                }
            });
        }

        var _part4 = function (callback) {
            Discussion.aggregate([
                { $match: {'to': attrs.user, 'createDate': attrs.d2 } },
                { $group : { _id : null, count: { $sum: 1 } } }
            ]).exec(function (err, obj) {
                if (err) {
                    callback(err);
                } else {
                    attrs.c_d2 = obj.length > 0 ? obj[0].count : 0;
                    callback();
                }
            });
        }

        var _part5 = function (callback) {
            Discussion.aggregate([
                { $match: {
                    to: attrs.user,
                    createDate: { $gte: attrs.m1, $lte: attrs.d1 }
                } },
                { $group : { _id : null, count: { $sum: 1 } } }
            ]).exec(function (err, obj) {
                if (err) {
                    callback(err);
                } else {
                    attrs.c_m1 = obj.length > 0 ? obj[0].count : 0;
                    callback();
                }
            });
        }

        var _part6 = function (callback) {
            Discussion.aggregate([
                { $match: {
                    to: attrs.user,
                    createDate: { $gte: attrs.m2, $lte: attrs.m1 }
                } },
                { $group : { _id : null, count: { $sum: 1 } } }
            ]).exec(function (err, obj) {
                if (err) {
                    callback(err);
                } else {
                    attrs.c_m2 = obj.length > 0 ? obj[0].count : 0;
                    callback();
                }
            });
        }

        utility.taskRunner([_part1, _part2, _part3, _part4, _part5, _part6], function (err) {
            if (err) {
                res.send_err(err);
            } else {
                console.log(attrs);
                res.send_ok([
                    { 'key': 'quick_d1', 'value': attrs.c_d1 },
                    { 'key': 'quick_d2', 'value': attrs.c_d2 },
                    { 'key': 'quick_m1', 'value': attrs.c_m1 },
                    { 'key': 'quick_m2', 'value': attrs.c_m2 }
                ]);
            }
        });
    })

    option.app.use('/api/report', router);
}

module.exports = {
    name: 'report',
    register: register
};
