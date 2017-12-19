var register = function (option) {

    const fs = require('fs');
    const config = require('../../config'); // get our config file

    var router = option.express.Router();

    router.get('/file/stat/:path', (req, res) => {
        console.log('stat');
        console.log(config.uploadPath);
        console.log(req.params.path);
        var path = config.uploadPath + '/' + req.params.path;

        fs.stat(path, function (err, stats) {
            if (err) {
                res.send_err(err);
            } else {
                res.send_ok(stats);
            }
        })
    })

    option.app.use('/api/common', router);
}

module.exports = {
    name: 'common',
    register: register
};
