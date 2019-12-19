import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError, CredentialsError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL


/**
 * Retrieves all user friends by its token.
 * 
 * @returns {Promise}
 */

//module.exports = function (token) {
export default function(token) { 
    validate.string(token)
    validate.string.notVoid('token', token)
 
    return (async () => {

        const res = await call(`${API_URL}/friends`, {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`}
        })
 
        if(res.status === 200){
            const friends = JSON.parse(res.body)
 
            return friends
        }
 
        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
 
        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)
 
        throw new Error(JSON.parse(res.body).message)
     })()

}