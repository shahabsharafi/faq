var register = function (option) {

    const jwt = require('jsonwebtoken');
    const config = require('../../config'); // get our config file
    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Account = require('./account');
    const Online = require('./online');
    const Discussion = require('../discussion/discussion');
    const Discount = require('../discount/discount');
    const Charge = require('../charge/charge');
    const Attribute = require('../attribute/attribute');
    const request = require("request");
    const constants = require('../../_infrastructure/constants');
    const _ = require('lodash');

    var router = option.express.Router();
    var repository = new Repository(Account);

    var mapper = function (obj, callback) {
        var _map = function (obj, propName) {
            if (obj[propName] && typeof obj[propName] === 'object') {
                if (obj[propName]._id) {
                    obj[propName] = obj[propName]._id
                } else {
                    delete obj[propName];
                }
            }

            if (obj[propName] == '')
                delete obj[propName];
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

        var _init = function (obj, propName) {
            if (obj[propName] == null || obj[propName] == undefined)
                obj[propName] = false;
        }

        _init(obj, 'isOperator');
        _init(obj, 'isUser');
        _init(obj, 'isOrganization');
        _init(obj, 'blocked');
        _init(obj, 'disabled');
        _init(obj, 'isManager');

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

    router.get('/online', function (req, res) {

        var attr = {};

        var _part0 = function (callback) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username && req.decoded._doc.profile) {
                attr.sex = req.decoded._doc.profile.sex;
                if (callback) callback();
            } else {
                if (callback) callback({ success: false });
            }
        }

        var _part1 = function (callback) {
            Account.find({ $and: [
                { 'isOperator': true, 'disabled': false },
                { $or: [{ 'sexPrevention': false }, { 'sex': attr.sex + '' }] }
            ]}, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var obj = item.toObject();
                        delete obj.password;
                        obj.state = 0;
                        l.push(obj);
                    }
                    attr.list = l;
                    if (callback) callback();
                }
            });
        }

        var _part2 = function (callback) {
            Online.find({}, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var suspend = 0.25*60*60*1000; //15min
                    var offline = 1*60*60*1000; //1h
                    var l = attr.list;
                    for (var i = 0; i < l.length; i++) {
                        var item = l[i];
                        var obj = _.find(list, function(o) { return o.username == item.username; });
                        var state = 0;//offline
                        var now = new Date();
                        if (obj && obj.lastRequest){
                            var d = new Date(obj.lastRequest);
                            if (new Date(d.setTime( d.getTime() + offline )) > now) {//not offline
                                if (new Date(d.setTime( d.getTime() + suspend )) < now) {//suspend
                                    state = 1
                                } else {//online
                                    state = 2
                                }
                            }
                        }
                        item.state = state;
                    }
                    if (callback) callback();
                }
            });
        }

        utility.taskRunner([_part0, _part1, _part2], function (err) {
            if (err) {
                res.send_err(err);
            } else {
                res.send_ok(attr.list);
            }
        });


    })

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
                blocked: false,
                disabled: false,
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
                                blocked: false,
                                suportVersion: config.suportVersion,
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
                                blocked: account.blocked,
                                suportVersion: config.suportVersion,
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

    router.get('/version', function (req, res) {
        res.json({
            success: true,
            message: config.lastVersion
        });
    });

    router.get('/setuserkey', function(req, res) {

        if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
            utility.saveChche(req.decoded._doc.username, function (key) {
                res.send_ok({
                    message: key,
                    success: true
                });
            });
        } else {
            res.send_err({ success: false });
        }
    });

    router.get('/commitchash', function(req, res) {
        var key = req.query.key;
        var price = req.query.price;
        utility.recoverChche(key, function (username) {
			if (username) {
				Account.findOne( { username: username }, function (err, obj) {
					if (err) {
						console.log('err: 1');
						res.send_err(err);
					} else {
						if (obj) {
							var entity = new Charge({
								amount: price,
								account: obj._id,
								description: '',
								createDate: new Date()
							});
							entity.save(function (err) {
								if (err) {
									console.log('err: 2');
									res.send_err(err);
								} else {
									console.log('success');
									res.send_ok({
										message: username,
										success: true
									});
								}
							});
						} else {
							console.log('err: 3');
							res.send_err(err);
						}
					}
				});
			} else {
				console.log('err: 4');
				res.send_err({ success: false });
			}
        }, function () {
			console.log('err: 5');
            res.send_err({ success: false });
        });
    });

    router.get('/byusername/:username', function (req, res) {
		Account.findOne( { username: req.params.username }, function (err, obj) {
            if (err) {
				res.send_err(err);
            } else {
				if (obj) {
					var temp = obj.toObject();
                    delete temp.password;
					res.send_ok(temp);
                } else {
					res.send_err(err);
                }
            }
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
                        var temp = obj.toObject();
                        delete temp.password;
                        attrs.account = temp;
                        if (callback) callback();
                    }
                });
            } else {
                if (callback) callback({ success: false });
            }
        }

        var _part2 = function (callback) {
            Charge.aggregate([
                { $match: { account: attrs.account._id + "" }},
                { $group: {
                    _id: { account: "$account" },
                    total: { $sum: "$amount" }
                }}
            ], function (err, arr) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    if (arr && arr.length == 1 && arr[0].total) {
                        attrs.charge = arr[0].total;
                    } else {
                        attrs.charge = 0;
                    }
                    if (callback) callback();
                }
            });
        }

        var _part3 = function (callback) {
            Discussion.aggregate([
                { $match: { from: attrs.account._id + "" }},
                { $group: {
                    _id: { from: "$from" },
                    total: { $sum: "$payment" }
                }}
            ], function (err, arr) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    if (arr && arr.length == 1 && arr[0].total) {
                        attrs.peyment = arr[0].total;
                    } else {
                        attrs.peyment = 0;
                    }
                    if (callback) callback();
                }
            });
        }

        var _part4 = function (callback) {
            Discount.aggregate([
                { $match: { owner: attrs.account._id + "" }},
                { $group: {
                    _id: { owner: "$owner" },
                    total: { $sum: "$total" }
                }}
            ], function (err, arr) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    if (arr && arr.length == 1 && arr[0].total) {
                        attrs.buy = arr[0].total;
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
                            blocked: account.blocked,
                            suportVersion: config.suportVersion,
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
