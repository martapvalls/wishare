import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { ConflictError, NotFoundError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Add a friend to the friend list of the user
 * 
 * @param {string} token of the user
 * @param {string} friendId of the friend that the user wants to remove 
 * 
 */

//module.exports = (token, friendId) => {
export default function(token, friendId) { 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)
    
    return ( async() => {

        const res = await call(`${API_URL}/friends/${friendId}`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
 
        if (res.status === 200) return

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}