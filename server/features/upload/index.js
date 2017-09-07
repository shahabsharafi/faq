var register = function (option) {

    const Discussion = require('../discussion/discussion');
    const Account = require('../account/account');
    const fs = require('fs');

    var router = option.express.Router();

    router.post('/', (req, res) => {
        var sendErr = function (err) {
            res.status(500).send(err || { success: false });
        }
        if (req.files && req.files.length) {
            var file = req.files[0];
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, owner) {
                    if (req.body.EntityName == 'discussion') {
                        var id = req.body.EntityKey;
                        Discussion.findOne({ _id: id }, function (err, oldEntity) {
                            if (err) {
                                sendErr(err);
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
                                    res.status(200).json(item);
                                });
                            }
                        });
                    }  else {
                        sendErr();
                    }
                });
            } else {
                sendErr();
            }
        } else {
            sendErr();
        }
    });
    option.app.use('/api/uploads', router);
}

module.exports = {
    name: 'upload',
    register: register
};
