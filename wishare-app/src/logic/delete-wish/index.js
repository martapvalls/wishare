import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError, CredentialsError, ConflictError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Deletes the indicated wish of the user
 * 
 * @param {String} token of user
 * @param {String} wishId wish id
 * 
 * @returns {Promise} 
 */


//module.exports = function (token, wishId) {
export default function(token, wishId) { 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)

    return (async () => {
        const res = await call(`${API_URL}/wishes/${wishId}`, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if(res.status === 200) return

        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        if(res.status === 400) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 409) throw new ConflictError(JSON.parse(res.body).message)
    })()
}