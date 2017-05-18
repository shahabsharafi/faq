module.exports.getODataInfo = function (url) {
    const URL = require('url');
    const parser = require("odata-parser");

    var oData = null;
    var queryString = URL.parse(url).query;
    if (queryString) {
        var f = decodeURIComponent(queryString);
        oData = parser.parse(f);
        console.log(oData);
    }
    return oData;
}
