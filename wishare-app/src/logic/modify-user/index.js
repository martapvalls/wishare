const { validate, errors: { CredentialsError, ConflictError, NotFoundError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL
import call from '../../utils/call'//eslint-disable-line

/**
* Allow users to update their profile information like birthday, profile image or description.
*
* @param {String} token
* @param {String} year
* @param {String} month
* @param {String} day
* @param {String} password
* @param {String} description
*
* @returns {Promise} - user.  
*/

//module.exports = function (token, year , month, day, password, description) {
export default function(token, year, month, day, password, description){ 
    validate.string(token)
    validate.string.notVoid('token', token)

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
        const res = await call(`${API_URL}/users/update`, {
            method: 'PATCH',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({year, month, day, password, description})
        })

        if(res.status === 200) return

        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        if(res.status === 400) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

    })()
}