const { Schema, ObjectId } = require('mongoose')
const { validators: { isEmail } } = require('wishare-util')
const Wish = require('./wish')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: isEmail,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    wishes: [Wish],
    friends: [{
        type: ObjectId,
        ref: 'User'
    }],
    birthdayFriends: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        birthday: {
            type: Date,
        }
    }]   ,
    savedWishes: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        wish: Wish
    }],
    lastAccess: {
        type: Date
    }  
})