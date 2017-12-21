var register = function (option) {

    const config = require('../../config'); // get our config file
    const Email = require('./email');
    const nodemailer = require('nodemailer');
    var router = option.express.Router();

    router.post('/send', function (req, res) {
        var transporter = nodemailer.createTransport(config.email_option);

        var mailOptions = {
          from: config.contact_email,
          to: config.contact_email,
          subject: req.body.subject,
          text: req.body.text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.send_err();
            } else {
                res.send_ok({
                    success: true,
                    message: 'Email sent: ' + info.response
                });
            }
        });
    });

    option.app.use('/api/email', router);
}

module.exports = {
    name: 'email',
    register: register
};
