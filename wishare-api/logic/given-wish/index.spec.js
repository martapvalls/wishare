require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const givenWish = require('.')
const { random } = Math
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')


describe('logic - given wish', () => {
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

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`

        const wish = new Wish({ title, link, price, description })

        wishId = wish.id

        user.wishes.push(wish)
        await user.save()
    })


    it('should succeed on retrieveing user wishes', async () => {
        const user = await User.findById(id)

        const _wish = user.wishes.find(wish => wish.id === wishId)

        given = _wish.given

        const response = await givenWish(id, wishId)

        expect(response).to.not.exist

        const _user = await User.findById(id)

        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish.id).to.exist
        expect(wish.id.toString()).to.equal(wishId)
        
        expect(wish.given).to.exist
        expect(wish.given).to.be.a('boolean')
        expect(wish.given).to.equal(true)
        expect(wish.given).to.not.equal(given)

    })

    it('should fail on wrong user id', async () => {
        id = 'wrongid'
    
        try {
            await givenWish(id, wishId)
    
            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong wish id', async () => {
        wishId = 'wrongid'
    
        try {
            await givenWish(id, wishId)
    
            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`wish with id ${wishId} not found`)
        }
    })
    it('should fail on incorrect id, wishid, title, link, price or description', () => {
        expect(() => givenWish(1)).to.throw(TypeError, '1 is not a string')
        expect(() => givenWish(true)).to.throw(TypeError, 'true is not a string')
        expect(() => givenWish([])).to.throw(TypeError, ' is not a string')
        expect(() => givenWish({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => givenWish(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => givenWish(null)).to.throw(TypeError, 'null is not a string')
    
        expect(() => givenWish('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => givenWish(' \t\r')).to.throw(ContentError, 'id is empty or blank')
    
        expect(() => givenWish(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => givenWish(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => givenWish(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => givenWish(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => givenWish(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => givenWish(id, null)).to.throw(TypeError, 'null is not a string')
    
        expect(() => givenWish(id, '')).to.throw(ContentError, 'wishId is empty or blank')
        expect(() => givenWish(id, ' \t\r')).to.throw(ContentError, 'wishId is empty or blank')

    })
    after(() => User.deleteMany().then(database.disconnect))
})