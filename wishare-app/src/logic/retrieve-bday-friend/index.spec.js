const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const retrieveFriendBday = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')

describe('logic - retrieve friend bday', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, token, name, surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, birthdayfriend2, password1, email2, birthday2, friendId, friend2Id, friendName, birthdayfriend
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
        password1 = `password-${random()}`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        email2 = `email-${random()}@mail.com`
        birthday2 = new Date(1990, 11, 12, 2, 0, 0, 0)

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday2, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        friendId = friend.id
        friend2Id = friend2.id

        friendName = friend.name

        user.friends.push(friendId.toString())
        user.friends.push(friend2Id.toString())

        birthdayfriend = friend.birthday
        birthdayfriend2 = friend2.birthday

        user.birthdayFriends.push({user: friendId.toString(), birthday: birthdayfriend})
        user.birthdayFriends.push({user: friend2Id.toString(), birthday: birthdayfriend2})

        await user.save()
        
    })

    it('should succeed on correct friend birthday', async () => {
        
        const response = await retrieveFriendBday(token)

        expect(response).toBeDefined()
        expect(response.length).toBeGreaterThan(0)
        expect(response[0].id).toBe(friend2Id)
        expect(response[0].name).toBe(friendName)
        expect(response[0].birthday).toBeDefined()

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        try {
            await retrieveFriendBday(token)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    
   
    it('should fail on incorrect id', () => {
        expect(() => retrieveFriendBday(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveFriendBday(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveFriendBday([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveFriendBday({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriendBday(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveFriendBday(null)).toThrow(TypeError, 'null is not a string')

        expect(() => retrieveFriendBday('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => retrieveFriendBday(' \t\r')).toThrow(ContentError, 'id is empty or blank')
        
    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})