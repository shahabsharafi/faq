const request = require("request");
const NodeCache = require("node-cache");
const URL = require('url');
const parser = require("odata-parser");

const myCache = new NodeCache();

module.exports.getODataInfo = function (url) {
    var oData = null;
    var queryString = URL.parse(url).query;
    if (queryString) {
        var f = decodeURIComponent(queryString);
        oData = parser.parse(f);
    }
    return oData;
}

var getCode = function (mobile, successHandller, errHandller) {
    var key = 'mobile_' + mobile;
    myCache.get(key, function (err, value) {
        if (!err) {
            if (value == undefined) {
                if (errHandller) errHandller();
            } else {
                if (successHandller) successHandller(value);
            }
        } else {
            if (errHandller) errHandller();
        }
    });
}
module.exports.getCode = getCode;

module.exports.checkCode = function (mobile, code, successHandller, errHandller) {
    getCode(mobile, function (value) {
        if (value.code == code) {
            if (successHandller) successHandller(value);
        } else {
            if (errHandller) errHandller();
        }
    }, function () {
        if (errHandller) errHandller();
    });
}

module.exports.createCode = function (mobile, successHandller, errHandller) {
    var key = 'mobile_' + mobile;
    getCode(mobile, successHandller, function () {
        var obj = {
            code: random(1000, 9999)
        };
        myCache.set(key, obj, 180, function (err, success) {
            if (!err && success) {
                if (successHandller) successHandller(obj);
            } else {
                if (errHandller) errHandller();
            }
        }, successHandller);
    })
}


module.exports.taskRunner = function (fnList, callback) {
    var _fn = function (fnList, callback) {
        if (fnList.length == 0) {
            if (callback)
                callback();
        } else {
            var item = fnList.shift();
            if (typeof(item) === 'function') {
                var fn = item;
                fn(function (err) {
                    if (err)
                        if (callback)
                            callback(err);
                    _fn(fnList, callback);
                });
            } else  {
                var fn = item.fn;
                var params = item.params;
                fn(params, function (err) {
                    if (err)
                        if (callback)
                            callback(err);
                    _fn(fnList, callback);
                });
            }
        }
    }
    _fn(fnList, callback);
}


module.exports.insertTree = function (list, callback) {

    var _insertObject = function (obj, callback) {
        obj.content.save(function (err, doc) {
            if (err) throw err;
            if (obj.children) {
                _insertTreeList(obj.children, doc._id, callback);
            } else {
                if (callback)
                    callback();
            }
        });
    }

    var _insertTreeList = function (list, parentId, callback) {
        if (list.length == 0) {
            if (callback)
                callback();
        } else {
            var item = list.pop();
            if (parentId) item.content.parentId = parentId;
            _insertObject(item, function () {
                _insertTreeList(list, parentId, callback)
            });
        }
    }

    _insertTreeList(list, null, callback);
}

module.exports.insertList = function (list, callback) {
    var _fn = function (list, callback) {
        if (list.length == 0) {
            if (callback)
                callback();
        } else {
            var item = list.pop();
            item.save(function (err, doc) {
                if (err) throw err;
                _fn(list, callback);
            });
        }
    }
    _fn(list, callback);
}

var random = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
module.exports.random = random;
