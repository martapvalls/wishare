const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const sendMessage = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Chat } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - sendMessage', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let text, token, id, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, friend2Id, friendId, chatId, message1Id, message2Id, users, email2, birthday2

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
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        email2 = `email-${random()}@mail.com`
        birthday2 = new Date(1990, 11, 2, 2, 0, 0, 0)

        await Promise.all([User.deleteMany(), Chat.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday2, password: await bcrypt.hash(password, 10) })

        id = user.id

        
        friendId = friend.id
        friend2Id = friend2.id
        
        token = jwt.sign({ sub:friendId }, TEST_SECRET)
        users = [friendId, friend2Id]

        user.friends.push(friendId.toString())
        user.friends.push(friend2Id.toString())

        await user.save()

        const chat = await Chat.create({ owner: ObjectId(id), users: [ObjectId(friendId), ObjectId(friend2Id)]})

        chatId = chat.id

        await chat.save()

        text = "hey! what's up?"
    })

    it('should return a correct chat', async() => {

        const messageId = await sendMessage( token, id, text)

        const chat = await Chat.findOne({ "owner": ObjectId(id) })

        chat.message.forEach(element => {
            if (element.id === messageId) {
                expect(element).toBeDefined()
                expect(element.id).toBe(messageId)
                expect(element.user.toString()).toBe(id)
                expect(element.text).toBe("hey! what's up?")
                expect(element.date).toBeInstanceOf(Date)
            }
        })
    })

    it('should throw an NotFoundError because chat doesnt exist', async() => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)
        try {
            await sendMessage(token, id, text)

            throw Error('should not reach this point')
        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })


    it('should throw an NotFoundError because user doesnt exist', async() => {
        const fakeId = ObjectId().toString()

        try {
            await sendMessage(token, fakeId , text)

            throw Error('should not reach this point')
        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`chat with id ${fakeId} not found`)
        }
    })
    it('should fail on incorrect chatId, id or text', () => {

        expect(() => sendMessage(1)).toThrow(TypeError, '1 is not a string')
        expect(() => sendMessage(true)).toThrow(TypeError, 'true is not a string')
        expect(() => sendMessage([])).toThrow(TypeError, ' is not a string')
        expect(() => sendMessage({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => sendMessage(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => sendMessage(null)).toThrow(TypeError, 'null is not a string')

        expect(() => sendMessage('')).toThrow(ContentError, 'chatId is empty or blank')
        expect(() => sendMessage(' \t\r')).toThrow(ContentError, 'chatId is empty or blank')

        expect(() => sendMessage(friendId, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => sendMessage(friendId, true)).toThrow(TypeError, 'true is not a string')
        expect(() => sendMessage(friendId, [])).toThrow(TypeError, ' is not a string')
        expect(() => sendMessage(friendId, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => sendMessage(friendId, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => sendMessage(friendId, null)).toThrow(TypeError, 'null is not a string')

        expect(() => sendMessage(friendId, '')).toThrow(ContentError, 'userId is empty or blank')
        expect(() => sendMessage(friendId, ' \t\r')).toThrow(ContentError, 'userId is empty or blank')

        expect(() => sendMessage(friendId, token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => sendMessage(friendId, token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => sendMessage(friendId, token, [])).toThrow(TypeError, ' is not a string')
        expect(() => sendMessage(friendId, token, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => sendMessage(friendId, token, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => sendMessage(friendId, token, null)).toThrow(TypeError, 'null is not a string')

        expect(() => sendMessage(friendId, token, '')).toThrow(ContentError, 'text is empty or blank')
        expect(() => sendMessage(friendId, token, ' \t\r')).toThrow(ContentError, 'text is empty or blank')

    })

    afterAll(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))

})