const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const createWish = require('.')
const { random } = Math
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - create wish', () => {
    beforeAll(() => database.connect(TEST_DB_URL))


    let id, token, title, link, price, description, name, surname, email, birthday, password, year, month, day


    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'


        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        await Promise.all([User.deleteMany(), Wish.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`
    })


    it('should succeed on correct wish create', async () => {

        const wishId = await createWish(token, title, link, price, description)

        expect(wishId).toBeDefined()
        expect(wishId).toBeOfType('string')
        expect(wishId.length).toBeGreaterThan(0)

        const _user = await User.findById(id)

        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish.title).toBe(title)
        expect(wish.link).toBe(link)
        expect(wish.price).toBe(price)
        expect(wish.description).toBe(description)

        expect(_user.wishes.length).toBe(1)

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await createWish(token, title, link, price, description)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })


    it('should fail on incorrect id, title, link, price, description', () => {

        expect(() => createWish(1)).toThrow(TypeError, '1 is not a string')
        expect(() => createWish(true)).toThrow(TypeError, 'true is not a string')
        expect(() => createWish([])).toThrow(TypeError, ' is not a string')
        expect(() => createWish({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => createWish(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => createWish(null)).toThrow(TypeError, 'null is not a string')

        expect(() => createWish('')).toThrow(ContentError, 'token is empty or blank')
        expect(() => createWish(' \t\r')).toThrow(ContentError, 'token is empty or blank')
        
        expect(() => createWish(token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => createWish(token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => createWish(token, [])).toThrow(TypeError, ' is not a string')
        expect(() => createWish(token, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => createWish(token, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => createWish(token, null)).toThrow(TypeError, 'null is not a string')

        expect(() => createWish(token, '')).toThrow(ContentError, 'title is empty or blank')
        expect(() => createWish(token, ' \t\r')).toThrow(ContentError, 'title is empty or blank')

        expect(() => createWish(token, title, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => createWish(token, title, true)).toThrow(TypeError, 'true is not a string')
        expect(() => createWish(token, title, [])).toThrow(TypeError, ' is not a string')
        expect(() => createWish(token, title, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => createWish(token, title, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => createWish(token, title, null)).toThrow(TypeError, 'null is not a string')

        expect(() => createWish(token, title, '')).toThrow(ContentError, 'link is empty or blank')
        expect(() => createWish(token, title, ' \t\r')).toThrow(ContentError, 'link is empty or blank')

        expect(() => createWish(token, title, link, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => createWish(token, title, link, true)).toThrow(TypeError, 'true is not a string')
        expect(() => createWish(token, title, link, [])).toThrow(TypeError, ' is not a string')
        expect(() => createWish(token, title, link, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => createWish(token, title, link, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => createWish(token, title, link, null)).toThrow(TypeError, 'null is not a string')

        expect(() => createWish(token, title, link, '')).toThrow(ContentError, 'price is empty or blank')
        expect(() => createWish(token, title, link, ' \t\r')).toThrow(ContentError, 'price is empty or blank')

    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})