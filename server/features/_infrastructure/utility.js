module.exports.getODataInfo = function (url) {
    const URL = require('url');
    const parser = require("odata-parser");

    var oData = null;
    var queryString = URL.parse(url).query;
    if (queryString) {
        var f = decodeURIComponent(queryString);
        oData = parser.parse(f);
    }
    return oData;
}

module.exports.taskRunner = function (fnList, callback) {
    var _fn = function (fnList, callback) {
        if (fnList.length == 0) {
            if (callback)
                callback();
        } else {
            var fn = fnList.shift();
            fn(function (err) {
                if (err)
                    if (callback)
                        callback(err);
                _fn(fnList, callback);
            });
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

module.exports.random = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
