require('dotenv').config()
const { validate } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')
const fs = require('fs')
const path = require('path')

/**
* Saves wish image.
* 
* @param {ObjectId} id of user
* @param {ObjectId} wishId id of wish
* @param {Stream} file data of the image
* @param {Sting} filename name of the image
*
* @returns {Promise} - user.  
*/


module.exports = function (id, wishId, file, filename) {
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
        
        // const dir = `./data/users/${id}/wishes`
        // if (!fs.existsSync(dir)){
        //     fs.mkdirSync(dir)
        // }
        let saveTo = path.join(__dirname, `../../data/users/${id}/wishes/${filename}.png`)
        return file.pipe(fs.createWriteStream(saveTo))            
    })()
}

