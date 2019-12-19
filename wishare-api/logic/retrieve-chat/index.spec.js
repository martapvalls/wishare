require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveChat = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, database, models: { User, Chat, Message } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve chat', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, friend2Id, friendId, chatId, message1Id, message2Id, users

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        passwordconfirm = password
        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        name1 = `name-${random()}`
        surname1 = `surname-${random()}`
        email1 = `email-${random()}@mail.com`
        username1 = `username-${random()}`
        password1 = `password-${random()}`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        passwordconfirm1 = password
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        email2 = `email-${random()}@mail.com`
        birthday2 = new Date(1990, 11, 2, 2, 0, 0, 0)

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`

        await Promise.all([User.deleteMany(), Chat.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday2, password: await bcrypt.hash(password, 10) })

        id = user.id

        friendId = friend.id
        friend2Id = friend2.id

        users = [friendId, friend2Id]

        user.friends.push(friendId.toString())
        user.friends.push(friend2Id.toString())

        await user.save()

        const chat = await Chat.create({ owner: id, users: [friendId, friend2Id]})

        chatId = chat.id

        message1 = new Message({ user: ObjectId(friendId), text: "First message", date: new Date })
        message1Id = message1.id

        message2 = new Message({ user: ObjectId(friend2Id), text: "Second message", date: new Date })
        message2Id = message2.id

        messages = [message1, message2]

        chat.message.push(message1.toObject())
        chat.message.push(message2.toObject())

        await chat.save()
    })

    it('should return a correct chat', async() => {
        const _chat = await retrieveChat(friendId, id)

        expect(_chat).to.exist
        expect(_chat.owner._id.toString()).to.equal(id)
        expect(_chat.users.toString()).to.contain(users)

        const _messages = _chat.message

        _messages.forEach(element => {
            if (element.id === message1Id) {
                expect(element).to.exist
                expect(element.id).to.equal(message1Id)
                expect(element.user.toString()).to.equal(friendId)
            } else if (element.id === message2Id) {
                expect(element).to.exist
                expect(element.id).to.equal(message2Id)
                expect(element.user.toString()).to.equal(friend2Id)

            }

        })
    })

    it('should throw an NotFoundError because chat doesnt exist', async() => {
        const fakeId = ObjectId().toString()
        try {
            await retrieveChat(fakeId, id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`chat with id ${fakeId} not found`)
        }
    })
    it('should throw an NotFoundError because chat doesnt exist', async() => {
        const fakeId = ObjectId().toString()
        try {
            await retrieveChat(friendId, fakeId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`chat with id ${fakeId} not found`)
        }
    })


    it('should fail on incorrect id and friendId', () => {
        const wrongId = 'wrong id'

        expect(() => retrieveChat(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveChat(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveChat([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveChat({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveChat(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveChat(null)).to.throw(TypeError, 'null is not a string')

        expect(() => retrieveChat('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveChat(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveChat(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

        expect(() => retrieveChat(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveChat(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveChat(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveChat(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveChat(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveChat(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => retrieveChat(id, '')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => retrieveChat(id, ' \t\r')).to.throw(ContentError, 'userId is empty or blank')
    })


    after(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})