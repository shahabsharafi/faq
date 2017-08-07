var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Discussion = require('./discussion');
    const Account = require('../account/account');
    const Attribute = require('../attribute/attribute');
    const Department = require('../department/department');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Discussion);
    var repDepartment = new Repository(Department);

    var mapper = function (obj, callback) {
        if (obj.department) {
            obj.department = obj.department._id;
        }
        var _accounts = {};
        var setAccountId = function (source, fieldName, callback) {
            if (source[fieldName]) {
                if (source[fieldName]._id) {
                    source[fieldName] = source[fieldName]._id;
                    if (callback) callback();
                } else if (source[fieldName].username) {
                    var username = source[fieldName].username;
                    if (_accounts[username]) {
                        source[fieldName] = _accounts[username];
                        if (callback) callback();
                    } else {
                        Account.findOne({
                            username: username
                        }, function (err, o) {
                            if (err) {
                                if (callback) callback(err);
                            } else {
                                _accounts[username] = o._id + '';
                                source[fieldName] = o._id + '';
                                if (callback) callback();
                            }
                        });
                    }
                } else {
                    if (callback) callback();
                }
            } else {
                if (callback) callback();
            }
        }
        var taskArray = [];
        taskArray.push(function (callback) {
            setAccountId(obj, 'from', callback);
        });
        taskArray.push(function (callback) {
            setAccountId(obj, 'to', callback);
        });
        taskArray.push(function (callback) {
            var _fn = function (err, o) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    obj.price = o.price;
                    if (callback) callback();
                }
            }
            if (!obj.price) {
                if (obj.department) {
                    Department.findOne({
                        _id: obj.department
                    }, _fn);
                } else if (obj.to) {
                    Account.findOne({
                        _id: obj.to
                    }, _fn);
                }
            } else {
                if (callback) callback();
            }
        });

        taskArray.push(function (callback) {
            if (obj.state == 0) {
                obj.payment = obj.price;
            } else if (obj.state == 1) {
                obj.payment = obj.price;
            } else if (obj.state == 2) {
                obj.payment = obj.price;
                obj.wage = obj.price;
            } else if (obj.state == 3) {
                switch (obj.cancelation) {
                    case 1:
                        obj.payment = 0;
                        break;
                    case 2:
                        obj.payment = 0;
                        break;
                    case 3:
                        obj.payment = 0.1 * obj.price;
                        break;
                    case 4:
                        obj.payment = 0.2 * obj.price;
                        break;
                    default:
                        obj.payment = 0;
                        break;
                }
                obj.wage = 0;
            }
            if (callback) callback();
        });

        for (var i = 0; i < obj.items.length; i++) {
            var item = obj.items[i];
            taskArray.push({
                params: {
                    source: item
                },
                fn: function (params, callback) {
                    setAccountId(params.source, 'owner', callback);
                }
            });
        }
        utility.taskRunner(taskArray, callback);
    }
    controller({
        router: router,
        model: Discussion,
        repository: repository,
        mapper: mapper
    });

    router.get('/getlist/:isuser/:username/:states', function (req, res) {
        (function (cb) {
            Account.findOne({
                username: req.params.username
            }, function (err, user) {
                if (err) {
                    cb(err);
                } else {
                    var states = req.params.states.split(',');
                    if (req.params.isuser.toLowerCase() === 'true') {
                        Discussion
                            .find({
                                state: {
                                    $in: states
                                },
                                from: user._id
                            })
                            .populate('from to department')
                            .populate('items.owner')
                            .exec(cb);
                    } else {
                        Discussion
                            .find({
                                state: {
                                    $in: states
                                },
                                to: user._id
                            })
                            .populate('from to department')
                            .populate('items.owner')
                            .exec(cb);
                    }
                }
            });
        })(function (err, list) {
            if (err) res.send(err);
            res.json(list);
        });
    });

    router.get('/recive', function (req, res) {
        Account.findOne({
            username: req.decoded._doc.username
        }, function (err, user) {
            Discussion
                .findOne({
                    'state': '0'
                }).sort({
                    createDate: -1
                })
                .populate('from to department')
                .populate('items.owner')
                .exec(function (err, obj) {
                    res.json(obj);
                });
        })
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
