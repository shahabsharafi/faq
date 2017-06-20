var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Discussion = require('./discussion');
    const Account = require('../account/account');
    const Attribute = require('../attribute/attribute');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Discussion);

    controller(router, Discussion, repository, function (obj, callback) {
        if (obj.department) {
            obj.department = obj.department._id;
        }
        var _accounts = {};
        var setAccountId = function (source, fieldName, callback) {
            if (obj[fieldName]) {
                if (obj[fieldName]._id) {
                    obj[fieldName] = obj[fieldName]._id;
                } else if (obj[fieldName].username) {
                    var username = obj[fieldName].username;
                    if (_accounts[username]) {
                        obj[fieldName] = _accounts[username];
                    } else {
                        Account.findOne({
                            username: username
                        }, function (err, o) {
                            if (err) {
                                callback(err)
                            } else {
                                _accounts[username] = o._id;
                                obj[fieldName] = o._id;
                                callback();
                            }
                        });
                    }
                }
            } else {
                callback();
            }
        }
        var taskArray = [];
        taskArray.push(function (callback) {
            setAccountId(obj, 'from', callback);
        });
        taskArray.push(function (callback) {
            setAccountId(obj, 'to', callback);
        });
        console.log(taskArray);
        for (var i = 0; i < obj.items; i++) {
            console.log(taskArray);
            var item = obj.items[i];
            taskArray.push({
                params: { source: item },
                fn: function (params, callback) {
                    setAccountId(params.source, 'owner', callback)
                }
            });
        }
        utility.taskRunner(taskArray, function (err) {
            if (err) res.send(err);
            if (callback) callback();
        });
    });

    router.get('/test', function (req, res, next) {

        var attrs = {};

        var _part1 = function (callback) {
            Account.findOne({
                username: 'admin'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.account = obj;
                    callback()
                }
            });
        }

        var _part2 = function (callback) {
            Attribute.findOne({
                caption: 'آلمانی'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.department = obj;
                    callback()
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
