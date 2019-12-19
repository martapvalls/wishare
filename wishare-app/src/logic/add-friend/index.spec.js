const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const addFriend = require('.')
const { errors: { NotFoundError, ContentError, ConflictError } } = require('wishare-util')
const { database, ObjectId, models: { User, Chat } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - add friend', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, chat, friendId, token, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, password1

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
        email1 = `email-${random()}@mail.com`
        password1 = `password-${random()}`
        year1 = '1999'
        month1 = '1'
        day1 = '25'

        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        await Promise.all([User.deleteMany(), Chat.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub: id }, TEST_SECRET)

        friendId = friend.id

        chat = await Chat.create({ owner: id })
    })

    it('should succeed on correct friend adding', async () => {

        const response = await addFriend(token, friendId)

        expect(response).toBeUndefined()

        const _user = await User.findById(id)

        const _friend = _user.friends.find(friend => friend._id.toString() === friendId)

        expect(_friend).toBeDefined()

        expect(friendId.toString()).toBe(_friend.toString())

        expect(_user.friends).toBeDefined()
        expect(_user.friends.length).toBeGreaterThan(0)

        const _chat = await Chat.findOne({ owner: ObjectId(id) })

        expect(_chat.users[0].toString()).toContain(friendId)

    })

    it('should fail on adding a friend who was already been added', async () => {
        try {
            const _user = await User.findById(id)
            _user.friends.push(ObjectId(friendId))

            await addFriend(token, friendId)
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ConflictError)
            expect(error.message).toBe(`friend with id ${friendId} is already added`)

        }
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await addFriend(token, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong friend id ', async () => {
        const friendId = '012345678901234567890123'

        try {
            await addFriend(token, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${friendId} not found`)
        }
    })

    it('should fail on incorrect id and friendId data', () => {
        const wrongId = 'wrongid'

        expect(() => addFriend(1)).toThrow(TypeError, '1 is not a string')
        expect(() => addFriend(true)).toThrow(TypeError, 'true is not a string')
        expect(() => addFriend([])).toThrow(TypeError, ' is not a string')
        expect(() => addFriend({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => addFriend(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => addFriend(null)).toThrow(TypeError, 'null is not a string')

        expect(() => addFriend('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => addFriend(' \t\r')).toThrow(ContentError, 'id is empty or blank')
        
        expect(() => addFriend(token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => addFriend(token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => addFriend(token, [])).toThrow(TypeError, ' is not a string')
        expect(() => addFriend(token, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => addFriend(token, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => addFriend(token, null)).toThrow(TypeError, 'null is not a string')

        expect(() => addFriend(token, '')).toThrow(ContentError, 'friendId is empty or blank')
        expect(() => addFriend(token, ' \t\r')).toThrow(ContentError, 'friendId is empty or blank')
    })

    afterAll(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})