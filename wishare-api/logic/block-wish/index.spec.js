require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const blockedWish = require('.')
const { random } = Math
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')


describe('logic - blocked wish', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, wishId, title, link, price, description

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

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = user.id

        friendId = friend.id

        user.friends.push(friendId.toString())

        
        const wish = new Wish({ title, link, price, description })
        
        wishId = wish.id
        
        friend.wishes.push(wish)
        await friend.save()
        
        user.savedWishes.push({user: friendId, wish})
        await user.save()


    })


    it('should succeed on retrieveing user wishes', async () => {

        const user = await User.findById(friendId)
        
        const _wish = user.wishes.find(wish => wish.id === wishId)

        blocked = _wish.blocked

        const response = await blockedWish(id, friendId, wishId)

        expect(response).to.not.exist

        const _user = await User.findById(friendId)

        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish.id).to.exist
        expect(wish.id.toString()).to.equal(wishId)

        expect(wish.blocked).to.exist
        expect(wish.blocked).to.be.a('boolean')
        expect(wish.blocked).to.equal(true)
        expect(wish.blocked).to.not.equal(blocked)

    })

    it('should fail on wrong user id', async () => {
        id = 'wrongid'

        try {
            await blockedWish(id, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong wish id', async () => {
        friendId = 'wrongid'

        try {
            await blockedWish(id, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${friendId} not found`)
        }
    })
    it('should fail on wrong wish id', async () => {
        wishId = 'wrongid'

        try {
            await blockedWish(id, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`wish with id ${wishId} not found`)
        }
    })
    it('should fail on incorrect id, wishid, title, link, price or description', () => {
        expect(() => blockedWish(1)).to.throw(TypeError, '1 is not a string')
        expect(() => blockedWish(true)).to.throw(TypeError, 'true is not a string')
        expect(() => blockedWish([])).to.throw(TypeError, ' is not a string')
        expect(() => blockedWish({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => blockedWish(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => blockedWish(null)).to.throw(TypeError, 'null is not a string')

        expect(() => blockedWish('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => blockedWish(' \t\r')).to.throw(ContentError, 'id is empty or blank')

        expect(() => blockedWish(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => blockedWish(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => blockedWish(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => blockedWish(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => blockedWish(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => blockedWish(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => blockedWish(id, '')).to.throw(ContentError, 'friendId is empty or blank')
        expect(() => blockedWish(id, ' \t\r')).to.throw(ContentError, 'friendId is empty or blank')

        expect(() => blockedWish(id, friendId,  1)).to.throw(TypeError, '1 is not a string')
        expect(() => blockedWish(id, friendId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => blockedWish(id, friendId, [])).to.throw(TypeError, ' is not a string')
        expect(() => blockedWish(id, friendId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => blockedWish(id, friendId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => blockedWish(id, friendId, null)).to.throw(TypeError, 'null is not a string')

        expect(() => blockedWish(id, friendId, '')).to.throw(ContentError, 'wishId is empty or blank')
        expect(() => blockedWish(id, friendId, ' \t\r')).to.throw(ContentError, 'wishId is empty or blank')
    })
    after(() => User.deleteMany().then(database.disconnect))
})