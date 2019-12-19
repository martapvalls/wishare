const { validate, errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')

/**
* Retrieves the user data
* 
* @param {ObjectId} id of the user
* @param {ObjectId} friendId of the user
* 
* @returns {Promise}
*/

module.exports = function (id, friendId) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)
    if (!ObjectId.isValid(friendId)) throw new ContentError(`${friendId} is not a valid id`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const friend = await User.findById(friendId)
        if (!friend) throw new NotFoundError(`user with id ${friendId} not found`)


        const { name, surname, email, description, wishes } = friend.toObject()
        wishes.forEach(wish => {
            wish.id = wish._id.toString()
            delete wish._id
            delete wish.blocked
        })
        let birthday = friend.birthday.toLocaleDateString()

        return { friendId, name, surname, email, birthday, description, wishes }
    })()
}
