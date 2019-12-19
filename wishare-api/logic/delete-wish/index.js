const { validate, errors: { NotFoundError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')
const fs = require('fs')
const path = require('path')

/**
 * Deletes the indicated wish of the user
 * 
 * @param {ObjectId} id of user
 * @param {ObjectId} wishId wish id
 * 
 * @returns {Promise} 
 */


module.exports = function (id, wishId) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new NotFoundError(`user with id ${id} not found`)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    if (!ObjectId.isValid(wishId)) throw new NotFoundError(`wish with id ${wishId} not found`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const wish = user.wishes.find(wish => wish.id === wishId)
        if (!wish) throw new NotFoundError(`user does not have wish with id ${wishId}`)
        
        const file = path.join(__dirname, `../../data/users/${id}/wishes/${wishId}.png`)
        fs.unlinkSync(file) 

        await User.updateOne(
            { _id: ObjectId(id) },
            { $pull: { wishes: { _id: ObjectId(wishId) } } }
          )

    })()
}