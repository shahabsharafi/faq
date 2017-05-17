var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const Attribute = require('./attribute');

    var router = option.express.Router();
    var repository = new Repository(Attribute)

    router.get('/', function (req, res) {
        /*
        repository.FindAll(req.params, function (err, list) {
            if (err) res.send(err);
            res.json(list);
        })
        */
        repository.Find(req.query, function (err, list) {
            if (err) res.send(err);
            res.json(list);
        })
    });

    router.get('/item/:key', function (req, res) {
        repository.FindById(req.params.key, function (err, obj) {
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
        var obj = new Attribute({
            parentId: null,
            type: 'country',
            caption: 'ایران'
        });
        repository.Setup(obj, function (err) {
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
