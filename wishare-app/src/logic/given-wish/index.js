import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 * function to mark a wish as given 
 * 
 * @param {string} token of user 
 * @param {String} wishId wish
 * 
 * @returns {Promise}
 * 
 */

//module.exports = function ( token, wishId ) {
export default function(token, wishId) { 
    validate.string(token)
    validate.string.notVoid('token', token)
   
    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
   

    return (async () => {
        const res = await call(`${API_URL}/wishes/${wishId}/given`, {
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