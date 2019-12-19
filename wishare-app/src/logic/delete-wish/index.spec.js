const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const deleteWish = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')


describe('logic - delete wishes', () => {
    beforeAll(() => database.connect(TEST_DB_URL))


    let id, token, wishId, title, link, price, description, name, surname, email, birthday, password, year, month, day


    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'


        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`

        const wish = new Wish({ title, link, price, description })

        wishId = wish.id

        user.wishes.push(wish)
        await user.save()
    })


    it('should succeed on deleting correct user wish', async () => {

        const response = await deleteWish(token, wishId)

        expect(response).toBeUndefined()

        const _user = await User.findById(id)
        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish).toBeUndefined()

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)
    
        try {
            await deleteWish(token, wishId)
    
            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong wish id', async () => {
        wishId = 'wrongid'
    
        try {
            await deleteWish(token, wishId)
    
            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`wish with id ${wishId} not found`)
        }
    })

    it('should fail on incorrect id, wishid, title, link, price or description', () => {
        expect(() => deleteWish(1)).toThrow(TypeError, '1 is not a string')
        expect(() => deleteWish(true)).toThrow(TypeError, 'true is not a string')
        expect(() => deleteWish([])).toThrow(TypeError, ' is not a string')
        expect(() => deleteWish({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => deleteWish(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => deleteWish(null)).toThrow(TypeError, 'null is not a string')
    
        expect(() => deleteWish('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => deleteWish(' \t\r')).toThrow(ContentError, 'id is empty or blank')
    
        expect(() => deleteWish(token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => deleteWish(token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => deleteWish(token, [])).toThrow(TypeError, ' is not a string')
        expect(() => deleteWish(token, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => deleteWish(token, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => deleteWish(token, null)).toThrow(TypeError, 'null is not a string')
    
        expect(() => deleteWish(token, '')).toThrow(ContentError, 'wishId is empty or blank')
        expect(() => deleteWish(token, ' \t\r')).toThrow(ContentError, 'wishId is empty or blank')

    })
    afterAll(() => User.deleteMany().then(database.disconnect))
})