const { validate, errors: { NotFoundError, CredentialsError, ConflictError } } = require('wishare-util')
import call from '../../utils/call'//eslint-disable-line
const API_URL = process.env.REACT_APP_API_URL


//module.exports = function(token, userId, text) {
export default function(token, userId, text){ 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(userId)
    validate.string.notVoid('userId', userId)

    validate.string(text)
    validate.string.notVoid('text', text)

    return (async() => {

        const res = await call(`${API_URL}/chat/message/${userId}`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        })
        if (res.status === 201) return

        if(res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}