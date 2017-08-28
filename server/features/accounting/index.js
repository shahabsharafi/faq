var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Accounting = require('./accounting');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Accounting);

    controller({ router: router, model: Accounting, repository: repository });

    router.post('/transaction', function (req, res) {
        var attrs = {};

        var _part1 = function (callback) {
            if (req.body.account) {
                req.body.account = req.body.account._id;
            } else {
                if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                    Account.findOne({
                        username: req.decoded._doc.username
                    }, function (err, obj) {
                        if (err) {
                            callback(err)
                        } else {
                            req.body.account = obj;
                            callback()
                        }
                    });
                } else {
                    callback({ success: false });
                }
            }
        }

        var _part2 = function (callback) {
            var obj = new Accounting(req.body)
            repository.Save(req.body, function (err) {
                if (callback) callback(err);
            });
        }

        utility.taskRunner([_part1, _part2], function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({
                    success: true
                });
            }
        });
    });

    router.get('/setup', function (req, res) {

        var attrs = {};

        var _part1 = function (callback) {
            Accounting.remove({}, callback);
        }

        var _part2 = function (callback) {
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

        var _part3 = function (callback) {
            var obj = new Accounting({
                createDate: new Date(),
                debit: 187366000,
                credit: 0,
                description: 'پرداخت پول',
                account: attrs.account
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

    option.app.use('/api/accountings', router);
}

module.exports = {
    name: 'accounting',
    register: register
};
