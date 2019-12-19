const { ObjectId, models: { User } } = require('wishare-data')
const { validate,  errors: { ContentError, NotFoundError, ConflictError }  } = require('wishare-util')

/**
 * Removes the indicated wish from the saved friend wishes list of the user
 * 
 * @param {String} token of user
 * @param {String} friendId of user friend 
 * @param {String} wishId of user friend wish
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

        const savewish = user.savedWishes.find(wish => wish.wish.id.toString() === wishId)
        if (!savewish) throw new ConflictError(`wish with id ${wishId} isn't saved`)

        let index = user.savedWishes.findIndex(savedWish => savedWish.wish.id === wishId)

        user.savedWishes.splice(index, 1)
       
        await user.save()


        //
        
        const wishb = friend.wishes.find(wishb => wishb.id === wishId)        

        wishb.blocked = false
               
        await User.updateOne(
            { _id: ObjectId(friendId) },
            { $set: { "wishes.$[wish]" : wishb} },
            { arrayFilters: [ { "wish._id": ObjectId(wishId)  } ] }
        )
        
    })()
}
