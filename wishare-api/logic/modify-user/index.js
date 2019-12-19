const { validate, errors: { ContentError, NotFoundError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

/**
* Allow users to update their profile information like birthday, profile image or description.
*
* @param {ObjectId} id
* @param {String} year
* @param {String} month
* @param {String} day
* @param {String} password
* @param {String} description
*
* @returns {Promise} - user.  
*/

module.exports = function (id, day, month, year, password, description) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)


    if (year) {
        validate.string(year)
        validate.string.notVoid('year', year)
    }
    if (month) {
        validate.string(month)
        validate.string.notVoid('month', month)
    }
    if (day) {
        validate.string(day)
        validate.string.notVoid('day', day)
    }
    if (password) {
        validate.string(password)
        validate.string.notVoid('password', password)
    }
    if (description) {
        validate.string(description)
        validate.string.notVoid('description', description)
    }

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const update = {}

        const birthday = new Date(year,month-1,day, 2, 0, 0, 0)

        year && month && day && (update.birthday = birthday)

        if(password){
            const hash = await bcrypt.hash(password,10)
            update.password = hash
        }     
        description && (update.description = description)

        update.lastAccess = new Date

        await User.updateOne({ _id: id }, { $set: update })

    })()
}