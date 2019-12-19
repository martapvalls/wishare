require('dotenv').config()
const { validate } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')
const fs = require('fs')
const path = require('path')

/**
* Saves user profile image.
* 
* @param {ObjectId} id
* @param {Stream} file
* @param {Sting} filename 
*
* @returns {Promise} - user.  
*/


module.exports = function (id, file, filename) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)


    return (async () => {
        const user = await User.findById(id)
        if (!user) throw new Error(`user with id ${id} not found`)

            let saveTo = path.join(__dirname, `../../data/users/${id}/` + filename + '.png')
            return file.pipe(fs.createWriteStream(saveTo))            
    })()
}

