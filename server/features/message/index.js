var register = function (option) {

    const Repository = require('../_infrastructure/repository');
    const controller = require('../_infrastructure/controller');
    const utility = require('../_infrastructure/utility');
    const Account = require('../account/account');
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
            var d = new Date();
            QMessage.find({
                issueDate : { $lte: d},
                expireDate: { $gte: d }
            }, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        l.push(item.message);
                    }
                    attrs.ql = l;
                    if (callback) callback();
                }
            });
        }

        var _part3 = function (callback) {
            var d = new Date();
            Message.find({ $and: [
                { issueDate : { $lte: d}},
                { expireDate: { $gte: d }},
                { $or: [{ 'owner': null }, { 'owner': attrs.owner + '' }] },
                { _id : { $nin: attrs.ql }}
            ]}, function (err, list) {
                if (err) {
                    if (callback) callback(err);
                } else {
                    var l = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        l.push({
                            owner: attrs.owner + '',
                            message: item._id + '',
                            createDate: new Date(),
                            issueDate: item.issueDate,
                            expireDate: item.expireDate
                        });
                    }
                    QMessage.collection.insertMany(l);
                    attrs.ml = list;
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
            var d = new Date();
            QMessage.find({
                issueDate : {$lte: d},
                expireDate: { $gte: d },
                owner : attrs.owner._id
            }, function (err, list) {
                if (err) {
                    //console.log(err);
                    if (callback) callback(err);
                } else {
                    attrs.ql = list;
                    if (callback) callback();
                }
            });
        }

        utility.taskRunner([_part1, _part2], function(err) {
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
