var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Discount = require('./discount');
    const URL = require('url');
    const parser = require("odata-parser");

    var router = option.express.Router();
    var repository = new Repository(Discount);

    var mapper = function (obj, callback) {
        obj.state = obj.state._id;
        if (callback) callback();
    }
    controller({ router: router, model: Discount, repository: repository, mapper: mapper });

    option.app.use('/api/discounts', router);
}

module.exports = {
    name: 'discount',
    register: register
};
