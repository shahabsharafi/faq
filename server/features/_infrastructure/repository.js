var mongoose = require('mongoose');
var parser = require("odata-parser");

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
        var oData = parseOData(params);
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

    var parseOData = function (params) {
        var query = {};
        var option = {};
        if (params && params.odata) {
            console.log('params:');
            console.log(params);
            //var f = params.replace(/\+/, ' ');
            var filterObj = parser.parse(params.odata);
            console.log(filterObj);
            var _fn = function (filterObj) {
                var str = '';
                if (filterObj.type == 'and') {
                    str += _fn(filterObj.right);
                    str += ", " + _fn(filterObj.left);
                } else if (filterObj.type == 'functioncall' && filterObj.args && filterObj.args.length == 2) {
                    var key = filterObj.args[0].name.replace(/\_/, '.');
                    var val = filterObj.args[1].value;

                    switch (filterObj.func) {
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
            query = JSON.parse('{ ' + _fn(filterObj.$filter) + ' }');
            /*
            if (params.sortField)
                sortObj = JSON.parse('{ "' + params.sortField + '": "' + params.sortOrder + '" }');
            return {
                sort: sortObj,
                offset: params.$top | 0,
                limit: params.$skip | 10
            }
            */
        }

        return {
            query: query,
            option: option
        };
    }

    parseOption = function (params) {
        var sortObj = {};
        if (params.sortField)
            sortObj = JSON.parse('{ "' + params.sortField + '": "' + params.sortOrder + '" }');
        return {
            sort: sortObj,
            offset: params.$top | 0,
            limit: params.$skip | 10
        }
    }

};

module.exports = repository;
