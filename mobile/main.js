var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var getUser = function () {
    var key = getParameterByName('key');
    var request = new XMLHttpRequest();
    request.open("get", "/api/accounts/finduserbykey?key=" + key, false);
    request.send();
    var obj = JSON.parse(request.responseText);
    return obj.message;
}

var go = function () {
    var key = getParameterByName('key');
    var queryString = '?key=' + key + '&chash=' + document.getElementById('txt').value + '&code=12345';
    var url = '94.182.227.163:2020' + queryString;
    request.open("get", url, false);
    request.send();
    var obj = JSON.parse(request.responseText);
    return obj.message;
}
