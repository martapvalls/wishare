require('dotenv').config()
const { validate, errors: { ContentError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')
const fs = require('fs')
const path = require('path')

/**
* Load the user profile image
* 
* @param {ObjectId} id of the user
*
* @returns {Promise} - data of image  
*/


module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)

    return (async () => {
        const user = await User.findById(id)
        if (!user) throw new Error(`user with id ${id} not found`)

        let goTo = path.join(__dirname, `../../data/users/${id}/profile.png`)
        try {
            if (fs.existsSync(goTo)) {
                return fs.createReadStream(goTo)
            } else {
                const defaultImage = path.join(__dirname, `../../data/users/defaultimage/profile.png`)
                return fs.createReadStream(defaultImage)
            }
        } catch (error) {
        }

    })()
}