require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const searchUsers = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - search users', () => {
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

        name1 = `namefriend-${random()}`
        surname1 = `surnamefriend-${random()}`
        email1 = `emailfriend-${random()}@mail.com`
        password1 = `passwordfriend-${random()}`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        passwordconfirm1 = password
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = user.id

        friendId = friend.id
        
        user.friends.push(ObjectId(friendId))

        await user.save()
    })

    it('should succeed on correct retrieving users', async () => {

        const friends = await searchUsers(email1)
        expect(friends).to.exist
        expect(friends).to.have.length

        friends.forEach(friend => {
            
            expect(friend).to.exist
            expect(friend.id).to.equal(friendId)
            expect(friend.id).to.be.a('string')
            //expect(friend._id).to.not.exist

            expect(friend.name).to.equal(name1)
            expect(friend.name).to.be.a('string')

            expect(friend.surname).to.equal(surname1)
            expect(friend.surname).to.be.a('string')

            expect(friend.email).to.equal(email1)
            expect(friend.email).to.be.a('string')

            expect(friend.birthday.toString()).to.equal(birthday1.toString())
            expect(friend.birthday).to.be.an.instanceOf(Date)
        })

    })
    it('should fail on wrong query', async () => {
        const query = '012345678901234567890123'

        try {
            await searchUsers(query)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with email ${query} not found`)
        }
    })
    it('should fail on incorrect email data', () => {
        
        expect(() => searchUsers(1)).to.throw(TypeError, '1 is not a string')
        expect(() => searchUsers(true)).to.throw(TypeError, 'true is not a string')
        expect(() => searchUsers([])).to.throw(TypeError, ' is not a string')
        expect(() => searchUsers({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => searchUsers(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => searchUsers(null)).to.throw(TypeError, 'null is not a string')

        expect(() => searchUsers('')).to.throw(ContentError, 'query is empty or blank')
        expect(() => searchUsers(' \t\r')).to.throw(ContentError, 'query is empty or blank')
    })
    after(() => User.deleteMany().then(database.disconnect))
})