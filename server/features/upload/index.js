var register = function (option) {

    const multer = require('multer');
    const Guid = require('guid');
    const config = require('../../config');
    const Discussion = require('../discussion/discussion');

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

    var router = option.express.Router();

    router.post('/uploads', upload.any(), (req, res) => {
        var cb = function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json({ success: true });
            }
        }
        if (req.files && req.files.length) {
            console.log(1);
            console.log(req.decoded);
            var file = req.files[0];
            if (req.decoded && req.decoded._doc && req.decoded._doc.username) {
                console.log(2);
                Account.findOne( { username: req.decoded._doc.username }, function (err, owner) {
                    console.log(3);
                    if (req.body.EntityName == 'discussion') {
                        console.log(4);
                        var id = req.body.EntityKey;
                        Discussion.findOne({ _id: id }, function (err, oldEntity) {
                            console.log(5);
                            if (err) {
                                cb(err);
                            } else {
                                console.log(6);
                                var item = {
                                    owner: owner,
                                    createDate: new Date(),
                                    text: '',
                                    attachment: file.fileName
                                }
                                var items = oldEntity.items || [];
                                items.push(item);
                                oldEntity.items = items;
                                oldEntity.save(cb);
                            }
                        });
                    }  else {
                        cb({ success: false });
                    }
                });
            } else {
                cb({ success: false });
            }
        } else {
            cb({ success: false });
        }
    });
    option.app.use('/', router);
}

module.exports = {
    name: 'upload',
    register: register
};
