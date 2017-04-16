var register = function (option) {
    
    const fs = require('fs');
    const p = require("path");
    var features = {};
    
    function loadModules(path) {
        fs.lstat(path, function(err, stat) {
            if (stat.isDirectory()) {
                // we have a directory: do a tree walk
                fs.readdir(path, function(err, files) {
                    var f, l = files.length;
                    for (var i = 0; i < l; i++) {
                        f = p.join(path, files[i]);
                        loadModules(f);
                    }
                });
            } else {
                // we have a file: load it
                var name = p.basename(path);
                if (name == 'index.js') {
                    var feature = require(path);
                    if (feature && feature.name && feature.register) {
                        feature.register(option);
                        features[feature.name] = feature;
                    }
                }                
            }
        });
    }
    
    loadModules(__dirname);
}

module.exports = {
  register: register
}
