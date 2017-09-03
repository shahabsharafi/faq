'use strict'

const config = {
    secret: 'ilovescotchyscotch',
    database: 'mongodb://127.0.0.1:27017/faq1',
    port: 4000,
    uploadPath: __dirname + '/../../dist/uploads'
}

module.exports = Object.assign({}, config)
