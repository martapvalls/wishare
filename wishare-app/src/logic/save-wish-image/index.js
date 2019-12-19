require('dotenv').config()
const { validate } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL



/**
* Saves wish image.
* 
* @param {String} token of user
* @param {String} wishId id of wish
* @param {Stream} file data of the image
* @param {Sting} filename name of the image
*
* @returns {Promise} - user.  
*/


//module.exports = function (token, wishId, image) {
export default function(token, wishId, image) { 
    validate.string(token)
    validate.string.notVoid('token', token)
    
    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    
    let fData = new FormData()
    fData.append('image', image);

    return (async () => {
            const res = await fetch(`${API_URL}/wishes/upload/${wishId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fData
            })
            if (res.status === 201) return   

    })()
}
