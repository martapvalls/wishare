const { validate, errors: { ConflictError } } = require('wishare-util')
const { models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

/**
 * Allow users to be registered by completing the formulary fields
 * 
 * @param {string} name 
 * @param {string} surname 
 * @param {string} email 
 * @param {string} year
 * @param {string} month
 * @param {string} day
 * @param {string} password
 * @param {string} passwordconfirm
 * 
 * @returns {Promise}
 */

module.exports = function (name, surname, email, year, month, day, password, passwordconfirm) {
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(surname)
    validate.string.notVoid('surname', surname)
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(year)
    validate.string.notVoid('year', year)
    validate.string(month)
    validate.string.notVoid('month', month)
    validate.string(day)
    validate.string.notVoid('day', day)
    validate.string(password)
    validate.string.notVoid('password', password)
    validate.string(passwordconfirm)
    validate.string.notVoid('passwordconfirm', passwordconfirm)

    if(passwordconfirm !== password) throw new ConflictError('password do not matches')

    return (async () => {
        const user = await User.findOne({ email })

        if (user) throw new ConflictError(`user with email ${email} already exists`)

        const birthday = new Date(year,month-1,day, 2, 0, 0, 0)

        const hash = await bcrypt.hash(password,10)

        await User.create({ name, surname, email, birthday, password: hash })
    })()
}