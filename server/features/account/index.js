var register = function (option) {

    const jwt = require('jsonwebtoken');
    const Repository = require('../_infrastructure/repository');
    const Account = require('./account');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Account)

    router.get('/', function (req, res) {
        /*
        repository.FindAll(req.params, function (err, list) {
            if (err) res.send(err);
            res.json(list);
        })
        */
        var queryString = URL.parse(req.url).query;
        var f = decodeURIComponent(queryString);
        var oData = parser.parse(f);
        repository.Find(oData, function (err, list) {
            if (err) res.send(err);
            res.json(list);
        })
    });

    router.get('/item/:key', function (req, res) {
        repository.FindById(req.params.key, function (err, obj) {
            if (err) res.send(err);
            res.json(obj);
        })
    });

    router.post('/', function (req, res) {
        if (req.body._id) {
            repository.Update(req.body._id, req.body, function (err, obj) {
                if (err) throw err;
                res.json(obj);
            });
        } else {
            var obj = new Account(req.body)
            repository.Save(obj, function (err) {
                if (err) throw err;
                res.json(obj);
            });
        }
    });

    router.delete('/item/:key', function (req, res) {
        repository.Delete(req.params.key, function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    router.get('/setup', function (req, res) {
        var obj = new Account({
            username: 'admin',
            password: '123456',
            access: ['dashboard', 'discont'],
            email: 'shahab.sharafi@gmail.com',
            sms: '09124301687',
            activation: {
                state: false,
                code: '1234'
            },
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
                province: 'تهران',
                city: 'ورامین',
                address: 'ستاری - پیامبر',
                pcode: '874367466'
            },
            education: {
                type: 1,
                grade: 'مهندسی',
                major: 'صنایع',
                university: 'علم و صنعت',
                level: ''
            },
            extra: {
                language: 'فارسی',
                dialect: 'آذری'
            }
        });
        repository.Setup(obj, function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    router.post('/authenticate', function (req, res) {
        // find the user
        Account.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, option.app.get('superSecret'), {});

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
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
