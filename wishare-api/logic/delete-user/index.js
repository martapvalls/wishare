const { validate, errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, models: { User, Chat } } = require('wishare-data')
const fs = require('fs-extra')

/**
 * Deletes the user account
 * 
 * @param {ObjectId} id 
 * 
 * @returns {Promise} 
 */


module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const dir = `./data/users/${id}`
        fs.remove(dir)


        await User.deleteOne({ _id: id })

        await Chat.deleteOne({ owner: id })
    })()
}