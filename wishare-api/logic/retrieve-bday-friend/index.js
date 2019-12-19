const { validate, errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')


/**
* Retrieves friends birthdays and calculates if less than a week remains
* 
* @param {ObjectId} id of the user
* 
* @returns {Array} of ids of the friends that meet the condition
*/

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const user = await User.findById(id).populate('birthdayFriends.user', 'name')

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const birthdays = user.birthdayFriends

        birthdays.forEach(birthday => {
            let birth = birthday.birthday
            const today = new Date
            const currentYear = today.getFullYear()
            birth.setFullYear(currentYear)
        })
        let response = []
        
        birthdays.forEach(birthday =>{
            let birth = birthday.birthday
            const week = 1575105566659
            const today = new Date
            const todayMillis = today.getTime()
            const birthdayMillis = birth.getTime()
            const counter = birthdayMillis - todayMillis

            if(counter < week && counter > 0) response.push({
                name: birthday.user.name, 
                id: birthday.user._id.toString(), 
                birthday: birthday.birthday.toLocaleDateString()
            })     
        })
        
        return response
    })()
}




