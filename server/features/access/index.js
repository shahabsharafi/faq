var register = function (option) {

    const data = require('./data.json');

    // get an instance of the router for api routes
    var router = option.express.Router();

    // route to return all roles (GET http://localhost:8080/api/access)
    router.get('/', function (req, res) {
        res.json(data);
    });

    option.app.use('/api/access', router);
}

module.exports = {
    name: 'access',
    register: register
};
