var register = function (option) {

    const Discussion = require('../discussion/discussion');
    const Account = require('../account/account');
    const fs = require('fs');

    var router = option.express.Router();

    router.post('/', (req, res) => {
        if (req.files && req.files.length) {
            var file = req.files[0];
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, owner) {
                    if (req.body.EntityName == 'discussion') {
                        var id = req.body.EntityKey;
                        Discussion.findOne({ _id: id }, function (err, oldEntity) {
                            if (err) {
                                res.send_err(err);
                            } else {
                                var item = {
                                    owner: owner,
                                    createDate: new Date(),
                                    text: '',
                                    attachment: file.filename
                                }
                                var items = oldEntity.items || [];
                                items.push(item);
                                oldEntity.items = items;
                                oldEntity.save(function () {
                                    res.send_ok(item);
                                });
                            }
                        });
                    }  else {
                        res.send_err();
                    }
                });
            } else {
                res.send_err();
            }
        } else {
            res.send_err();
        }
    });
    option.app.use('/api/uploads', router);
}

module.exports = {
    name: 'upload',
    register: register
};
