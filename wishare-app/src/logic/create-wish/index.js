import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError, ConflictError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 * function to creat a new wish 
 * 
 * @param {String} title wish
 * @param {String} link wish
 * @param {String} price wish
 * @param {String} description wish 
 * 
 * @returns {Promise}
 * 
 */

//module.exports = function (token, title, link, price, description) {
export default function(token, title, link, price, description) { 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(title)
    validate.string.notVoid('title', title)

    validate.string(link)
    validate.string.notVoid('link', link)

    validate.string(price)
    validate.string.notVoid('price', price)

    validate.string(description)
    validate.string.notVoid('description', description)

    return (async () => {

        const res = await call(`${API_URL}/wishes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title, link, price, description })
        })

        if (res.status === 200){
            const wishId = JSON.parse(res.body)

            return wishId
        }

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)


        throw new Error(JSON.parse(res.body).message)

    })()
}