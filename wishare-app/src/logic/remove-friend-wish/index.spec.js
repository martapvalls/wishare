const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const removeFriendWish = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - save friend wish', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, name, friendId, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, wishId, title, link, price, description 

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

        user.savedWishes.push({user: friendId, wish: wish})
        
        await user.save() 
        
    })

    it('should succeed on correct wish friend removing', async () => {
        
        const response = await removeFriendWish(token, friendId, wishId)

        expect(response).toBeUndefined()

        const _user = await User.findById(id)

        const savedidWish = _user.savedWishes.find(wish => wish.wish.toString() === wishId)
        
        expect(savedidWish).toBeUndefined()

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await removeFriendWish(token, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on wrong friend id ', async () => {
        const friendId = '012345678901234567890123'

        try {
            await removeFriendWish(token, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`there is no friend with id ${friendId}`)
        }
    })

    it('should fail on wrong wish id ', async () => {
        const wishId = '012345678901234567890123'

        try {
            await removeFriendWish(token, friendId, wishId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`friend does not have wish with id ${wishId}`)
        }
    })


    it('should fail on incorrect id and friendId data', () => {
        expect(() => removeFriendWish(1)).toThrow(TypeError, '1 is not a string')
        expect(() => removeFriendWish(true)).toThrow(TypeError, 'true is not a string')
        expect(() => removeFriendWish([])).toThrow(TypeError, ' is not a string')
        expect(() => removeFriendWish({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => removeFriendWish(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => removeFriendWish(null)).toThrow(TypeError, 'null is not a string')

        expect(() => removeFriendWish('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => removeFriendWish(' \t\r')).toThrow(ContentError, 'id is empty or blank')

        expect(() => removeFriendWish(token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => removeFriendWish(token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => removeFriendWish(token, [])).toThrow(TypeError, ' is not a string')
        expect(() => removeFriendWish(token, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => removeFriendWish(token, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => removeFriendWish(token, null)).toThrow(TypeError, 'null is not a string')

        expect(() => removeFriendWish(token, '')).toThrow(ContentError, 'friendId is empty or blank')
        expect(() => removeFriendWish(token, ' \t\r')).toThrow(ContentError, 'friendId is empty or blank')

        expect(() => removeFriendWish(token, friendId, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => removeFriendWish(token, friendId, true)).toThrow(TypeError, 'true is not a string')
        expect(() => removeFriendWish(token, friendId, [])).toThrow(TypeError, ' is not a string')
        expect(() => removeFriendWish(token, friendId, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => removeFriendWish(token, friendId, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => removeFriendWish(token, friendId, null)).toThrow(TypeError, 'null is not a string')

        expect(() => removeFriendWish(token, friendId, '')).toThrow(ContentError, 'wishId is empty or blank')
        expect(() => removeFriendWish(token, friendId, ' \t\r')).toThrow(ContentError, 'wishId is empty or blank')
    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})