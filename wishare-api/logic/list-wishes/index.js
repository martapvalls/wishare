const { validate, errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')

/**
 * Retrieves all user wishes
 * 
 * @param {String} id of the user
 * 
 * @returns {Promise} with all user wishes
 */

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)


    return (async () => {
        
        const user = await User.findById(id).lean()        
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const wishes = user.wishes
            
        if (!wishes) throw new NotFoundError(`wishes not found`)

        wishes.forEach(wish => {
            wish.id = wish._id.toString()
            delete wish._id
            //delete wish.blocked
        })

        return wishes
        
    })()
}