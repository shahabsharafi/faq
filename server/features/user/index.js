var register = function (option) {

    const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
    const User = require('./user');

    // get an instance of the router for api routes
    var router = option.express.Router();

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    router.post('/authenticate', function (req, res) {
        // find the user
        User.findOne({
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

    // route to return all users (GET http://localhost:8080/api/users)
    router.get('/users', function (req, res) {
        //res.json([1,2,3]);
        User.find({}, function (err, users) {
            var list = [];
            for (var i = 0; i < users.length; i++) {
                var item = users[i];
                list.push({
                    username: item.username,
                    firstName: item.profile.firstName,
                    lastName: item.profile.lastName,
                    access: item.access
                });
            }
            res.json(list);
        });
    });

    router.get('/setup', function (req, res) {

        User.remove({}, function (err) {
            // create a sample user
            var nick = new User({
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
                    contry: 'ایران',
                    city: 'تهران',
                    address: 'ستاری - پیامبر',
                    pcode: '874367466'
                },
                education: {
                    type: 1,
                    grade: 'مهندسی',
                    majors: 'صنایع',
                    universities: 'علم و صنعت',
                    level: ''
                },
                extra: {
                    language: 'فارسی',
                    dialect: 'آذری'
                }
            });

            // save the sample user
            nick.save(function (err) {
                if (err) throw err;

                console.log('User saved successfully');
                res.json({
                    success: true
                });
            });
        });

    });

    option.app.use('/api/user', router);
}

module.exports = {
    name: 'user',
    register: register
};
