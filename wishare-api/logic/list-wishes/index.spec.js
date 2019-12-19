require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const listWishes = require('.')
const { random } = Math
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')


describe('logic - list wishes', () => {
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

        const wish = new Wish({ title, link, price, description })

        user.wishes.push(wish)
        await user.save()
    })


    it('should succeed on retrieveing user wishes', async () => {
        const wishes = await listWishes(id)

        expect(wishes).to.exist

        wishes.forEach(wish => {
            expect(wish.id).to.exist
            expect(wish.id).to.be.a('string')
            expect(wish.id).to.have.length.greaterThan(0)

            expect(wish.title).to.exist
            expect(wish.title).to.be.a('string')
            expect(wish.title).to.have.length.greaterThan(0)

            expect(wish.link).to.exist
            expect(wish.link).to.be.a('string')
            expect(wish.link).to.have.length.greaterThan(0)

            expect(wish.price).to.exist
            expect(wish.price).to.be.a('string')
            expect(wish.price).to.have.length.greaterThan(0)

            expect(wish.description).to.exist
            expect(wish.description).to.be.a('string')
            expect(wish.description).to.have.length.greaterThan(0)

        })
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await listWishes(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })


    it('should fail on incorrect id data', () => {
        const wrongId = 'wrong id'
        expect(() => listWishes(1)).to.throw(TypeError, '1 is not a string')
        expect(() => listWishes(true)).to.throw(TypeError, 'true is not a string')
        expect(() => listWishes([])).to.throw(TypeError, ' is not a string')
        expect(() => listWishes({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => listWishes(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => listWishes(null)).to.throw(TypeError, 'null is not a string')

        expect(() => listWishes('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => listWishes(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => listWishes(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

    })


    after(() => User.deleteMany().then(database.disconnect))
})