import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError, CredentialsError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 * Retrieves users that matches the email with the query provided.
 * 
 *@param {String} email of user that want to be searched
 *
 *@returns {Promise} with friends matched
 */

//module.exports = function (query) {
export default function(query){ 
    validate.string(query)
    validate.string.notVoid('query', query)

    return (async () => {

        const res = await call(`${API_URL}/users/search/${query}`, {
            method: 'GET'
        })

        if(res.status === 200){
            const users = JSON.parse(res.body)
 
            return users
        }
 
        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
 
        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)
 
        throw new Error(JSON.parse(res.body).message)

    })()
}