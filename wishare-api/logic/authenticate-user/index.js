const { validate, errors: { CredentialsError } } = require('wishare-util')
const { models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

/**
 * Authenticates a user by her/his email and password.
 * 
 * @param {string} email 
 * @param {string} password 
 * 
 * @returns {Promise} with user id
 */

module.exports = function (email, password) {
    validate.string(email)
    validate.string.notVoid('email', email)
    validate.string(password)
    validate.string.notVoid('password', password)

    return (async () => {
        const user = await User.findOne({ email })
        if (!user) throw new CredentialsError('wrong e-mail')

        const match = await bcrypt.compare(password, user.password)
        if(!match) throw new CredentialsError ('wrong password')

        return user.id
    })()
}