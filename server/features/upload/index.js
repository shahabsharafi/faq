var register = function (option) {
    const Discussion = require('../discussion/discussion');
    const DiscussionRepository = require('../_infrastructure/repository');
    const Account = require('../account/account');
    const DiscussionMapper = require('../discussion/mapper');
    const fs = require('fs');

    var router = option.express.Router();
    var discussionRepository = new DiscussionRepository(Discussion);

    router.post('/', (req, res) => {
        if (req.files && req.files.length) {
            var file = req.files[0];
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, owner) {
                    if (req.body.EntityName == 'discussion') {
                        var obj = JSON.parse(req.body.Entity);
                        if (!obj._id) {
                            var item = {
                                owner: owner._id,
                                createDate: new Date(),
                                text: '',
                                attachment: file.filename
                            }
                            var items = [];
                            items.push(item);
                            obj.items = items;
                            DiscussionMapper(obj, function (err) {
                                if (err) {
                                    res.send_err(err);
                                } else {
                                    discussionRepository.Save(obj, function (err) {
                                        if (err) {
                                            res.send_err(err);
                                        } else {
                                            item.owner = owner;
                                            res.send_ok(item);
                                        }
                                    });
                                }
                            });
                        } else {
                            Discussion.findOne({ _id: obj._id }, function (err, oldEntity) {
                                if (err) {
                                    res.send_err(err);
                                } else {
                                    var item = {
                                        owner: owner._id,
                                        createDate: new Date(),
                                        text: '',
                                        attachment: file.filename
                                    }
                                    var items = oldEntity.items || [];
                                    items.push(item);
                                    oldEntity.items = items;
                                    oldEntity.save(function () {
                                        item.owner = owner;
                                        res.send_ok(item);
                                    });
                                }
                            });
                        }
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
