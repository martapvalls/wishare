const { ObjectId, models: { User } } = require('wishare-data')
const { validate,  errors: { ContentError, NotFoundError, ConflictError }  } = require('wishare-util')

/**
 * Saves a wish from a friend in a user saved wishes list
 * 
 * @param {ObjectId} id of user
 * @param {ObjectId} friendId of user friend 
 * @param {ObjectId} wishId of user friend wish
 * 
 */

module.exports = (id, friendId, wishId) => {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)
    if (!ObjectId.isValid(friendId)) throw new ContentError(`${friendId} is not a valid id`)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    if (!ObjectId.isValid(wishId)) throw new ContentError(`${wishId} is not a valid id`)
    
    return ( async() => {

        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const friend = await User.findById(friendId)

        if(!friend) throw new NotFoundError(`there is no friend with id ${friendId}`)

        const wish = friend.wishes.find(wish => wish.id === wishId)        
        if (!wish) throw new NotFoundError(`friend does not have wish with id ${wishId}`)

        const savewish = user.savedWishes.find(wish => wish.wish.toString() === wishId)
        
        if (savewish) throw new ConflictError(`already saved wish with id ${wishId}`)

        user.savedWishes.push({user: friendId, wish})

        
        await user.save()        
        
    })()
}
