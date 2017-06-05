var register = function (option) {

    const jwt = require('jsonwebtoken');
    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Account = require('./account');
    const Security = require('./security');
    const Attribute = require('../attribute/attribute');
    const request = require("request");

    var router = option.express.Router();
    var repository = new Repository(Account);
    var repSecurity = new Repository(Security);


    router.get('/test/:mobile', function (req, res, next) {
        var mobile = req.params.mobile;
        console.log(mobile);
        repository.FindObject({ "mobile": mobile }, function (err, obj) {
            console.log('###########################');
            console.log(obj);
            res.sendStatus(200);
        });
    });

    controller(router, Account, repository, function (obj) {
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
    });

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
        var mobile = req.params.mobile;
        repository.FindObject({ "mobile": mobile }, function (err, obj) {
            if (err) throw err;

            var code = utility.random(1000, 9999);
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
                if (err) throw err;

                console.log(body);
                res.json({ code: code, username: (obj ? obj.username : '') });
            });
        });
    });

    router.post('/signup', function (req, res) {
        var model = {
            code: req.body.code,
            username: req.body.username,
            password: req.body.password,
            mobile: req.body.mobile
        }
        var obj = new Account(model);
        repository.Save(req.body, function (err) {
            if (err) throw err;

            var token = jwt.sign(account, option.app.get('superSecret'), {});

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token,
                username: account.username,
                firstName: '',
                lastName: ''
            });
        });
    });

    router.post('/resetpassword', function (req, res) {
        var model = {
            code: req.body.code,
            username: req.body.username,
            password: req.body.password,
            mobile: req.body.mobile
        }
        Account.findOne({
            username: req.body.username
        }, function (err, account) {
            if (err) throw err;

            account.password = req.body.password;
            account.save(function () {
                var token = jwt.sign(account, option.app.get('superSecret'), {});

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    username: account.username,
                    firstName: account.profile.firstName,
                    lastName: account.profile.lastName
                });
            });
        });
    });

    router.post('/authenticate', function (req, res) {
        // find the account
        Account.findOne({
            username: req.body.username
        }, function (err, account) {
            if (err) throw err;

            if (!account) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Account not found.'
                });
            } else if (account) {

                // check if password matches
                if (account.password != req.body.password) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

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
                        lastName: account.profile.lastName
                    });
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
