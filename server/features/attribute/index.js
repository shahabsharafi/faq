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

    router.get('/all', function (req, res) {
        Attribute.find( { type: { $in: [ 'grade', 'major', 'university', 'level', 'language', 'dialect', 'country', 'province', 'city', 'sex', 'status', 'job_state', 'religion', 'sect', 'reference' ] } }, function (err, list) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(list);
            }
        });
    });

    router.get('/setup', function (req, res) {

        var _partOne = function (callback) {
            Attribute.remove({}, callback);
        }

        var _partTwo = function (callback) {
            var treeInfo = [
                {
                    content: new Attribute({
                        type: 'country',
                        caption: 'ایران'
                    }),
                    children: [
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
                }
            ]

            utility.insertTree(treeInfo, callback);
        }

        var _partThree = function (callback) {
            utility.insertList([
                //sex
                new Attribute({
                    type: 'sex',
                    caption: 'مرد',
                    value: 'male'
                }),
                new Attribute({
                    type: 'sex',
                    caption: 'زن',
                    value: 'female'
                }),
                //status
                new Attribute({
                    type: 'status',
                    caption: 'مجرد'
                }),
                new Attribute({
                    type: 'status',
                    caption: 'متاهل'
                }),
                //job_state
                new Attribute({
                    type: 'job_state',
                    caption: 'بی کار'
                }),
                new Attribute({
                    type: 'job_state',
                    caption: 'شاغل'
                }),
                new Attribute({
                    type: 'job_state',
                    caption: 'در حال تحصیل'
                }),
                //religion
                new Attribute({
                    type: 'religion',
                    caption: 'مسلمان'
                }),
                new Attribute({
                    type: 'religion',
                    caption: 'مسیحی'
                }),
                new Attribute({
                    type: 'religion',
                    caption: 'کلیمی'
                }),
                new Attribute({
                    type: 'religion',
                    caption: 'زرتشتی'
                }),
                //sect
                new Attribute({
                    type: 'sect',
                    caption: 'شیعه'
                }),
                new Attribute({
                    type: 'sect',
                    caption: 'سنی'
                }),

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
                //discount_type
                new Attribute({
                    type: 'discount_type',
                    value: 'disabled',
                    caption: 'غیر فعال',
                    order: 1
                }),
                new Attribute({
                    type: 'discount_type',
                    value: 'enabled',
                    caption: 'فعال',
                    order: 2
                }),
                new Attribute({
                    type: 'discount_type',
                    value: 'limited',
                    caption: 'مدت دار',
                    order: 3
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
