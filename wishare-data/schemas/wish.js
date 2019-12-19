const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    buyer: {
        type: ObjectId,
        ref: 'User'
    },
    given: {
        type: Boolean,
        default: false,
        required: true
    },
    blocked: {
        type: Boolean,
        default: false,
        required: true
    },
    lastAccess: {
        type: Date
    } 
})