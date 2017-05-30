var mongoose = require('mongoose');

var repository = function (model) {

    var self = this;

    self.Model = model;

    self.FindById = function (id, query, cb) {
        var oData = parseOData(query);
        var option = oData ? (oData.option || {}) : {};
        self.Model.paginate({ _id: id }, oData.option, function (err, list) {
            if (cb) cb(err, list.docs[0]);
        });
    };

    self.FindOne = function (query, cb) {
        var oData = parseOData(query);
        var option = oData ? (oData.option || {}) : {};
        self.Model.findOne(option, cb);
    };

    self.Find = function (query, cb) {
        var oData = parseOData(query);
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
        console.log(entity);
        self.Model.findOne({ _id: id }, function (err, oldEntity) {
            if (err) {
                cb(err);
            } else {
                Object.assign(oldEntity, entity);
                oldEntity.save(cb);
            }
        })
    };

    self.Delete = function (id, cb) {
        self.Model.findOne({ _id: id }, function (err, oldEntity) {
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
                    var key = filter.args[0].name.replace(/\_/g, '.');
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
                } else if (filter.type == 'eq') {
                    var key = filter.left.name.replace(/\_/g, '.');
                    var val = filter.right.value;
                    str += ' "' + key + '": "' + val + '" ';
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

            if (oData.$select && oData.$select.length) {
                var select = {};
                for (var i = 0; i < oData.$select.length; i++) {
                    select[oData.$select[i].replace(/\_/g, '.')] = 1
                }
                option.select = select;
            }

            if (oData.$expand && oData.$expand.length) {
                /*
                var populate = [];
                for (var i = 0; i < oData.$expand.length; i++) {
                    var item = oData.$expand[i];
                    if (item.indexOf("/") > -1) {
                        var parts = item.split("/");
                        populate.push({ path: parts[0].replace(/\_/g, '.'), select: parts[1] + ' -_id' });
                    } else {
                        populate.push({ path: item.replace(/\_/g, '.'), select: 'caption -_id' });
                    }

                }
                */
                var populate = oData.$expand.join(' ').replace(/\_/g, '.');
                option.populate = populate;
            }
        }

        return {
            query: query,
            option: option
        };
    }

};

module.exports = repository;
