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

    controller(router, Discussion, repository, function (obj) {
        obj.from = obj.from._id;
        obj.to = obj.to._id;
        obj.state = obj.state._id;
        obj.department = obj.department._id;
        for (var i = 0; i < obj.items; i++) {
            var item = obj.items[i];
            item.owner = item.owner._id;
        }
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
