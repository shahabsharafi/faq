var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const Role = require('./role');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Role);

    router.get('/', function (req, res) {
        /*
        repository.FindAll({}, function (err, list) {
            if (err) res.send(err);
            res.json(list);
        })
        */
        var oData = null;
        var queryString = URL.parse(req.url).query;
        if (queryString) {
            var f = decodeURIComponent(queryString);
            oData = parser.parse(f);
        }
        repository.Find(oData, function (err, list) {
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
            var obj = new Role(req.body)
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
        var obj = new Role({
            name: 'admin',
            access: ['dashboard', 'user']
        });
        repository.Setup(obj, function (err) {
            if (err) res.send(err);
            res.json({
                success: true
            });
        });
    });

    option.app.use('/api/roles', router);
}

module.exports = {
    name: 'role',
    register: register
};
