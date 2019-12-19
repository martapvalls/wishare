const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const retrieveUser = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User, Chat } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - retrieve user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, name, surname, email, year, month, day, birthday, password

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = 1999
        month = 1
        day = 25

        birthday = new Date(year,month-1,day, 2, 0, 0, 0)

        await Promise.all([User.deleteMany(), Chat.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

    })

    it('should succeed on correct user id', async () => {
        const user = await retrieveUser(token)

        expect(user).toBeDefined()
        expect(user.id).toBe(id)
        expect(user.id).toBeOfType('string')
        expect(user._id).toBeUndefined()
        expect(user.name).toBe(name)
        expect(user.name).toBeOfType('string')
        expect(user.surname).toBe(surname)
        expect(user.surname).toBeOfType('string')
        expect(user.email).toBe(email)
        expect(user.email).toBeOfType('string')
        expect(Date(user.birthday)).toBe(Date(birthday))
        expect(user.birthday).toBeOfType('string')
        expect(user.lastAccess).toBeDefined()
        expect(user.lastAccess).toBeOfType('string')
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await retrieveUser(token)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id data', () => {

        expect(() => retrieveUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveUser([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveUser(null)).toThrow(TypeError, 'null is not a string')
    
        expect(() => retrieveUser('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => retrieveUser(' \t\r')).toThrow(ContentError, 'id is empty or blank')
    
     })

    afterAll(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})