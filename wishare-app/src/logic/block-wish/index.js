const { validate, errors: { NotFoundError } } = require('wishare-util')
import call from '../../utils/call'//eslint-disable-line
const API_URL = process.env.REACT_APP_API_URL

/**
 * Method to block a friend wish 
 * 
 * @param {string} id user id 
 * @param {String} friendId friend id
 * @param {String} wishId wish id
 * 
 * @returns {Promise}
 * 
 */

//module.exports = function ( token, friendId, wishId ) {
export default function(token, friendId, wishId){ 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(friendId)
    validate.string.notVoid('friendId', friendId)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)

    return (async () => {
        const res = await call(`${API_URL}/wishes/${wishId}/${friendId}/blocked`, {
            method: 'PATCH',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if(res.status === 200) return

        if(res.status === 400) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)
    })()
}