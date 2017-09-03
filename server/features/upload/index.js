var register = function (option) {

    const multer = require('multer');
    const Guid = require('guid');
    const config = require('../../config');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, config.uploadPath)
        },
        filename: function (req, file, cb) {
            var guid = Guid.create();
            var ext = file.originalname.split('.').pop();
            cb(null, guid.value + '.' + ext)
        }
    })

    const upload = multer({ dest: config.uploadPath, storage: storage });
    const fs = require('fs');

    option.app.post('/uploads', upload.any(), (req, res) => {
        console.log('form data', req.body, req.files);
        res.status(200).json({ success: true });
    });
}

module.exports = {
    name: 'upload',
    register: register
};
