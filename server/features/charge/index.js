var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const Charge = require('./charge');

    var router = option.express.Router();
    var repository = new Repository(Charge);

    controller({ router: router, model: Charge, repository: repository });

    option.app.use('/api/charges', router);
}

module.exports = {
    name: 'charge',
    register: register
};
