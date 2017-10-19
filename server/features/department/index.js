var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Department = require('./department');
    const Discount = require('../discount/discount');
    const Attribute = require('../attribute/attribute');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Department);


    controller({ router: router, model: Department, repository: repository });

    router.get('/setup', function (req, res) {

        var attrs = {};

        var _part1 = function (callback) {
            Department.remove({}, callback);
        }

        var _part2 = function (callback) {
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

        var _part3 = function (callback) {
            var treeInfo = [
                {
                    content: new Department({
                        type: 'department',
                        caption: 'زبان',
                        description: 'در این دپارتمان می توانید اطلاعاتتون راجع به زبان را بیشتر کنید.',
                        language: attrs.language._id
                    }),
                    children: [
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'فرانسه',
                                description: 'در این دپارتمان می توانید اطلاعاتتون راجع به فرانسه را بیشتر کنید.',
                                language: attrs.language._id
                            })
                        },
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'آلمانی',
                                description: 'در این دپارتمان می توانید اطلاعاتتون راجع به آلمانی را بیشتر کنید.',
                                language: attrs.language._id
                            })
                        }
                    ]
                },
                {
                    content: new Department({
                        type: 'department',
                        caption: 'ریاضی',
                        description: 'در این دپارتمان می توانید اطلاعاتتون راجع به ریاضی را بیشتر کنید.',
                    }),
                    children: [
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'سال اول',
                                description: 'در این دپارتمان می توانید اطلاعاتتون راجع به ریاضی سال اول را بیشتر کنید.',
                                language: attrs.language._id
                            })
                        },
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'سال دوم',
                                description: 'در این دپارتمان می توانید اطلاعاتتون راجع به ریاضی سال دوم را بیشتر کنید.',
                                language: attrs.language._id
                            })
                        }
                    ]
                }
            ]

            utility.insertTree(treeInfo, callback);
        }

        utility.taskRunner([_part1, _part2, _part3], function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    option.app.use('/api/departments', router);
}

module.exports = {
    name: 'department',
    register: register
};
