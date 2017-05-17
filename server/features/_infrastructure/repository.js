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

    self.Find = function (query, cb) {
        var oData = parseOData(query);
        //var option = parseOption(params);
        self.Model.paginate(oData.query, oData.option, cb);
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

    var parseOData = function (oData) {
        if (oData) {
            var _fn = function (filter) {
                var str = '';
                if (filter.type == 'and') {
                    str += _fn(filter.right);
                    str += ", " + _fn(filter.left);
                } else if (filter.type == 'functioncall' && filter.args && filter.args.length == 2) {
                    var key = filter.args[0].name.replace(/\_/, '.');
                    var val = filter.args[1].value;

                    switch (filter.func) {
                        case 'substringof':
                            str += ' "' + key + '": { "$regex": "' + val + '" } ';
                            break;
                        case 'endswith':
                            str += ' "' + key + '": { "$regex": "' + val + '^" } ';
                            break;
                        default:
                            str += ' "' + key + '": { "$regex": "^' + val + '" } ';
                    }
                }

                return str;
            }
            var query = {};
            if (oData.$filter)
                query = JSON.parse('{ ' + _fn(oData.$filter) + ' }');

            var option = {
                offset: oData.$top | 0,
                limit: oData.$skip | 10
            }
            if (oData.$orderby && oData.$orderby.length)
                option.sort = oData.$orderby[0];

        }

        return {
            query: query,
            option: option
        };
    }

};

module.exports = repository;
