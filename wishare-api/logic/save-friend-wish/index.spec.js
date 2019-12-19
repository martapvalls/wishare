require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const saveFriendWish = require('.')
const { errors: { NotFoundError, ContentError, ConflictError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - save friend wish', () => {
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

        await user.save()

        const wish = new Wish({ title, link, price, description })

        wishId = wish.id

        friend.wishes.push(wish)


        await friend.save()
        
    })

    it('should succeed on correct friend adding', async () => {
        
        const response = await saveFriendWish(id, friendId, wishId)

        expect(response).to.be.undefined

        const _user = await User.findById(id)

        const savedidWish = _user.savedWishes.find(wish => wish.wish._id.toString() === wishId)
        
        expect(savedidWish).to.exist
        
        expect(savedidWish.user._id.toString()).to.equal(friendId)
        expect(savedidWish.wish._id.toString()).to.equal(wishId)

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await saveFriendWish(id, friendId, wishId)

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
            await saveFriendWish(id, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`there is no friend with id ${friendId}`)
        }
    })

    it('should fail on wrong wish id ', async () => {
        const wishId = '012345678901234567890123'

        try {
            await saveFriendWish(id, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`friend does not have wish with id ${wishId}`)
        }
    })


    it('should fail on incorrect id and friendId data', () => {
        const wrongId = 'wrongid'

        expect(() => saveFriendWish(1)).to.throw(TypeError, '1 is not a string')
        expect(() => saveFriendWish(true)).to.throw(TypeError, 'true is not a string')
        expect(() => saveFriendWish([])).to.throw(TypeError, ' is not a string')
        expect(() => saveFriendWish({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => saveFriendWish(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => saveFriendWish(null)).to.throw(TypeError, 'null is not a string')

        expect(() => saveFriendWish('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => saveFriendWish(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => saveFriendWish(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

        expect(() => saveFriendWish(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => saveFriendWish(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => saveFriendWish(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => saveFriendWish(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => saveFriendWish(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => saveFriendWish(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => saveFriendWish(id, '')).to.throw(ContentError, 'friendId is empty or blank')
        expect(() => saveFriendWish(id, ' \t\r')).to.throw(ContentError, 'friendId is empty or blank')
        expect(() => saveFriendWish(id, wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

        expect(() => saveFriendWish(id, friendId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => saveFriendWish(id, friendId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => saveFriendWish(id, friendId, [])).to.throw(TypeError, ' is not a string')
        expect(() => saveFriendWish(id, friendId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => saveFriendWish(id, friendId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => saveFriendWish(id, friendId, null)).to.throw(TypeError, 'null is not a string')

        expect(() => saveFriendWish(id, friendId, '')).to.throw(ContentError, 'wishId is empty or blank')
        expect(() => saveFriendWish(id, friendId, ' \t\r')).to.throw(ContentError, 'wishId is empty or blank')
        expect(() => saveFriendWish(id, friendId, wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

    })

    after(() => User.deleteMany().then(database.disconnect))
})