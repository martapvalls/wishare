const { Schema,  ObjectId } = require('mongoose')
const Message = require('./message')

module.exports = new Schema({
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    users: [{
        type: ObjectId,
        ref: 'User'
    }],
    message: [Message]
})