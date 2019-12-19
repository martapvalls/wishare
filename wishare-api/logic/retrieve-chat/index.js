const { ObjectId, models: { User, Chat } } = require('wishare-data')
const { validate, errors: { ContentError, NotFoundError } } = require('wishare-util')


module.exports = function(id, userId) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(id)) throw new ContentError(`${userId} is not a valid id`)

    return (async() => {
        const user = await Chat.findOne({ "users": ObjectId(id) })
        if (!user) throw new NotFoundError(`chat with id ${id} not found`)

        const chat = await Chat.findOne({ "owner": ObjectId(userId) }).populate('owner', 'name')

        if (!chat) throw new NotFoundError(`chat with id ${userId} not found`)

        const { owner, users, message } = chat.toObject()

        return { owner, users, message}

    })()
}