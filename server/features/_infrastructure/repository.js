var mongoose = require('mongoose');

var repository = function (model) {

    var self = this;

    self.Model = model;

    self.FindById = function (id, cb) {
        self.FindOne({
            _id: id
        }, function (err, entity) {
            cb(err, entity);
        });
    };

    self.FindOne = function (params, cb) {
        self.Model.findOne(params, function (err, entity) {
            if (!err && !entity) {
                err = true;
            }

            cb(err, entity);
        });
    };

    self.Find = function (params, cb) {
        console.log(params);
        self.Model.paginate({}, {
            offset: params.offset | 0,
            limit: params.limit | 10
        }, cb);
    }

    self.FindAll = function (params, cb, lean) {
        if (!lean) {
            self.Model.find(params).exec(cb);
        } else {
            self.Model.find(params).lean().exec(cb);
        }
    };

    self.Save = function (obj, cb) {
        var entity = new self.Model(obj);
        entity.save(function (err) {
            cb(err);
        });
    };

    self.Update = function (id, entity, cb) {
        self.FindById(id, function (err, oldEntity) {
            if (err) {
                cb(err);
            } else {
                Object.assign(oldEntity, entity);
                oldEntity.save(cb);
            }
        })
    };

    self.Delete = function (id, cb) {
        self.FindById(id, function (err, oldEntity) {
            if (err) {
                cb(err);
            } else {
                oldEntity.remove(function (err) {
                    cb(err);
                });
            }
        })
    };

    self.Setup = function (obj, cb) {
        self.Model.remove({}, function (err) {
            obj.save(function (err) {
                cb(err);
            });
        });
    }

};

module.exports = repository;
