const { ObjectId, models: { User } } = require('wishare-data')
const { validate } = require('wishare-util')

/**
 * Retrieves all users by its id.
 * 
 * 
 * @returns {Promise}
 */

 module.exports = function () {

    return (async () => {

        let users = await User.find({ }, { password: 0, __v: 0 }).lean()

        if (!users) throw Error(`users not found`)

        users.forEach(user => { user.id = user._id.toString(); delete user._id })

        users.forEach(user => { 
            user.wishes.forEach(wish => {
                wish.id = wish._id.toString()
                delete wish._id
                //delete wish.blocked
            })  
        })

        return users
    })()
}