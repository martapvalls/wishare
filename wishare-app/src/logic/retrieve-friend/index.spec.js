const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const retrieveFriend = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - retrieve friends', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, friendId, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        name1 = `name-${random()}`
        surname1 = `surname-${random()}`
        email1 = `email111-${random()}@mail.com`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        
        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        friendId = friend.id

        user.friends.push(friendId.toString())

        await user.save()
    })

    it('should succeed on correct user id', async () => {

        const friend = await retrieveFriend(token, friendId)

        expect(friend).toBeDefined()

        expect(friend.friendId).toBeDefined()
        expect(friend.friendId).toBeOfType('string')
        expect(friend.friendId).toHaveLengthGreaterThan(0)
        expect(friend.friendId).toBe(friendId)

        expect(friend.name).toBeDefined()
        expect(friend.name).toBeOfType('string')
        expect(friend.name).toHaveLengthGreaterThan(0)

        expect(friend.email).toBeDefined()
        expect(friend.email).toBeOfType('string')
        expect(friend.email).toHaveLengthGreaterThan(0)

        expect(friend.birthday).toBeDefined()
        expect(friend.birthday).toBeOfType('string')
        expect(friend.birthday).toHaveLengthGreaterThan(0)

        expect(friend.wishes).toBeDefined()

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await retrieveFriend(token, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong user id', async () => {
        const friendId = '012345678901234567890123'

        try {
            await retrieveFriend(token, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${friendId} not found`)
        }
    })
    it('should fail on incorrect id data', () => {
        expect(() => retrieveFriend(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveFriend(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveFriend([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveFriend({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriend(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveFriend(null)).toThrow(TypeError, 'null is not a string')

        expect(() => retrieveFriend('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => retrieveFriend(' \t\r')).toThrow(ContentError, 'id is empty or blank')

        expect(() => retrieveFriend(id, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveFriend(id, true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveFriend(id, [])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveFriend(id, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriend(id, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveFriend(id, null)).toThrow(TypeError, 'null is not a string')

        expect(() => retrieveFriend(id, '')).toThrow(ContentError, 'friendId is empty or blank')
        expect(() => retrieveFriend(id, ' \t\r')).toThrow(ContentError, 'friendId is empty or blank')

    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})