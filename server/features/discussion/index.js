var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Discussion = require('./discussion');
    const Mapper = require('./mapper');
    const Account = require('../account/account');
    const Attribute = require('../attribute/attribute');
    const Department = require('../department/department');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Discussion);
    var repDepartment = new Repository(Department);

    controller({ router: router, model: Discussion, repository: repository, mapper: Mapper });

    router.get('/getlist/:asuser', function (req, res) {
        (function (cb) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne({ username: req.decoded._doc.username }, function (err, user) {
                    if (err) {
                        cb(err);
                    } else {
                        var asUser = req.params.asuser;
                        var states = [ 0, 1, 2, 3 ];
                        if (asUser === true) {
                            Discussion
                                .find({ state: { $in: states }, from: user._id })
                                .populate('from to department')
                                .populate('items.owner')
                                .exec(cb);
                        } else {
                            Discussion
                                .find({ state: { $in: states }, to: user._id })
                                .populate('from to department')
                                .populate('items.owner')
                                .exec(cb);
                        }
                    }
                });
            } else {
                cb(err);
            }
        })(function (err, list) {
            if (err) {
                res.send_err(err);
            } else {
                res.send_ok(list);
            }
        });
    });

    router.get('/getcount/:asuser', function (req, res) {
        (function (cb) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne({ username: req.decoded._doc.username }, function (err, user) {
                    if (err) {
                        cb(err);
                    } else {
                        var asUser = req.params.asuser;
                        var states = [ 0, 1, 2, 3 ];
                        if (asUser === true) {
                            Discussion
                                .count({ state: { $in: states }, from: user._id, userRead: false })
                                .populate('from to department')
                                .populate('items.owner')
                                .exec(cb);
                        } else {
                            Discussion
                                .count({ state: { $in: states }, to: user._id, operatorRead: false })
                                .populate('from to department')
                                .populate('items.owner')
                                .exec(cb);
                        }
                    }
                });
            } else {
                cb(err);
            }
        })(function (err, count) {
            if (err) {
                res.send_err(err);
            } else {
                res.send_ok(count);
            }
        });
    });

    router.get('/recive', function (req, res) {
        if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
            Account.findOne({ username: req.decoded._doc.username }, function (err, user) {
                Discussion
                    .findOne({ 'state': '0' }).sort({createDate: -1})
                    .populate('from to department')
                    .populate('items.owner')
                    .exec(function(err, obj) {
                        res.json(obj);
                    });
            })
        } else {
            res.send_err();
        }
    });

    router.get('/test', function (req, res, next) {

        var attrs = {};

        var _part1 = function (callback) {
            Account.findOne({
                username: 'admin'
            }, function (err, obj) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    attrs.account = obj;
                    if (callback) callback();
                }
            });
        }

        var _part2 = function (callback) {
            Attribute.findOne({
                caption: 'آلمانی'
            }, function (err, obj) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    attrs.department = obj;
                    if (callback) callback();
                }
            });
        }

        var _part3 = function (callback) {
            var obj = new Discussion({
                title: 'بحث یک',
                from: attrs.account._id,
                to: attrs.account._id,
                //state: '',
                department: attrs.department._id,
                createDate: new Date(),
                expDate: new Date(),
                items: [{
                    owner: attrs.account._id,
                    createDate: new Date(),
                    text: 'متن یک بحث یک'
                }, {
                    owner: attrs.account._id,
                    createDate: new Date(),
                    text: 'متن دو بحث یک'
                }]
            });
            repository.Setup(obj, callback);
        }

        utility.taskRunner([_part1, _part2, _part3], function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    option.app.use('/api/discussions', router);
}

module.exports = {
    name: 'discussion',
    register: register
};
