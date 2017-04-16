var register = function (option) {
    
    const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
    const User = require('./user');
    
    // get an instance of the router for api routes
    var router = option.express.Router(); 
    
    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    router.post('/authenticate', function(req, res) {    
      // find the user
      User.findOne({
        username: req.body.username
      }, function(err, user) {

        if (err) throw err;

        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

          // check if password matches
          if (user.password != req.body.password) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {

            // if user is found and password is right
            // create a token
            var token = jwt.sign(user, option.app.get('superSecret'), { });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }   

        }

      });
    });

    // route to return all users (GET http://localhost:8080/api/users)
    router.get('/users', function(req, res) {                               
        //res.json([1,2,3]);
        User.find({}, function(err, users) {
            res.json(users);
        });
    });

    router.get('/setup', function(req, res) {

      User.remove({}, function(err) { 
          // create a sample user
          var nick = new User({ 
            username: 'admin', 
            password: 'password'
          });

          // save the sample user
          nick.save(function(err) {
            if (err) throw err;

            console.log('User saved successfully');
            res.json({ success: true });
          });
      });

    });
    
    option.app.use('/api/user', router);
}

module.exports = {
    name: 'user',
    register: register
};
