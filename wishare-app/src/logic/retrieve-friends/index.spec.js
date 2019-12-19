const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const retrieveFriends = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - retrieve friends', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let friendIds, password1, friendId, friend2Id, token, id, email2, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1

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
        password1 = `password-${random()}`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        email2 = `email22-${random()}@mail.com`

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        friendId = friend.id
        friend2Id = friend2.id

        friendIds= [friendId, friend2Id]

        user.friends.push(friendId.toString())
        user.friends.push(friend2Id.toString())

        await user.save()
    })

    it('should succeed on correct friends retreiving', async () => {
        const friends = await retrieveFriends(token)

        expect(friends).toBeDefined()
 
        friends.forEach(friend => {
            expect(friend.id).toBeDefined()
            expect(friend.id).toBeOfType('string')
            expect(friend.id).toHaveLengthGreaterThan(0)
            expect(friend.id).toBeOneOf(friendIds)

            expect(friend.name).toBeDefined()
            expect(friend.name).toBeOfType('string')
            expect(friend.name).toHaveLengthGreaterThan(0)

            expect(friend.email).toBeDefined()
            expect(friend.email).toBeOfType('string')
            expect(friend.email).toHaveLengthGreaterThan(0)
        })
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await retrieveFriends(token)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id data', () => {

        expect(() => retrieveFriends(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveFriends(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveFriends([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveFriends({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriends(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveFriends(null)).toThrow(TypeError, 'null is not a string')
    
        expect(() => retrieveFriends('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => retrieveFriends(' \t\r')).toThrow(ContentError, 'id is empty or blank')
            
     })

    afterAll(() => User.deleteMany().then(database.disconnect))
})