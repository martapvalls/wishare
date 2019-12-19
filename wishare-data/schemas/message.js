const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
})