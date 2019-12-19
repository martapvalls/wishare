const { validate, errors: { ContentError, NotFoundError } } = require('wishare-util')
const { ObjectId, models: { Chat, User } } = require('wishare-data')


module.exports = function(id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async() => {
        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)  

        const chat = await Chat.create({ owner: id })

        return chat.id
    })()
}