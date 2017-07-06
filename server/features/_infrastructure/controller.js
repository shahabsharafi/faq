module.exports = function (router, Model, repository, mapper) {
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

    router.get('/item/:key', function (req, res) {
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
        var _fn = function (req, res) {
            if (req.body._id) {
                repository.Update(req.body._id, req.body, function (err, obj) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.json(obj);
                    }
                });
            } else {
                var obj = new Model(req.body)
                repository.Save(req.body, function (err) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.json(obj);
                    }
                });
            }
        }
        if (mapper) {
            mapper(req.body, function () { _fn(req, res); });
        }
        else {
            _fn(req, res);
        }

    });

    router.delete('/item/:key', function (req, res) {
        repository.Delete(req.params.key, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.sendStatus(200);
            }
        });
    });
}
