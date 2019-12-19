const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const modifyUser = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - modify user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, name, surname, email, year, month, day, birthday, password, description

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'

        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)
    })

    it('should succeed on correct user data', async () => {
        const newYear = '1991'
        const newMonth = '2'
        const newDay = '6'
        const newPassword = `new-password-${random()}`
        const newDescription = `new-description-${random()}`

        const response = await modifyUser(token, newYear, newMonth, newDay, newPassword, newDescription)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        let newbday = new Date(newYear, newMonth - 1, newDay, 2, 0, 0, 0)

        expect(user.birthday).toBeDefined()
        expect(user.birthday).toBeInstanceOf(Date)
        expect(user.birthday.toString()).toBe(newbday.toString())

        expect(user.password).toBeDefined()
        expect(user.password).toBeOfType('string')
        expect(user.password.length).toBeGreaterThan(0)
        const match = await bcrypt.compare(newPassword, user.password)
        expect(match).toBe(true)

        expect(user.description).toBeDefined()
        expect(user.description).toBeOfType('string')
        expect(user.description.length).toBeGreaterThan(0)
        expect(user.description).toBe(newDescription)

        expect(user.lastAccess).toBeDefined()
        expect(user.lastAccess).toBeInstanceOf(Date)

    })
    it('should succed on correct user and new data, except for birthday', async () => {
        const newPassword = `new-password-${random()}`
        const newDescription = `new-description-${random()}`

        const { birthday } = await User.findById(id)

        const response = await modifyUser(token, undefined, undefined, undefined, newPassword, newDescription)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        expect(user.birthday).toBeDefined()
        expect(user.birthday).toBeInstanceOf(Date)
        expect(user.birthday.toString()).toBe(birthday.toString())

        expect(user.password).toBeDefined()
        expect(user.password).toBeOfType('string')
        expect(user.password.length).toBeGreaterThan(0)
        const match = await bcrypt.compare(newPassword, user.password)
        expect(match).toBe(true)

        expect(user.description).toBeDefined()
        expect(user.description).toBeOfType('string')
        expect(user.description.length).toBeGreaterThan(0)
        expect(user.description).toBe(newDescription)
    })
    it('should succed on correct user and new data, except for password', async () => {
        const newYear = '1991'
        const newMonth = '2'
        const newDay = '6'
        const newDescription = `new-description-${random()}`

        const { password } = await User.findById(id)

        const response = await modifyUser(token, newYear, newMonth, newDay, undefined, newDescription)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        let newbday = new Date(newYear, newMonth - 1, newDay, 2, 0, 0, 0)

        expect(user.birthday).toBeDefined()
        expect(user.birthday).toBeInstanceOf(Date)
        expect(user.birthday.toString()).toBe(newbday.toString())

        expect(user.password).toBeDefined()
        expect(user.password).toBeOfType('string')
        expect(user.password.length).toBeGreaterThan(0)
        expect(user.password).toBe(password)

        expect(user.description).toBeDefined()
        expect(user.description).toBeOfType('string')
        expect(user.description.length).toBeGreaterThan(0)
        expect(user.description).toBe(newDescription)
    })
    it('should succed on correct user and new data, except for description', async () => {
        const newYear = '1991'
        const newMonth = '2'
        const newDay = '6'
        const newPassword = `new-password-${random()}`

        const { description } = await User.findById(id)

        const response = await modifyUser(token, newYear, newMonth, newDay, newPassword, undefined)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        let newbday = new Date(newYear, newMonth - 1, newDay, 2, 0, 0, 0)

        expect(user.birthday).toBeDefined()
        expect(user.birthday).toBeInstanceOf(Date)
        expect(user.birthday.toString()).toBe(newbday.toString())

        expect(user.password).toBeDefined()
        expect(user.password).toBeOfType('string')
        expect(user.password.length).toBeGreaterThan(0)
        const match = await bcrypt.compare(newPassword, user.password)
        expect(match).toBe(true)

        expect(user.description).toBe(description)
    })
    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {   
            await modifyUser(token, day, month, year, password, description)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            //expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id, year, month, day, password and description type and content', () => {

        expect(() => modifyUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyUser([])).toThrow(TypeError, ' is not a string')
        expect(() => modifyUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => modifyUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => modifyUser(null)).toThrow(TypeError, 'null is not a string')

        expect(() => modifyUser('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => modifyUser(' \t\r')).toThrow(ContentError, 'id is empty or blank')

        expect(() => modifyUser(token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyUser(token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyUser(token, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyUser(token, {})).toThrow(TypeError, '[object Object] is not a string')


        expect(() => modifyUser(token, year, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyUser(token, year, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyUser(token, year, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyUser(token, year, {})).toThrow(TypeError, '[object Object] is not a string')

        expect(() => modifyUser(token, year, month, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyUser(token, year, month, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyUser(token, year, month, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyUser(token, year, month, {})).toThrow(TypeError, '[object Object] is not a string')

        expect(() => modifyUser(token, year, month, day, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyUser(token, year, month, day, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyUser(token, year, month, day, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyUser(token, year, month, day, {})).toThrow(TypeError, '[object Object] is not a string')

        expect(() => modifyUser(token, year, month, day, password, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyUser(token, year, month, day, password, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyUser(token, year, month, day, password, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyUser(token, year, month, day, password, {})).toThrow(TypeError, '[object Object] is not a string')

    })
    afterAll(() => User.deleteMany().then(database.disconnect))
})