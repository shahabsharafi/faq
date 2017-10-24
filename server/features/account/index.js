var register = function (option) {

    const jwt = require('jsonwebtoken');
    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Account = require('./account');
    const Discussion = require('../discussion/discussion');
    const Discount = require('../discount/discount');
    const Charge = require('../charge/charge');
    const Attribute = require('../attribute/attribute');
    const request = require("request");
    const constants = require('../../_infrastructure/constants');

    var router = option.express.Router();
    var repository = new Repository(Account);

    var mapper = function (obj, callback) {
        var _map = function (obj, propName) {
            if (obj[propName]) {
                if (obj[propName]._id) {
                    obj[propName] = obj[propName]._id
                } else {
                    delete obj[propName];
                }
            }
        }
        if (obj.profile) {
            _map(obj.profile, 'sex');
            _map(obj.profile, 'status');
            _map(obj.profile, 'jobState');
            _map(obj.profile, 'religion');
            _map(obj.profile, 'sect');
            _map(obj.profile, 'reference');
        }
        if (obj.contact) {
            _map(obj.contact, 'province');
            _map(obj.contact, 'city');
        }
        if (obj.education) {
            _map(obj.education, 'grade');
            _map(obj.education, 'major');
            _map(obj.education, 'university');
            _map(obj.education, 'level');
        }
        if (callback) callback();
    }
    controller({ router: router, model: Account, repository: repository, mapper: mapper });

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

    router.get('/setup', function (req, res) {

        var attrs = {};

        var _part0 = function (callback) {
            Attribute.findOne({
                caption: 'ایران',
                type: 'country'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.country = obj;
                    callback()
                }
            });
        }

        var _part1 = function (callback) {
            Attribute.findOne({
                caption: 'تهران',
                type: 'province'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.province = obj;
                    callback()
                }
            });
        }

        var _part2 = function (callback) {
            Attribute.findOne({
                caption: 'تهران',
                type: 'city'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.city = obj;
                    callback()
                }
            });
        }

        var _part3 = function (callback) {
            Attribute.findOne({
                caption: 'لیسانس',
                type: 'grade'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.grade = obj;
                    callback()
                }
            });
        }

        var _part4 = function (callback) {
            Attribute.findOne({
                caption: 'مهندسی کامپیوتر',
                type: 'major'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.major = obj;
                    callback()
                }
            });
        }

        var _part5 = function (callback) {
            Attribute.findOne({
                caption: 'تهران',
                type: 'university'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.university = obj;
                    callback()
                }
            });
        }

        var _part6 = function (callback) {
            Attribute.findOne({
                caption: 'سطح یک',
                type: 'level'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.level = obj;
                    callback()
                }
            });
        }

        var _part7 = function (callback) {
            Attribute.findOne({
                caption: 'فارسی',
                type: 'language'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.language = obj;
                    callback()
                }
            });
        }

        var _part8 = function (callback) {
            Attribute.findOne({
                caption: 'لری',
                type: 'dialect'
            }, function (err, obj) {
                if (err) {
                    callback(err)
                } else {
                    attrs.dialect = obj;
                    callback()
                }
            });
        }


        var _part9 = function (callback) {
            var obj = new Account({
                username: 'admin',
                password: '123456',
                email: 'shahab.sharafi@gmail.com',
                sms: '09124301687',
                isUser: true,
                isOperator: true,
                isOrganization: true,
                isManager: true,
                isAdmin: true,
                profile: {
                    firstName: 'شهاب',
                    lastName: 'شرفی',
                    fatherName: 'Azim',
                    birthDay: '1980.4.18',
                    no: '16',
                    placeOfIssues: 'Sary',
                    nationalCode: '1234567890',
                    birthPlace: 'Sary'
                },
                contact: {
                    mobile: '09124301687',
                    house: '01244876598',
                    work: '02188765432',
                    email: 'shahab.sharafi@gmail.com',
                    country: attrs.country._id,
                    province: attrs.province._id,
                    city: attrs.city._id,
                    address: 'ستاری - پیامبر',
                    pcode: '874367466'
                },
                education: {
                    type: 1,
                    grade: attrs.grade._id,
                    major: attrs.major._id,
                    university: attrs.university._id,
                    level: attrs.level._id
                },
                extra: {
                    language: [attrs.language],
                    dialect: [attrs.dialect],
                }
            });
            repository.Setup(obj, callback);
        }

        utility.taskRunner([_part0, _part1, _part2, _part3, _part4, _part5, _part6, _part7, _part8, _part9], function (err) {
            if (err) {
                res.send_err(err);
            } else {
                res.send_ok();
            }
        });
    });

    router.get('/sendcode/:mobile', function (req, res) {
        var mobile = req.params.mobile;
        utility.createCode(mobile, function (obj) {
            var code = obj.code;
            repository.FindObject({
                "mobile": mobile
            }, function (err, obj) {
                if (err) {
                    res.send_err(err);
                } else {
                    request({
                        uri: "http://tsms.ir/url/tsmshttp.php",
                        method: "POST",
                        form: {
                            from: "30001403",
                            to: mobile,
                            username: "rahi_porsane",
                            password: "a1s2d3f4",
                            message: code
                        }
                    }, function (err, response, body) {
                        if (err) {
                            res.send_err(err);
                        } else {
                            res.send_ok({
                                code: code,
                                username: (obj ? obj.username : '')
                            });
                        }
                    });
                }
            });
        }, function () {
            res.send_err();
        });
    });

    router.post('/signup', function (req, res) {
        var mobile = req.body.mobile;
        var code = req.body.code;
        utility.checkCode(mobile, code, function (obj) {
            var model = {
                username: req.body.username,
                password: req.body.password,
                mobile: req.body.mobile,
                isUser: true
            }
            var obj = new Account(model);
            repository.Save(obj, function (err) {
                if (err) {
                    res.send_err(err);
                } else {
                    Account.findOne({
                        mobile: req.body.mobile
                    }, function (err, account) {
                         if (err) {
                            res.send_err(err);
                        } else {
                            var token = jwt.sign(account, option.app.get('superSecret'), {});

                            // return the information including token as JSON
                            res.send_ok({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token,
                                username: account.username,
                                firstName: '',
                                lastName: '',
                                access: getAccess(account)
                            });
                        }
                    });
                }
            });
        }, function () {
            res.send_err();
        });
    });

    router.post('/resetpassword', function (req, res) {
        var mobile = req.body.mobile;
        var code = req.body.code;
        utility.checkCode(mobile, code, function (obj) {
            Account.findOne({
                mobile: req.body.mobile
            }, function (err, account) {
                if (err) {
                    res.send_err(err);
                } else {
                    if (account) {
                        account.password = req.body.password;
                        account.save(function () {
                            var token = jwt.sign(account, option.app.get('superSecret'), {});

                            // return the information including token as JSON
                            res.send_ok({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token,
                                username: account.username,
                                firstName: account.profile.firstName,
                                lastName: account.profile.lastName,
                                access: getAccess(account)
                            });
                        });
                    } else {
                        res.send_err();
                    }
                }
            });
        }, function () {
            res.send_err();
        });
    });

    router.get('/me', function (req, res) {

        var attrs = {};

        var _part1 = function (callback) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, obj) {
                    if (err) {
                        if (callback) callback(err);
                    } else {
                        attrs.account = obj.toObject();
                        if (callback) callback();
                    }
                });
            } else {
                if (callback) callback(err);
            }
        }

        var _part2 = function (callback) {
            Charge.aggregate([
                { $match: { account: obj._id + "" }},
                { $group: {
                    _id: { account: "$account" },
                    total: { $sum: "$amount" }
                }}
            ], function (err, obj) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    if (obj && obj.length == 1 && obj[0].total) {
                        attrs.charge = obj[0].total;
                    } else {
                        attrs.charge = 0;
                    }
                    if (callback) callback();
                }
            });
        }

        var _part3 = function (callback) {
            Discussion.aggregate([
                { $match: { from: obj._id + "" }},
                { $group: {
                    _id: { from: "$from" },
                    total: { $sum: "$payment" }
                }}
            ], function (err, arr) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    if (obj && obj.length == 1 && obj[0].total) {
                        attrs.peyment = obj[0].total;
                    } else {
                        attrs.peyment = 0;
                    }
                    if (callback) callback();
                }
            });
        }

        var _part4 = function (callback) {
            Discount.aggregate([
                { $match: { owner: obj._id + "" }},
                { $group: {
                    _id: { owner: "$owner" },
                    total: { $sum: "$total" }
                }}
            ], function (err, arr) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    if (obj && obj.length == 1 && obj[0].total) {
                        attrs.buy = obj[0].total;
                    } else {
                        attrs.buy = 0;
                    }
                    if (callback) callback();
                }
            });
        }

        utility.taskRunner([_part1, _part2, _part3, _part4], function (err) {
            if (err) {
                res.send(err);
            } else {
                attrs.account.credit = attrs.charge - attrs.buy - attrs.peyment;
                res.json(attrs.account);
            }
        });
    });

    router.post('/connect', function (req, res) {
        res.send_ok();
    });

    router.post('/authenticate', function (req, res) {
        Account.findOne({
            username: req.body.username
        }, function (err, account) {
            if (err) {
                res.send_err(err);
            } else {
                if (!account) {
                    res.send_err(401, constants.message_unauthentication_error);
                } else {

                    // check if password matches
                    if (account.password != req.body.password) {
                        res.send_err(401, constants.message_unauthentication_error);
                    } else {
                        // if account is found and password is right
                        // create a token
                        var token = jwt.sign(account, option.app.get('superSecret'), {});

                        // return the information including token as JSON
                        res.send_ok({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token,
                            username: account.username,
                            firstName: account.profile.firstName,
                            lastName: account.profile.lastName,
                            access: getAccess(account)
                        });
                    }
                }
            }
        });
    });

    option.app.use('/api/accounts', router);
}

module.exports = {
    name: 'account',
    register: register
};
