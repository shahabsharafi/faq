const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose = require('mongoose');

const config = require('./config'); // get our config file
const middleware = require('./web/middleware');
const router = require('./web/router'); // get our mongoose model

const app = express();

//seting
app.set('port', (process.env.PORT || config.port));
app.set('superSecret', config.secret); // secret variable
mongoose.connect(config.database); // connect to database



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan('dev'));

router.register({
    express: express,
    app: app,
    config: config
});
/*
app.use(function (req, res, next) {
    if (path.extname(req.path).length > 0) {
        // normal static file request
        next();
    }
    else {
        // redirect all html requests to `index.html`
        res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
    }
});
*/
app.listen(app.get('port'), function () {
    console.log('Angular2 fullstack listening on port ' + app.get('port'));
});
