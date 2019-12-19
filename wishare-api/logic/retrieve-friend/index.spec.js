require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveFriend = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve friends', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, friendId, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1

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
        email1 = `email111-${random()}@mail.com`
        username1 = `username-${random()}`
        password1 = `password-${random()}`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        passwordconfirm1 = password
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        email2 = `email22-${random()}@mail.com`

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        
        id = user.id

        friendId = friend.id

        user.friends.push(friendId.toString())

        await user.save()
    })

    it('should succeed on correct user id', async () => {

        const friend = await retrieveFriend(id, friendId)

        expect(friend).to.exist

        expect(friend.friendId).to.exist
        expect(friend.friendId).to.be.a('string')
        expect(friend.friendId).to.have.length.greaterThan(0)
        expect(friend.friendId).to.equal(friendId)

        expect(friend.name).to.exist
        expect(friend.name).to.be.a('string')
        expect(friend.name).to.have.length.greaterThan(0)

        expect(friend.email).to.exist
        expect(friend.email).to.be.a('string')
        expect(friend.email).to.have.length.greaterThan(0)

        expect(friend.birthday).to.exist
        expect(friend.birthday).to.be.a('string')
        expect(friend.birthday).to.have.length.greaterThan(0)

        expect(friend.wishes).to.exist

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await retrieveFriend(id, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong user id', async () => {
        const friendId = '012345678901234567890123'

        try {
            await retrieveFriend(id, friendId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${friendId} not found`)
        }
    })
    it('should fail on incorrect id data', () => {
        const wrongId = 'wrong id'
        expect(() => retrieveFriend(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveFriend(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveFriend([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveFriend({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriend(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveFriend(null)).to.throw(TypeError, 'null is not a string')

        expect(() => retrieveFriend('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriend(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriend(wrongId)).to.throw(ContentError, `${wrongId} is not a valid id`)

        expect(() => retrieveFriend(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveFriend(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveFriend(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveFriend(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriend(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveFriend(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => retrieveFriend(id, '')).to.throw(ContentError, 'friendId is empty or blank')
        expect(() => retrieveFriend(id, ' \t\r')).to.throw(ContentError, 'friendId is empty or blank')
        expect(() => retrieveFriend(id, wrongId)).to.throw(ContentError, `${wrongId} is not a valid id`)

    })

    after(() => User.deleteMany().then(database.disconnect))
})