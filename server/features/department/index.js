var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const utility = require('../_infrastructure/utility');
    const Department = require('./department');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Department);

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

    option.app.use('/api/departments', router);
}

module.exports = {
    name: 'attribute',
    register: register
};
