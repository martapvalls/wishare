const { connect, disconnect } = require('mongoose')
const { ObjectId } = require('mongodb')

module.exports = {
    database: {
        connect(url) {
            return connect(url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
        },
        disconnect
    },
    models: require('./models'),
    ObjectId
}