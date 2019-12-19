require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveFriends = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve friends', () => {
    before(() => database.connect(TEST_DB_URL))

    let friendIds, id, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, password1

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
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = user.id

        friendId = friend.id
        friend2Id = friend2.id

        friendIds= [friendId, friend2Id]

        user.friends.push(friendId.toString())
        user.friends.push(friend2Id.toString())

        await user.save()
    })

    it('should succeed on correct user id', async () => {
        const friends = await retrieveFriends(id)

        expect(friends).to.exist
 
        friends.forEach(friend => {
            expect(friend.id).to.exist
            expect(friend.id).to.be.a('string')
            expect(friend.id).to.have.length.greaterThan(0)
            expect(friend.id).to.be.oneOf(friendIds)

            expect(friend.name).to.exist
            expect(friend.name).to.be.a('string')
            expect(friend.name).to.have.length.greaterThan(0)

            expect(friend.email).to.exist
            expect(friend.email).to.be.a('string')
            expect(friend.email).to.have.length.greaterThan(0)
        })
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await retrieveFriends(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id data', () => {
        const wrongId = 'wrong id'
        expect(() => retrieveFriends(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveFriends(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveFriends([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveFriends({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriends(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveFriends(null)).to.throw(TypeError, 'null is not a string')
    
        expect(() => retrieveFriends('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriends(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriends(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)
    
     })

    after(() => User.deleteMany().then(database.disconnect))
})