const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const blockedWish = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')


describe.only('logic - blocked wish', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, friendId, blocked, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, wishId, title, link, price, description

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        name1 = `name-${random()}`
        surname1 = `surname-${random()}`
        email1 = `email-${random()}@mail.com`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        friendId = friend.id

        user.friends.push(friendId.toString())

        await user.save()

        const wish = new Wish({ title, link, price, description })

        wishId = wish.id

        friend.wishes.push(wish)


        await friend.save()

    })


    it('should succeed on retrieveing user wishes', async () => {

        const user = await User.findById(friendId)
        
        const _wish = user.wishes.find(wish => wish.id === wishId)

        blocked = _wish.blocked

        const response = await blockedWish(token, friendId, wishId)

        expect(response).toBeUndefined()

        const _user = await User.findById(friendId)

        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish.id).toBeDefined()
        expect(wish.id.toString()).toBe(wishId)

        expect(wish.blocked).toBeDefined()
        expect(wish.blocked).toBeOfType('boolean')
        expect(wish.blocked).toBe(true)

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await blockedWish(token, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong wish id', async () => {
        friendId = 'wrongid'

        try {
            await blockedWish(token, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${friendId} not found`)
        }
    })
    it('should fail on wrong wish id', async () => {
        wishId = 'wrongid'

        try {
            await blockedWish(token, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`wish with id ${wishId} not found`)
        }
    })
    it('should fail on incorrect id, wishid, title, link, price or description', () => {
        expect(() => blockedWish(1)).toThrow(TypeError, '1 is not a string')
        expect(() => blockedWish(true)).toThrow(TypeError, 'true is not a string')
        expect(() => blockedWish([])).toThrow(TypeError, ' is not a string')
        expect(() => blockedWish({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => blockedWish(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => blockedWish(null)).toThrow(TypeError, 'null is not a string')

        expect(() => blockedWish('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => blockedWish(' \t\r')).toThrow(ContentError, 'id is empty or blank')

        expect(() => blockedWish(id, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => blockedWish(id, true)).toThrow(TypeError, 'true is not a string')
        expect(() => blockedWish(id, [])).toThrow(TypeError, ' is not a string')
        expect(() => blockedWish(id, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => blockedWish(id, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => blockedWish(id, null)).toThrow(TypeError, 'null is not a string')

        expect(() => blockedWish(id, '')).toThrow(ContentError, 'friendId is empty or blank')
        expect(() => blockedWish(id, ' \t\r')).toThrow(ContentError, 'friendId is empty or blank')

        expect(() => blockedWish(id, friendId,  1)).toThrow(TypeError, '1 is not a string')
        expect(() => blockedWish(id, friendId, true)).toThrow(TypeError, 'true is not a string')
        expect(() => blockedWish(id, friendId, [])).toThrow(TypeError, ' is not a string')
        expect(() => blockedWish(id, friendId, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => blockedWish(id, friendId, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => blockedWish(id, friendId, null)).toThrow(TypeError, 'null is not a string')

        expect(() => blockedWish(id, friendId, '')).toThrow(ContentError, 'wishId is empty or blank')
        expect(() => blockedWish(id, friendId, ' \t\r')).toThrow(ContentError, 'wishId is empty or blank')
    })
    afterAll(() => User.deleteMany().then(database.disconnect))
})