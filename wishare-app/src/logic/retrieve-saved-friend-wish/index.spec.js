const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const retrieveFriendWish = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe.only('logic - retrieve friend wish', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, friendId, name, friendWish, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, wishId, title, link, price, description 

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        name1 = `friendname-${random()}`
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

        const usuario = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })

        id = usuario.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        friendId = friend.id

        usuario.friends.push(friendId.toString())

        friendWish = new Wish({ title, link, price, description })

        friend.wishes.push(friendWish)

        await friend.save()

        usuario.savedWishes.push({user: friend.id, wish: friendWish })

        await usuario.save()
        
    })

    it('should succeed on correct friend adding', async () => {

        const savedWishes = await retrieveFriendWish(token)

        expect(savedWishes).toBeDefined()

        savedWishes.forEach(savedWish => {

            expect(savedWish.description).toBeDefined()
            expect(savedWish.description).toBeOfType('string')
            expect(savedWish.description).toHaveLengthGreaterThan(0)

            expect(savedWish.id).toBeDefined()
            expect(savedWish.id).toBeOfType('string')
            expect(savedWish.id).toHaveLengthGreaterThan(0)
            expect(savedWish.id).toBe(friendId)

            expect(savedWish.link).toBeDefined()
            expect(savedWish.link).toBeOfType('string')
            expect(savedWish.link).toHaveLengthGreaterThan(0)

            expect(savedWish.name).toBeDefined()
            expect(savedWish.name).toBeOfType('string')
            expect(savedWish.name).toHaveLengthGreaterThan(0)

            expect(savedWish.price).toBeDefined()
            expect(savedWish.price).toBeOfType('string')
            expect(savedWish.price).toHaveLengthGreaterThan(0)

            expect(savedWish.title).toBeDefined()
            expect(savedWish.title).toBeOfType('string')
            expect(savedWish.title).toHaveLengthGreaterThan(0)

            expect(savedWish.wish).toBeDefined()
            expect(savedWish.wish).toBeOfType('string')
            expect(savedWish.wish).toHaveLengthGreaterThan(0)
            expect(savedWish.wish).toBe(friendWish.id)
    
        })
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await retrieveFriendWish(token)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })

    it('should fail on incorrect id and friendId data', () => {

        expect(() => retrieveFriendWish(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveFriendWish(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveFriendWish([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveFriendWish({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriendWish(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveFriendWish(null)).toThrow(TypeError, 'null is not a string')

        expect(() => retrieveFriendWish('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => retrieveFriendWish(' \t\r')).toThrow(ContentError, 'id is empty or blank')
       
    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})