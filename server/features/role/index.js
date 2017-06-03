var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Role = require('./role');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Role);

    controller(router, Role, repository, null);

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
