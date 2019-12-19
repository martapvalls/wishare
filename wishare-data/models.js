const { model } = require('mongoose')
const { user, wish, chat, message } = require('./schemas')

module.exports = {
    User: model('User', user),
    Wish: model('Wish', wish),
    Chat: model('Chat', chat),
    Message: model('Message', message)
}