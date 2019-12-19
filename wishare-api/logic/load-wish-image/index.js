require('dotenv').config()
const { validate } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')
const fs = require('fs')
const path = require('path')

/**
* Load the wish image
* 
* @param {ObjectId} id of the user
* @param {ObjectId} wishId id of the wish
* @returns {Promise} - data of image  
*/


module.exports = function (id, wishId) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    if (!ObjectId.isValid(wishId)) throw new ContentError(`${wishId} is not a valid id`)

    
    
    return (async () => {
        const user = await User.findById(id)
        if (!user) throw new Error(`user with id ${id} not found`)
        
        const wish = user.wishes.find(wish => wish.id === wishId)
        if (!wish) throw new NotFoundError(`user does not have task with id ${wishId}`)

        let goTo = path.join(__dirname, `../../data/users/${id}/wishes/${wishId}.png`)
        return fs.createReadStream(goTo)

    })()
}

