var register = function (option) {    
    const features = require('../features');
    const middleware = require('./middleware');
    
    option.app.use('/', option.express.static(__dirname + '/../../dist'));
    option.app.use('/scripts', option.express.static(__dirname + '/../../node_modules'));
    
    
    middleware.register(option);
    features.register(option);    
}

module.exports = {
  register: register
}
