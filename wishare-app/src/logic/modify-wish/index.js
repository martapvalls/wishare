import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError, CredentialsError, ConflictError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 * function to modify data of an existing wish 
 * 
 * @param {string} token of user 
 * @param {String} title wish
 * @param {String} link wish
 * @param {String} price wish
 * @param {String} description wish 
 * 
 * @returns {Promise}
 * 
 */

//module.exports = function ( token, wishId, title, link, price, description) {
export default function(token, wishId, title, link, price, description) { 
    validate.string(token)
    validate.string.notVoid('token', token)
   
    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    
    if(title){
    validate.string(title)
    validate.string.notVoid('title', title)}

    if(link){
    validate.string(link)
    validate.string.notVoid('link', link)}

    if(price){
    validate.string(price)
    validate.string.notVoid('price', price)}

    if(description){
    validate.string(description)
    validate.string.notVoid('description', description)}

    return (async () => {
        const res = await call(`${API_URL}/wishes/${wishId}`, {
            method: 'PATCH',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, link, price, description})
        })

        if(res.status === 200) return

        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if(res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

    })()
}