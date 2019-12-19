const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const retrieveChat = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Chat, Message } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - retrieve chat', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, userId, name, ownerName, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, friend2Id, friendId, message1Id, message2Id, users, birthday2, email2, message1, message2, messages, chatId

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

        const usuario = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday2, password: await bcrypt.hash(password, 10) })

        id = usuario.id

        ownerName = usuario.name

        
        friendId = friend.id
        friend2Id = friend2.id
        
        token = jwt.sign({ sub: friendId }, TEST_SECRET)

        users = [friendId, friend2Id]

        usuario.friends.push(friendId.toString())
        usuario.friends.push(friend2Id.toString())

        await usuario.save()

        const chat = await Chat.create({ owner: ObjectId(id), users: [ObjectId(friendId), ObjectId(friend2Id)]})

        chatId = chat.id

        message1 = new Message({ user: friend, text: "First message", date: new Date })
        message1Id = message1.id

        message2 = new Message({ user: friend2, text: "Second message", date: new Date })
        message2Id = message2.id

        messages = [message1, message2]

        chat.message.push(message1.toObject())
        chat.message.push(message2.toObject())

        await chat.save()
    })

    it('should return a correct chat', async() => {

        const _chat = await retrieveChat(token, id)
        
        expect(_chat).toBeDefined()
        expect(_chat.owner.name).toBe(ownerName)
        expect(_chat.owner._id).toBe(id)
        
        expect(_chat.users.toString()).toContain(users)

        const _messages = _chat.message

        _messages.forEach(element => {
            if (element.id === message1Id) {
                expect(element).toBeDefined()
                expect(element.id).toBe(message1Id)
                expect(element.user.toString()).toBe(friendId)
            } else if (element.id === message2Id) {
                expect(element).toBeDefined()
                expect(element.id).toBe(message2Id)
                expect(element.user.toString()).toBe(friend2Id)

            }

        })
    })

    it('should throw an NotFoundError because chat doesnt exist', async() => {
        const friendId = '012345678901234567890123'

        const token = jwt.sign({ sub: friendId }, TEST_SECRET)


        try {
            await retrieveChat(token, id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`chat with id ${friendId} not found`)
        }
    })


    it('should fail on incorrect chat id', () => {

        expect(() => retrieveChat(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveChat(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveChat([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveChat({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveChat(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveChat(null)).toThrow(TypeError, 'null is not a string')

        expect(() => retrieveChat('')).toThrow(ContentError, 'chatId is empty or blank')
        expect(() => retrieveChat(' \t\r')).toThrow(ContentError, 'chatId is empty or blank')

        expect(() => retrieveChat(token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveChat(token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveChat(token, [])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveChat(token, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveChat(token, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveChat(token, null)).toThrow(TypeError, 'null is not a string')

        expect(() => retrieveChat(token, '')).toThrow(ContentError, 'chatId is empty or blank')
        expect(() => retrieveChat(token, ' \t\r')).toThrow(ContentError, 'chatId is empty or blank')

    })


    afterAll(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})