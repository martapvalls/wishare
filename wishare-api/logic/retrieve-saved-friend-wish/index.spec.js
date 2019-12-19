require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveFriendWish = require('.')
const { errors: { NotFoundError, ContentError, ConflictError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve friend wish', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, friendWish, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, wishId, title, link, price, description 

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        passwordconfirm = password
        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        name1 = `friendname-${random()}`
        surname1 = `surname-${random()}`
        email1 = `email-${random()}@mail.com`
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

        const usuario = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = usuario.id

        friendId = friend.id

        usuario.friends.push(friendId.toString())

        friendWish = new Wish({ title, link, price, description })

        friend.wishes.push(friendWish)

        await friend.save()

        usuario.savedWishes.push({user: friend.id, wish: friendWish })

        await usuario.save()
        
    })

    it('should succeed on correct friend adding', async () => {

        const savedWishes = await retrieveFriendWish(id)

        expect(savedWishes).to.exist

        savedWishes.forEach(savedWish => {

            expect(savedWish.description).to.exist
            expect(savedWish.description).to.be.a('string')
            expect(savedWish.description).to.have.length.greaterThan(0)

            expect(savedWish.id).to.exist
            expect(savedWish.id).to.be.a('string')
            expect(savedWish.id).to.have.length.greaterThan(0)
            expect(savedWish.id).to.equal(friendId)

            expect(savedWish.link).to.exist
            expect(savedWish.link).to.be.a('string')
            expect(savedWish.link).to.have.length.greaterThan(0)

            expect(savedWish.name).to.exist
            expect(savedWish.name).to.be.a('string')
            expect(savedWish.name).to.have.length.greaterThan(0)

            expect(savedWish.price).to.exist
            expect(savedWish.price).to.be.a('string')
            expect(savedWish.price).to.have.length.greaterThan(0)

            expect(savedWish.title).to.exist
            expect(savedWish.title).to.be.a('string')
            expect(savedWish.title).to.have.length.greaterThan(0)

            expect(savedWish.wish).to.exist
            expect(savedWish.wish).to.be.a('string')
            expect(savedWish.wish).to.have.length.greaterThan(0)
            expect(savedWish.wish).to.equal(friendWish.id)
    
        })
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await retrieveFriendWish(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    it('should fail on incorrect id and friendId data', () => {
        const wrongId = 'wrongid'

        expect(() => retrieveFriendWish(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveFriendWish(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveFriendWish([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveFriendWish({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriendWish(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveFriendWish(null)).to.throw(TypeError, 'null is not a string')

        expect(() => retrieveFriendWish('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriendWish(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriendWish(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

    })

    after(() => User.deleteMany().then(database.disconnect))
})