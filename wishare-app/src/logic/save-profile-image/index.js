require('dotenv').config()
const { validate } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

/**
* Saves user profile image.
* 
* @param {String} token
* @param {Stream} file
* @param {Sting} filename 
*
* @returns {Promise} - user.  
*/


//module.exports = function (token, image) {
export default function(token, image){ 
    validate.string(token)
    validate.string.notVoid('token', token)

    let fData = new FormData()
    fData.append('image', image);

    let profileImage = false

    return (async () => {

        const res = await fetch(`${API_URL}/users/uploadimage`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`},
            body: fData
        })
        if (res.status === 200){
            profileImage = true
            return profileImage
        } 
    })()
}

