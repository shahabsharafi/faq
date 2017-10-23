var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const Poll = require('./poll');

    var router = option.express.Router();
    var repository = new Repository(Poll);

    controller({ router: router, model: Poll, repository: repository });

    option.app.use('/api/polls', router);
}

module.exports = {
    name: 'poll',
    register: register
};
