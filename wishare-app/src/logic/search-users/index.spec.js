const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const searchUsers = require('.')
const { errors: { NotFoundError, ContentError, ConflictError } } = require('wishare-util')
const { database, ObjectId, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - search users', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let name, token, password1, id, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, friendId

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        name1 = `namefriend-${random()}`
        surname1 = `surnamefriend-${random()}`
        email1 = `emailfriend-${random()}@mail.com`
        password1 = `passwordfriend-${random()}`
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
        
        user.friends.push(ObjectId(friendId))

        await user.save()
    })

    it('should succeed on correct retrieving users', async () => {

        const friends = await searchUsers(email1)
        expect(friends).toBeDefined()
        expect(friends).toHaveLengthGreaterThan(0)

        friends.forEach(friend => {
            
            expect(friend).toBeDefined()
            expect(friend.id).toBe(friendId)
            expect(friend.id).toBeOfType('string')
            //expect(friend._id).to.not.exist

            expect(friend.name).toBe(name1)
            expect(friend.name).toBeOfType('string')

            expect(friend.surname).toBe(surname1)
            expect(friend.surname).toBeOfType('string')

            expect(friend.email).toBe(email1)
            expect(friend.email).toBeOfType('string')

            expect(Date(friend.birthday)).toBe(Date(birthday1))
            expect(friend.birthday).toBeOfType('string')
        })

    })
    it('should fail on wrong query', async () => {
        const query = '012345678901234567890123'

        try {
            await searchUsers(query)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with email ${query} not found`)
        }
    })
    it('should fail on incorrect email data', () => {
        
        expect(() => searchUsers(1)).toThrow(TypeError, '1 is not a string')
        expect(() => searchUsers(true)).toThrow(TypeError, 'true is not a string')
        expect(() => searchUsers([])).toThrow(TypeError, ' is not a string')
        expect(() => searchUsers({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => searchUsers(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => searchUsers(null)).toThrow(TypeError, 'null is not a string')

        expect(() => searchUsers('')).toThrow(ContentError, 'query is empty or blank')
        expect(() => searchUsers(' \t\r')).toThrow(ContentError, 'query is empty or blank')
    })
    afterAll(() => User.deleteMany().then(database.disconnect))
})