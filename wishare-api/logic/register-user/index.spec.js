require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const registerUser = require('.')
const { random } = Math
const { errors: { ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - register user', () => {
    before(() => database.connect(TEST_DB_URL))

    let name, surname, email, year, month, day, birthday, password, passwordconfirm

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        passwordconfirm = password


        birthday = new Date(year,month-1,day, 2, 0, 0, 0)
        return User.deleteMany()
    })

    it('should succeed on correct credentials', async () => {
        const response = await registerUser(name, surname, email, year, month, day, password, passwordconfirm)

        expect(response).to.be.undefined

        const user = await User.findOne({ email })

        expect(user).to.exist

        expect(user.name).to.equal(name)
        expect(user.surname).to.equal(surname)
        expect(user.email).to.equal(email)
        expect(user.birthday.toString()).to.equal(birthday.toString())
        expect(user.birthday).to.instanceOf(Date)
        const match = await bcrypt.compare(password, user.password)
        expect(match).to.be.true
    })

    describe('when user already exists', () => {
        beforeEach(() => {
            let  year, month, day

            year = '1999'
            month = '1'
            day = '25'
            const birthday = new Date(`${year},${month},${day}`)

            User.create({ name, surname, email, birthday, password })
        })

        it('should fail on already existing user', async () => {
            try {
                await registerUser(name, surname, email, year, month, day, password, passwordconfirm)

                throw Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error.message).to.exist
                expect(typeof error.message).to.equal('string')
                expect(error.message.length).to.be.greaterThan(0)
                expect(error.message).to.equal(`user with email ${email} already exists`)
            }
        })
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => registerUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser([])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser('')).to.throw(ContentError, 'name is empty or blank')
        expect(() => registerUser(' \t\r')).to.throw(ContentError, 'name is empty or blank')

        expect(() => registerUser(name, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(name, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(name, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(name, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser(name, '')).to.throw(ContentError, 'surname is empty or blank')
        expect(() => registerUser(name, ' \t\r')).to.throw(ContentError, 'surname is empty or blank')

        expect(() => registerUser(name, surname, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser(name, surname, '')).to.throw(ContentError, 'e-mail is empty or blank')
        expect(() => registerUser(name, surname, ' \t\r')).to.throw(ContentError, 'e-mail is empty or blank')

        expect(() => registerUser(name, surname, email, 1)).to.throw (TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, email, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, email, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, email, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, email, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, email, null)).to.throw(TypeError, 'null is not a string')

        //expect(() => registerUser(name, surname, email, '')).to.throw(ContentError, 'year is empty or blank')
        //expect(() => registerUser(name, surname, email, ' \t\r')).to.throw(ContentError, 'year is empty or blank')

        expect(() => registerUser(name, surname, email, year, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, email, year, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, email, year, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, email, year, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, email, year, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, email, year, null)).to.throw(TypeError, 'null is not a string')


        //expect(() => registerUser(name, surname, email, year, '')).to.throw(ContentError, 'month is empty or blank')
        //expect(() => registerUser(name, surname, email, year, ' \t\r')).to.throw(ContentError, 'month is empty or blank')

        expect(() => registerUser(name, surname, email, year, month, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, email, year, month, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, email, year, month, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, email, year, month, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, email, year, month, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, email, year, month, null)).to.throw(TypeError, 'null is not a string')


        //expect(() => registerUser(name, surname, email, year, month,  '')).to.throw(ContentError, 'day is empty or blank')
        //expect(() => registerUser(name, surname, email, year, month, ' \t\r')).to.throw(ContentError, 'day is empty or blank')


        expect(() => registerUser(name, surname, email, year, month, day, '')).to.throw(ContentError, 'password is empty or blank')
        expect(() => registerUser(name, surname, email, year, month, day, ' \t\r')).to.throw(ContentError, 'password is empty or blank')

        expect(() => registerUser(name, surname, email, year, month, day, password, '')).to.throw(ContentError, 'passwordconfirm is empty or blank')
        expect(() => registerUser(name, surname, email, year, month, day, password, ' \t\r')).to.throw(ContentError, 'passwordconfirm is empty or blank')
    })

    after(() => User.deleteMany().then(database.disconnect))
})