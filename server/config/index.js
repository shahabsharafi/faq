'use strict'

const config = {
    secret: 'ilovescotchyscotch',
    database: 'mongodb://127.0.0.1:27017/faq1',
    port: 4000,
    uploadPath: __dirname + '/../../dist/uploads',
    suportVersion: '0.7',
    lastVersion: '0.7.2',
    email_option: {
        service: 'gmail',
        auth: {
            user: 'shahab.sharafi.porsane@gmail.com',
            pass: '1234@porsane'
        }
    },
    contact_email: 'shahab.sharafi.porsane@gmail.com'
}

module.exports = Object.assign({}, config)
