const { validate, errors: { NotFoundError, CredentialsError, ConflictError } } = require('wishare-util')
import call from '../../utils/call'//eslint-disable-line
const API_URL = process.env.REACT_APP_API_URL


/**
* Retrieves friends birthdays and calculates if less than a week remains
* 
* @param {String} token user id
* 
* @returns {Promise} with friends and wish data saved
*/

//module.exports = function (token) {
export default function(token) { 
    validate.string(token)
    validate.string.notVoid('token', token)

    return (async () => {

        const res = await call(`${API_URL}/friends/wishes`, {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`}
        })

        if(res.status === 200){
            const savedWishes = JSON.parse(res.body)
 
            return savedWishes
        }

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}
