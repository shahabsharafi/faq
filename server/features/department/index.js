var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const utility = require('../_infrastructure/utility');
    const Department = require('./department');
    const Attribute = require('../attribute/attribute');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Department);

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
            repository.Update(req.body._id, req.body, function (err, obj) {
                if (err) throw err;
                res.json(obj);
            });
        } else {
            var obj = new Department(req.body)
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
                        language: attrs.language
                    }),
                    children: [
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'فرانسه',
                                language: attrs.language
                            })
                        },
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'آلمانی',
                                language: attrs.language
                            })
                        }
                    ]
                },
                {
                    content: new Department({
                        type: 'department',
                        caption: 'ریاضی'
                    }),
                    children: [
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'سال اول',
                                language: attrs.language
                            })
                        },
                        {
                            content: new Department({
                                type: 'category',
                                caption: 'سال دوم',
                                language: attrs.language
                            })
                        }
                    ]
                }
            ]

            utility.insertTree(treeInfo, callback);
        }

        utility.taskRunner([_part2, _part2, _part3], function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    option.app.use('/api/departments', router);
}

module.exports = {
    name: 'attribute',
    register: register
};
