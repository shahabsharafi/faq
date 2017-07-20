var register = function (option) {

    const jwt = require('jsonwebtoken');
    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Account = require('./account');
    const Attribute = require('../attribute/attribute');
    const request = require("request");

    var router = option.express.Router();
    var repository = new Repository(Account);

    var mapper = function (obj, callback) {
        var _map = function (obj, propName) {
            if (obj[propName] && obj[propName]._id) {
                obj[propName] = obj[propName]._id
            }
        }
        _map(obj.contact, 'province');
        _map(obj.contact, 'city');
        _map(obj.education, 'grade');
        _map(obj.education, 'major');
        _map(obj.education, 'university');
        _map(obj.education, 'level');
        if (callback) callback();
    }
    controller({ router: router, model: Account, repository: repository, mapper: mapper });

    router.get('/setup', function (req, res) {

        var attrs = {};

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
                access: ['dashboard', 'discont'],
                email: 'shahab.sharafi@gmail.com',
                sms: '09124301687',
                isAdmin: true,
                profile: {
                    firstName: 'شهاب',
                    lastName: 'شرفی',
                    fatherName: 'Azim',
                    birthDay: '1980.4.18',
                    no: '16',
                    placeOfIssues: 'Sary',
                    nationalCode: '1234567890',
                    birthPlace: 'Sary',
                    status: 1
                },
                contact: {
                    mobile: '09124301687',
                    house: '01244876598',
                    work: '02188765432',
                    email: 'shahab.sharafi@gmail.com',
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

        utility.taskRunner([_part1, _part2, _part3, _part4, _part5, _part6, _part7, _part8, _part9], function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    router.get('/sendcode/:mobile', function (req, res) {
        console.log('send code');
        var mobile = req.params.mobile;
        utility.createCode(mobile, function (obj) {
            var code = obj.code;
            repository.FindObject({
                "mobile": mobile
            }, function (err, obj) {
                if (err) {
                    res.status(500).send(err);
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
                            res.status(500).send(err);
                        } else {
                            res.json({
                                code: code,
                                username: (obj ? obj.username : '')
                            });
                        }
                    });
                }
            });
        }, function () {
            res.sendStatus(500);
        });
    });

    router.post('/signup', function (req, res) {
        var mobile = req.body.mobile;
        var code = req.body.code;
        console.log('mobile: ' + mobile + ' code: ' + code)
        utility.checkCode(mobile, code, function (obj) {
            var model = {
                username: req.body.username,
                password: req.body.password,
                mobile: req.body.mobile,
                access: ['access_user']
            }
            var obj = new Account(model);
            repository.Save(req.body, function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var token = jwt.sign(model, option.app.get('superSecret'), {});

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                        username: model.username,
                        firstName: '',
                        lastName: '',
                        access: model.access
                    });
                }
            });
        }, function () {
            res.sendStatus(500);
        });
    });

    router.post('/resetpassword', function (req, res) {
        console.log('resetpassword...')
        var mobile = req.body.mobile;
        var code = req.body.code;
        utility.checkCode(mobile, code, function (obj) {
            console.log('resetpassword checked')
            var model = {
                username: req.body.username,
                password: req.body.password,
                mobile: req.body.mobile
            }
            Account.findOne({
                mobile: req.body.mobile
            }, function (err, account) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (account) {
                        console.log('resetpassword find')
                        account.password = req.body.password;
                        account.save(function () {
                            var token = jwt.sign(account, option.app.get('superSecret'), {});

                            console.log('resetpassword token')
                            // return the information including token as JSON
                            res.json({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token,
                                username: account.username,
                                firstName: account.profile.firstName,
                                lastName: account.profile.lastName,
                                access: account.access
                            });
                        });
                    } else {
                        res.sendStatus(500);
                    }
                }
            });
        }, function () {
            res.sendStatus(500);
        });
    });

    router.post('/authenticate', function (req, res) {
        console.log('authenticate');
        Account.findOne({
            username: req.body.username
        }, function (err, account) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (!account) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Account not found.'
                    });
                } else {

                    // check if password matches
                    if (account.password != req.body.password) {
                        res.json({
                            success: false,
                            message: 'Authentication failed. Wrong password.'
                        });
                    } else {
                        console.log('token');
                        // if account is found and password is right
                        // create a token
                        var token = jwt.sign(account, option.app.get('superSecret'), {});

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token,
                            username: account.username,
                            firstName: account.profile.firstName,
                            lastName: account.profile.lastName,
                            access: account.access
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
