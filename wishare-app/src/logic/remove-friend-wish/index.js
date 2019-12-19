const { validate, errors: { NotFoundError, CredentialsError, ConflictError } } = require('wishare-util')
import call from '../../utils/call'//eslint-disable-line
const API_URL = process.env.REACT_APP_API_URL

/**
 * Removes the indicated wish from the saved friend wishes list of the user
 * 
 * @param {String} token of user
 * @param {String} friendId of user friend 
 * @param {String} wishId of user friend wish
 * 
 */
//module.exports = (token, friendId, wishId) => {
export default function(token, friendId, wishId) { 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    
    return ( async() => {

        const res = await call(`${API_URL}/friends/wish/${friendId}`, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ wishId })
        })
        if(res.status === 200) return

        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        if(res.status === 400) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 409) throw new ConflictError(JSON.parse(res.body).message)   
        
    })()
}
