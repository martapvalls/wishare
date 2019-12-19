const { validate, errors: { CredentialsError, ConflictError, NotFoundError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL
import call from '../../utils/call'//eslint-disable-line

/**
 * Removes a friend from the friend list of the user
 * 
 * @param {string} id of user
 * @param {string} friendId id of the user friend 
 * 
 */

//module.exports = (token, friendId) => {
export default function(token, friendId){ 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)
    
    return ( async() => {
        const res = await call(`${API_URL}/friends/${friendId}`, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if(res.status === 200) return

        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

    })()
}