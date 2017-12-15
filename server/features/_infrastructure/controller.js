module.exports = function (option){

    var router = option.router;
    var model = option.model;
    var repository = option.repository;
    var mapper = option.mapper;
    var changed = option.changed;

    if (!router) return;

    const utility = require('../_infrastructure/utility');

    router.get('/', function (req, res) {
        var oData = utility.getODataInfo(req.url);
        repository.Find(oData, function (err, list) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(list);
            }
        })
    });

    router.get('/tree', function (req, res) {
        repository.GetTree(function (err, list) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(list);
            }
        })
    });

    router.get('/item/:key', function (req, res) {
        console.log('aaaaaaaaaaaaaaaaa');
        var oData = utility.getODataInfo(req.url);
        repository.FindById(req.params.key, oData, function (err, obj) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(obj);
            }
        })
    });

    router.post('/', function (req, res) {

        var _part1 = function (callback) {
            if (mapper) {
                mapper(req.body, callback);
            }
            else {
                if (callback) callback();
            }
        }

        var _part2 = function (callback) {
            if (req.body._id) {
                repository.Update(req.body._id, req.body, callback);
            } else {
                repository.Save(req.body, callback);
            }
        }

        var _part3 = function (callback) {
            if (changed) {
                changed(callback);
            } else {
                if (callback) callback();
            }
        }

        utility.taskRunner([_part1, _part2, _part3], function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({
                    success: true
                });
            }
            return;
        });
    });

    router.delete('/item/:key', function (req, res) {
        repository.Delete(req.params.key, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({ success: true, message: 'successfully deleted!' });
            }
        });
    });
}
