var register = function (option) {

    const data = require('./data.json');

    // get an instance of the router for api routes
    var router = option.express.Router();

    // route to return all roles (GET http://localhost:8080/api/menu)
    router.get('/', function (req, res) {
        var list = [];
        for (var i = 0; i < data.length; i++) {
            var itemi = data[i];
            for (var j = 0; j < data.length; j++) {
                var itemj = req.decoded._doc.access[j];
                if (itemi.name == itemj)
                    list.push(itemi);
            }
        }
        res.json(list);
    });

    option.app.use('/api/menu', router);
}

module.exports = {
    name: 'menu',
    register: register
};
