const { validate, errors: { NotFoundError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')

/**
 * Method to block a friend wish 
 * 
 * @param {string} id of user 
 * @param {String} wishId wish
 * 
 * @returns {Promise}
 * 
 */

module.exports = function ( id, friendId, wishId ) {

    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new NotFoundError(`user with id ${id} not found`)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)
    if (!ObjectId.isValid(friendId)) throw new NotFoundError(`user with id ${friendId} not found`)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    if (!ObjectId.isValid(wishId)) throw new NotFoundError(`wish with id ${wishId} not found`)


    return (async () => {
        const user = await User.findById(id)        
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const friend = await User.findById(friendId)        
        if (!user) throw new NotFoundError(`user with id ${friendId} not found`)
        
        const wish = friend.wishes.find(wish => wish.id === wishId)        
        if (!wish) throw new NotFoundError(`user does not have wish with id ${wishId}`)

        wish.blocked = !wish.blocked
               
        await User.updateOne(
            { _id: ObjectId(friendId) },
            { $set: { "wishes.$[wish]" : wish} },
            { arrayFilters: [ { "wish._id": ObjectId(wishId)  } ]}
        )
        
        let index = user.savedWishes.findIndex(savedWish => savedWish.wish.id === wishId)
        user.savedWishes[index].wish.blocked = !user.savedWishes[index].wish.blocked

        user.save()
    })()
}