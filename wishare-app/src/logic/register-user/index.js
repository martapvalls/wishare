import call from '../../utils/call'//eslint-disable-line
const { validate, errors: { ConflictError } } = require('wishare-util')
const API_URL = process.env.REACT_APP_API_URL

//module.exports = function (name, surname, email, year, month, day, password, passwordconfirm) {
export default function(name, surname, email, year, month, day, password, passwordconfirm) { 
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(surname)
    validate.string.notVoid('surname', surname)
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(year)
    validate.string.notVoid('year', year)
    validate.string(month)
    validate.string.notVoid('month', month)
    validate.string(day)
    validate.string.notVoid('day', day)
    validate.string(password)
    validate.string.notVoid('password', password)
    validate.string(passwordconfirm)
    validate.string.notVoid('passwordconfirm', passwordconfirm)

    if (passwordconfirm !== password) throw new ConflictError('password do not matches')

    return (async () => {

        const res = await call(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, year, month, day, password, passwordconfirm })
        })
        if (res.status === 201) return

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()


}