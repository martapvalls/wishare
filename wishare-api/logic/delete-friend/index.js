const { ObjectId, models: { User, Chat } } = require('wishare-data')
const { validate,  errors: { ContentError, NotFoundError }  } = require('wishare-util')

/**
 * Removes a friend from the friend list of the user
 * 
 * @param {string} id of user
 * @param {string} friendId id of the user friend 
 * 
 */

module.exports = (id, friendId) => {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)
    if (!ObjectId.isValid(friendId)) throw new ContentError(`${friendId} is not a valid id`)
    
    return ( async() => {

        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        
        const friend = user.friends.includes(ObjectId(friendId))
        
        if(!friend) throw new NotFoundError(`friend with id ${friendId} not found`)
        
        const friends = user.friends

        const friendRemove = friends.indexOf(ObjectId(friendId))

        friends.splice(friendRemove, 1)

        const friendBdayRemove = user.birthdayFriends.indexOf(ObjectId(friendId))

        user.birthdayFriends.splice(friendBdayRemove, 1)
        
        await user.save()

        const chat = await Chat.findOne({ owner: ObjectId(id) })

        const friendChatRemove = chat.users.indexOf(ObjectId(friendId))

        chat.users.splice(friendChatRemove, 1)

        await chat.save()

    })()
}