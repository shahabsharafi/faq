var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const utility = require('../_infrastructure/utility');
    const Attribute = require('./attribute');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Attribute);

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
            var obj = new Attribute(req.body)
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
        Attribute.remove({}, function (err) {
            var treeInfo = [
                {
                    content:  new Attribute({ type: 'province', caption: 'تهران' }),
                    children: [
                        { content: new Attribute({ type: 'city', caption: 'تهران' }) },
                        { content: new Attribute({ type: 'city', caption: 'ورامین' }) }
                    ]
                },
                {
                    content:  new Attribute({ type: 'province', caption: 'مازندران' }),
                    children: [
                        { content: new Attribute({ type: 'city', caption: 'ساری' }) },
                        { content: new Attribute({ type: 'city', caption: 'قائم شهر' }) }
                    ]
                }
            ]

            var _insertObject = function (obj, callback) {
                obj.content.save(function (err, doc) {
                    if (err) throw err;
                    if (obj.children) {
                        _insertList(obj.children, doc._id, callback);
                    } else {
                        if (callback)
                            callback();
                    }
                });
            }

            var _insertList = function (list, parentId, callback) {
                if (list.length == 0) {
                    if (callback)
                        callback();
                } else {
                    var item = list.pop();
                    console.log(list.length);
                    if (parentId) item.content.parentId = parentId;
                    _insertObject(item, function () {
                        _insertList(list, parentId, callback)
                    });
                }
            }

            _insertList(treeInfo);
            /*
            var city1_1 = new Attribute({ type: 'city', caption: 'تهران' });
            var city1_2 = new Attribute({ type: 'city', caption: 'ورامین' });
            var province1 = new Attribute({ type: 'province', caption: 'تهران', children: [city1_1, city1_2] });

            var city2_1 = new Attribute({ type: 'city', caption: 'ساری' });
            var city2_2 = new Attribute({ type: 'city', caption: 'قائم شهر' });
            var province2 = new Attribute({ type: 'province', caption: 'مازندران', children: [city2_1, city2_2] });

            province1.save(function (err) {
                if (err) res.send(err);
                province2.save(function (err) {
                    if (err) res.send(err);
                });
            });
            */
        });
    });

    option.app.use('/api/attributes', router);
}

module.exports = {
    name: 'attribute',
    register: register
};
