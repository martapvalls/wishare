import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { NotFoundError, CredentialsError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL


//module.exports = function(token, userId) {
export default function(token, userId){ 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(userId)
    validate.string.notVoid('userId', userId)

    return (async() => {
        const res = await call(`${API_URL}/chat/${userId}`, {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`}
        })
 
        if(res.status === 201){
            const chat= JSON.parse(res.body)
 
            return chat.chat
        }
 
        if(res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
 
        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)
 
        throw new Error(JSON.parse(res.body).message)
    })()
}