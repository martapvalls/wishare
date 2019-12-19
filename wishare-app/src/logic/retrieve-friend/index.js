import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError, CredentialsError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL


/**
* Retrieves the user data
* 
* @param {string} token of the user
* @param {string} friendId of the user
* 
* @returns {Promise} with data of the friend
*/

//module.exports = function (token, friendId) {
export default function(token, friendId){ 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)

    return (async () => {
        const res = await call(`${API_URL}/friends/${friendId}`, {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`}
        })
 
        if(res.status === 200){
            const friend = JSON.parse(res.body)
 
            return friend
        }
 
        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
 
        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)
 
        throw new Error(JSON.parse(res.body).message)
    })()
}
