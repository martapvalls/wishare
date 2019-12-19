require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const createChat = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, database, models: { User, Chat } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - create chat', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, friend2Id, friendId

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

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday2, password: await bcrypt.hash(password, 10) })

        id = user.id

        friendId = friend.id
        friend2Id = friend2.id

        user.friends.push(friendId.toString())
        user.friends.push(friend2Id.toString())

        await user.save()

    })

    it('should succeed on correct user id', async() => {
        const chatId = await createChat(id)

        expect(chatId).to.exist
        expect(chatId).to.be.a('string')

        const chat = await Chat.findById(chatId)

        expect(chat.owner.toString()).to.equal(id)
    })

    it('should fail on wrong user id', async() => {

        const fakeId = ObjectId().toString()
        try {
            await createChat(fakeId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${fakeId} not found`)
        }
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {

        const fakeId = 'sadf'

        expect(() => createChat(1)).to.throw(TypeError, '1 is not a string')
        expect(() => createChat(true)).to.throw(TypeError, 'true is not a string')
        expect(() => createChat([])).to.throw(TypeError, ' is not a string')
        expect(() => createChat({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createChat(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createChat(null)).to.throw(TypeError, 'null is not a string')

        expect(() => createChat('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => createChat(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => createChat(fakeId)).to.throw(ContentError, `${fakeId} is not a valid id`)

    })


    after(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})