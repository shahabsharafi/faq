var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Attribute = require('./attribute');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Attribute);

    controller({ router: router, model: Attribute, repository: repository });

    router.get('/setup', function (req, res) {

        var _partOne = function (callback) {
            Attribute.remove({}, callback);
        }

        var _partTwo = function (callback) {
            var treeInfo = [
                {
                    content: new Attribute({
                        type: 'province',
                        caption: 'تهران'
                    }),
                    children: [
                        {
                            content: new Attribute({
                                type: 'city',
                                caption: 'تهران'
                            })
                        },
                        {
                            content: new Attribute({
                                type: 'city',
                                caption: 'ورامین'
                            })
                        }
                    ]
                },
                {
                    content: new Attribute({
                        type: 'province',
                        caption: 'مازندران'
                    }),
                    children: [
                        {
                            content: new Attribute({
                                type: 'city',
                                caption: 'ساری'
                            })
                        },
                        {
                            content: new Attribute({
                                type: 'city',
                                caption: 'قائم شهر'
                            })
                        }
                    ]
                }
            ]

            utility.insertTree(treeInfo, callback);
        }

        var _partThree = function (callback) {
            utility.insertList([
                //grade
                new Attribute({
                    type: 'grade',
                    caption: 'بدون تحصیلات'
                }),
                new Attribute({
                    type: 'grade',
                    caption: 'دیپلم'
                }),
                new Attribute({
                    type: 'grade',
                    caption: 'لیسانس'
                }),
                new Attribute({
                    type: 'grade',
                    caption: 'کارشناسی'
                }),
                new Attribute({
                    type: 'grade',
                    caption: 'کارشناسی ارشد'
                }),
                new Attribute({
                    type: 'grade',
                    caption: 'دکتری'
                }),
                //major
                new Attribute({
                    type: 'major',
                    caption: 'مهندسی مکانیک'
                }),
                new Attribute({
                    type: 'major',
                    caption: 'مهندسی الکترونیک'
                }),
                new Attribute({
                    type: 'major',
                    caption: 'مهندسی کامپیوتر'
                }),
                new Attribute({
                    type: 'major',
                    caption: 'مهندسی صنایع'
                }),
                //university
                new Attribute({
                    type: 'university',
                    caption: 'علم و صنعت'
                }),
                new Attribute({
                    type: 'university',
                    caption: 'تهران'
                }),
                new Attribute({
                    type: 'university',
                    caption: 'شهید بهشتی'
                }),
                //level
                new Attribute({
                    type: 'level',
                    caption: 'سطح یک'
                }),
                new Attribute({
                    type: 'level',
                    caption: 'سطح دو'
                }),
                new Attribute({
                    type: 'level',
                    caption: 'سطح سه'
                }),
                new Attribute({
                    type: 'level',
                    caption: 'سطح چهار'
                }),
                //language
                new Attribute({
                    type: 'language',
                    caption: 'فارسی'
                }),
                new Attribute({
                    type: 'language',
                    caption: 'عربی'
                }),
                new Attribute({
                    type: 'language',
                    caption: 'انگلیسی'
                }),
                new Attribute({
                    type: 'language',
                    caption: 'آلمانی'
                }),
                new Attribute({
                    type: 'language',
                    caption: 'فرانسه'
                }),
                new Attribute({
                    type: 'language',
                    caption: 'ترکی'
                }),
                //dialect
                new Attribute({
                    type: 'dialect',
                    caption: 'مازندرانی'
                }),
                new Attribute({
                    type: 'dialect',
                    caption: 'گیلکی'
                }),
                new Attribute({
                    type: 'dialect',
                    caption: 'کردی'
                }),
                new Attribute({
                    type: 'dialect',
                    caption: 'لری'
                }),
                //discount_state
                new Attribute({
                    type: 'discount_state',
                    caption: 'فعال'
                }),
                new Attribute({
                    type: 'discount_state',
                    caption: 'غیر فعال'
                }),
                new Attribute({
                    type: 'discount_state',
                    caption: 'دارای محدوده زمانی'
                })
            ], callback);
        }

        utility.taskRunner([_partOne, _partTwo, _partThree], function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    option.app.use('/api/attributes', router);
}

module.exports = {
    name: 'attribute',
    register: register
};
