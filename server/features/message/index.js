var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Message = require('./message');
    const QMessage = require('./qmessage');

    var router = option.express.Router();
    var mrepository = new Repository(Message);
    var qrepository = new Repository(QMessage);

    var mapper = function (obj, callback) {
        if (obj.owner && obj.owner._id) {
            obj.owner = obj.owner._id;
            if (callback) callback();
        } else if (obj.owner && obj.owner.username) {
            Account.findOne({ username: obj.owner.username }, function (err, user) {
                if (err) {
                    if (callback) callback(err)
                } else {
                    obj.owner = user._id;
                    if (callback) callback();
                }
            })
        } else {
            if (callback) callback();
        }
    }

    controller({ router: router, model: Message, repository: mrepository, mapper: mapper });

    router.get('/newmessages', function (req, res) {

        var attrs = {};

        var _part1 = function (callback) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, obj) {
                    if (err) {
                        if (callback) callback(err);
                    } else {
                        attrs.owner = obj._id;
                        if (callback) callback();
                    }
                });
            } else {
                if (callback) callback(err);
            }
        }

        var _part2 = function (callback) {
            QMessage.find({
                issueDate : {$lt: d},
                expireDate: { $gt: d },
                owner : { owner: attrs.owner }
            }, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    attrs.ql = list;
                    if (callback) callback();
                }
            });
        }

        var _part3 = function (callback) {
            Message.find({ $and: [
                { issueDate : {$lt: d}},
                { expireDate: { $gt: d }},
                { $or: [{ 'owner': null }, { 'owner': attrs.owner }] },
                { _id : { $nin: attrs.ql }}
            ]}, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        l.push({
                            owner: attrs.owner,
                            message: item._id,
                            createDate: new Date(),
                            issueDate: item.issueDate,
                            expireDate: item.expireDate
                        });
                    }
                    QMessage.collection.insertMany(l);
                    if (callback) callback();
                }
            });
        }

        utility.taskRunner([_part1, _part2, _part3], function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(attrs.ml);
            }
            return;
        });
    });




    router.get('/allmessages', function (req, res) {

        var attrs = {};

        var _part1 = function (callback) {
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                Account.findOne( { username: req.decoded._doc.username }, function (err, obj) {
                    if (err) {
                        if (callback) callback(err);
                    } else {
                        attrs.owner = obj._id;
                        if (callback) callback();
                    }
                });
            } else {
                if (callback) callback(err);
            }
        }

        var _part2 = function (callback) {
            QMessage.find({
                issueDate : {$lt: d},
                expireDate: { $gt: d },
                owner : { owner: attrs.owner }
            }, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    attrs.ql = list;
                    if (callback) callback();
                }
            });
        }

        utility.taskRunner([_part1, _part2, _part3], function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(attrs.ql);
            }
            return;
        });
    });




    option.app.use('/api/messages', router);
}

module.exports = {
    name: 'message',
    register: register
};
