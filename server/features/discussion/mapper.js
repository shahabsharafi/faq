const utility = require('../_infrastructure/utility');
const Department = require('../department/department');
const Account = require('../account/account');
const Discount = require('../discount/discount');

module.exports = function (obj, callback) {
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
        if (obj.state == 0) {//created
            if (obj.department) {
                Department.findOne({ _id: obj.department }, _fn);
            } else if (obj.to) {
                Account.findOne({ _id: obj.to }, _fn);
            }
        } else {
            if (callback) callback();
        }
    });

    taskArray.push(function (callback) {
        if (obj.state == 0) {//created
            obj.payment = obj.price;
        //} else if (obj.state == 1) {//recived
        } else if (obj.state == 2) {//finished
            obj.wage = obj.price;
        } else if (obj.state == 3) {//report
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

    taskArray.push(function (callback) {
        if (obj.state == 0 && obj.usedDiscount && obj.usedDiscount._id) {
            Discount.findOne({ _id: obj.usedDiscount._id }, function(err, discount) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var discount_remain = (discount.price * discount.count - discount.used);
                    if (discount_remain > 0) {
                        var discount_price = discount_remain > discount.price ? discount.price : discount_remain;
                        var used = (discount_price > obj.price) ? obj.price : discount.price;
                        discount.used = discount.used + used;
                        Discount.save(function(err, discount) {
                            if (err) {
                                if (callback) callback(err);
                            } else {
                                Discount.save(function (err) {
                                    if (err) {
                                        if (callback) callback(err);
                                    } else {
                                        obj.payment = obj.payment - used;
                                        if (callback) callback();
                                    }
                                });
                            }
                        });
                    } else {
                        if (callback) callback();
                    }
                }
            });
        } else {
            if (callback) callback();
        }
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
