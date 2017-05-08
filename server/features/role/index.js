var register = function (option) {

    const Role = require('./role');

    // get an instance of the router for api routes
    var router = option.express.Router();

    // route to authenticate a role (POST http://localhost:8080/api/role)
    router.post('/role', function (req, res) {

    });

    // route to return all roles (GET http://localhost:8080/api/roles)
    router.get('/roles', function (req, res) {
        Role.find({}, function (err, roles) {
            var list = [];
            for (var i = 0; i < roles.length; i++) {
                var item = roles[i];
                list.push({
                    name: item.name,
                    access: item.access
                });
            }
            res.json(list);
        });
    });

    router.get('/setup', function (req, res) {

        Role.remove({}, function (err) {
            // create a sample user
            var nick = new Role({
                name: 'admin',
                access: ['dashboard', 'user']
            });

            // save the sample user
            nick.save(function (err) {
                if (err) throw err;

                console.log('User saved successfully');
                res.json({
                    success: true
                });
            });
        });

    });

    option.app.use('/api/role', router);
}

module.exports = {
    name: 'role',
    register: register
};
