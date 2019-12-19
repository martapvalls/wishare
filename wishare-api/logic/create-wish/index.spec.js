require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const createWish = require('.')
const { random } = Math
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')


describe('logic - create wish', () => {
    before(() => database.connect(TEST_DB_URL))


    let id, title, link, price, description, name, surname, email, birthday, password


    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        year = 1999
        month = 1
        day = 25


        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        await Promise.all([User.deleteMany(), Wish.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`
    })


    it('should succeed on correct wish create', async () => {
        const wishId = await createWish(id, title, link, price, description)

        expect(wishId).to.exist
        expect(wishId).to.be.a('string')
        expect(wishId).to.have.length.greaterThan(0)

        const _user = await User.findById(id)

        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish.title).to.equal(title)
        expect(wish.link).to.equal(link)
        expect(wish.price).to.equal(price)
        expect(wish.description).to.equal(description)

        expect(_user.wishes.length).to.equal(1)

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await createWish(id, title, link, price, description)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })


    it('should fail on incorrect id, title, link, price, description', () => {
        const wrongId = 'wrong id'

        expect(() => createWish(1)).to.throw(TypeError, '1 is not a string')
        expect(() => createWish(true)).to.throw(TypeError, 'true is not a string')
        expect(() => createWish([])).to.throw(TypeError, ' is not a string')
        expect(() => createWish({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createWish(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createWish(null)).to.throw(TypeError, 'null is not a string')

        expect(() => createWish('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => createWish(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => createWish(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

        expect(() => createWish(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createWish(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createWish(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => createWish(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createWish(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createWish(id, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createWish(id, '')).to.throw(ContentError, 'title is empty or blank')
        expect(() => createWish(id, ' \t\r')).to.throw(ContentError, 'title is empty or blank')

        expect(() => createWish(id, title, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createWish(id, title, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createWish(id, title, [])).to.throw(TypeError, ' is not a string')
        expect(() => createWish(id, title, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createWish(id, title, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createWish(id, title, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createWish(id, title, '')).to.throw(ContentError, 'link is empty or blank')
        expect(() => createWish(id, title, ' \t\r')).to.throw(ContentError, 'link is empty or blank')

        expect(() => createWish(id, title, link, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createWish(id, title, link, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createWish(id, title, link, [])).to.throw(TypeError, ' is not a string')
        expect(() => createWish(id, title, link, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createWish(id, title, link, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createWish(id, title, link, null)).to.throw(TypeError, 'null is not a string')

        expect(() => createWish(id, title, link, '')).to.throw(ContentError, 'price is empty or blank')
        expect(() => createWish(id, title, link, ' \t\r')).to.throw(ContentError, 'price is empty or blank')

    })

    after(() => User.deleteMany().then(database.disconnect))
})