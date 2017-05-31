var register = function (option) {
    const features = require('../features');
    const middleware = require('./middleware');

    option.app.use('/', option.express.static(__dirname + '/../../dist'));
    option.app.use('/scripts', option.express.static(__dirname + '/../../node_modules'));
    option.app.use('/resources', option.express.static(__dirname + '/../resources'));


    middleware.register(option);
    features.register(option);

    option.app.use(function (err, req, res, next) {
        console.error('aaaaaaaaaaaaa');
        console.error(err.stack);
        res.status(500).send('Something broke!');
    })
}

module.exports = {
    register: register
}
