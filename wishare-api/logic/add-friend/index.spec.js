require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const addFriend = require('.')
const { errors: { NotFoundError, ContentError, ConflictError } } = require('wishare-util')
const { database, ObjectId, models: { User, Chat } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - add friend', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, password1

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

        await Promise.all([User.deleteMany(), Chat.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = user.id

        friendId = friend.id

        chat = await Chat.create({ owner: id})
    })

    it('should succeed on correct friend adding', async () => {
        const response = await addFriend(id, friendId)

        expect(response).to.be.undefined

        const _user = await User.findById(id)

        const _friend = _user.friends.find(friend => friend._id.toString() === friendId)

        expect(_friend).to.exist

        expect(friendId.toString()).to.equal(_friend.toString())

        expect(_user.friends).to.exist
        expect(_user.friends).to.have.length.greaterThan(0)

        const _chat = await Chat.findOne({ owner: ObjectId(id) })

        expect(_chat.users).to.contain(friendId)

    })

    it('should fail on adding a friend who was already been added', async () => {
        try {
        const _user = await User.findById(id)
        _user.friends.push(ObjectId(friendId))

        await addFriend(id, friendId)
        }catch(error){
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)
            expect(error.message).to.equal(`friend with id ${friendId} is already added`)

        }
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await addFriend(id, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong friend id ', async () => {
        const friendId = '012345678901234567890123'

        try {
            await addFriend(id, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${friendId} not found`)
        }
    })

    it('should fail on incorrect id and friendId data', () => {
        const wrongId = 'wrongid'

        expect(() => addFriend(1)).to.throw(TypeError, '1 is not a string')
        expect(() => addFriend(true)).to.throw(TypeError, 'true is not a string')
        expect(() => addFriend([])).to.throw(TypeError, ' is not a string')
        expect(() => addFriend({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => addFriend(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => addFriend(null)).to.throw(TypeError, 'null is not a string')

        expect(() => addFriend('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => addFriend(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => addFriend(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

        expect(() => addFriend(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => addFriend(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => addFriend(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => addFriend(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => addFriend(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => addFriend(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => addFriend(id, '')).to.throw(ContentError, 'friendId is empty or blank')
        expect(() => addFriend(id, ' \t\r')).to.throw(ContentError, 'friendId is empty or blank')
        expect(() => addFriend(id, wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

    })

    after(() => Promise.all([User.deleteMany(), Chat.deleteMany()]).then(database.disconnect))
})