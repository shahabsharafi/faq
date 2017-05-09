var register = function (option) {

    const Role = require('./role');

    // get an instance of the router for api routes
    var router = option.express.Router();

    // route to authenticate a role (POST http://localhost:8080/api/role)
    router.post('/roles', function (req, res) {

    });

    // route to return all roles (GET http://localhost:8080/api/roles)
    router.get('/', function (req, res) {
        Role.find({}, function (err, roles) {
            var list = [];
            for (var i = 0; i < roles.length; i++) {
                var item = roles[i];
                list.push({
                    _id: item._id,
                    name: item.name,
                    access: item.access
                });
            }
            res.json(list);
        });
    });

    router.get('/:_id', function (req, res) {
        console.log(req.params._id)
        Role.findOne({
            _id: req.params._id
        }, function (err, role) {
            if (err) throw err;

            res.json(role);
        });
    });

    router.post('/', function (req, res) {
        if (req.body._id) {
            Role.findOne({
                _id: req.body._id
            }, function (err, role) {
                if (err) throw err;

                role.name = req.body.name;
                role.save(function (err) {
                    if (err) throw err;

                    res.json(role);
                });
            });
        } else {

            var role = new Role({
                name: req.body.name,
                access: []
            });
            role.save(function (err) {
                if (err) throw err;

                res.json(role);
            });
        }
    });

    router.delete('/', function (req, res) {
        console.log(req.query._id);
        Role.remove({
            _id: req.query._id
        }, function (err, role) {
            if (err) return res.send(err);

            console.log('deleting');
            res.json({
                message: 'Deleted'
            });
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

    option.app.use('/api/roles', router);
}

module.exports = {
    name: 'role',
    register: register
};
