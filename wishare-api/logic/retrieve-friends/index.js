const { ObjectId, models: { User } } = require('wishare-data')
const { validate, errors: { ContentError, NotFoundError } } = require('wishare-util')

/**
 * Retrieves all user friends by its id.
 * 
 * 
 * @returns {Promise}
 */

 module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)


    return (async () => {

        const user = await User.findById(id).populate('friends', 'name surname email birthday wishes').lean()
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        user.friends.forEach(friend => { 
            friend.id = friend._id.toString()
            delete friend._id})


        return user.friends
    })()
}