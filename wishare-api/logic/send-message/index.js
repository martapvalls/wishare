const { ObjectId, models: { Chat, User, Message } } = require('wishare-data')
const { validate, errors: { ContentError, NotFoundError } } = require('wishare-util')


module.exports = function(userId, id, text) {
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(text)
    validate.string.notVoid('text', text)

    return (async() => {

        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const chat = await Chat.findOne({ "owner": ObjectId(id) })
        if (!chat) throw new NotFoundError(`chat with id ${id} not found`)

        const newMessage = new Message({ user: userId, text, date: new Date })
        chat.message.push(newMessage)
        await chat.save()

        return newMessage.id
    })()
}