var register = function (option) {

    const jwt = require('jsonwebtoken');
    const Repository = require('../_infrastructure/repository');
    const utility = require('../_infrastructure/utility');
    const Account = require('./account');
    const Attribute = require('../attribute/attribute');

    var router = option.express.Router();
    var repository = new Repository(Account);

    router.get('/', function (req, res) {
        var oData = utility.getODataInfo(req.url);
        repository.Find(oData, function (err, list) {
            if (err) res.send(err);
            res.json(list);
        })
    });

    router.get('/item/:key', function (req, res) {
        var oData = utility.getODataInfo(req.url);
        repository.FindById(req.params.key, oData, function (err, obj) {
            if (err) res.send(err);
            res.json(obj);
        })
    });

    router.post('/', function (req, res) {
        if (req.body._id) {
            req.body.contact.province = req.body.contact.province._id;
            req.body.contact.city = req.body.contact.city._id;
            repository.Update(req.body._id, req.body, function (err, obj) {
                if (err) throw err;
                res.json(obj);
            });
        } else {
            repository.Save(req.body, function (err) {
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
        Attribute.findOne({ caption: 'تهران', type: 'province' }, function (err, province) {
            Attribute.findOne({ caption: 'تهران', type: 'city' }, function (err, city) {
                var obj = new Account({
                    username: 'admin',
                    password: '123456',
                    access: ['dashboard', 'discont'],
                    email: 'shahab.sharafi@gmail.com',
                    sms: '09124301687',
                    isAdmin: true,
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
                        province: province._id,
                        city: city._id,
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
            })
        })

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
