var register = function (option) {

    const data = require('./data.json');

    // get an instance of the router for api routes
    var router = option.express.Router();

    // route to return all roles (GET http://localhost:8080/api/menu)
    router.get('/', function (req, res) {
        var list = [];
        if (req.decoded && req.decoded._doc) {
            if (req.decoded._doc.isAdmin) {
                list = data;
            } else {
                var _checkAccess = function (node) {
                    var hasAccess = false;
                    for (var k = 0; k < req.decoded._doc.access.length; k++) {
                        var access = req.decoded._doc.access[k];
                        if (access == node.access) {
                            hasAccess = true;
                            break;
                        }
                    }
                    return hasAccess;
                }
                var list = [];
                for (var i = 0; i < data.length; i++) {
                    var menuItem = data[i];
                    var item = {
                        name: menuItem.name
                    };
                    if (menuItem.children) {
                        item.children = [];
                        for (var j = 0; j < menuItem.children.length; j++) {
                            var subMenuItem = menuItem.children[j];
                            if (subMenuItem.access) {
                                if (_checkAccess(subMenuItem)) {
                                    item.children.push(subMenuItem);
                                }
                            } else {
                                item.children.push(subMenuItem);
                            }
                        }
                        if (item.children.length > 0) {
                            list.push(item);
                        }
                    } else {
                        if (menuItem.access) {
                            if (_checkAccess(menuItem)) {
                                list.push(menuItem);
                            }
                        } else {
                            list.push(menuItem);
                        }
                    }
                }
            }
        }
        res.json(list);
    });

    option.app.use('/api/menu', router);
}

module.exports = {
    name: 'menu',
    register: register
};
