require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveFriendBday = require('.')
const { errors: { NotFoundError, ContentError, ConflictError } } = require('wishare-util')
const { database, ObjectId, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve friend bday', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, friendName,  surname, email, year, month, day, birthday, password, name1, surname1, email1, year1, month1, day1, birthday1, birthdayfriend2

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        passwordconfirm = password
        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        name1 = `name-${random()}`
        surname1 = `surname-${random()}`
        email1 = `email-${random()}@mail.com`
        username1 = `username-${random()}`
        password1 = `password-${random()}`
        year1 = '1999'
        month1 = '1'
        day1 = '25'
        passwordconfirm1 = password
        birthday1 = new Date(year1, month1 - 1, day1, 2, 0, 0, 0)

        email2 = `email-${random()}@mail.com`
        birthday2 = new Date(1990, 11, 12, 2, 0, 0, 0)

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const friend = await User.create({ name: name1, surname: surname1, email: email1, birthday: birthday1, password: await bcrypt.hash(password, 10) })
        const friend2 = await User.create({ name: name1, surname: surname1, email: email2, birthday: birthday2, password: await bcrypt.hash(password, 10) })

        id = user.id
        friendName = friend.name
        friendId = friend.id
        friend2Id = friend2.id

        user.friends.push(friendId.toString())
        user.friends.push(friend2Id.toString())

        const birthdayfriend = friend.birthday
        const birthdayfriend2 = friend2.birthday

        user.birthdayFriends.push({user: friendId.toString(), birthday: birthdayfriend})
        user.birthdayFriends.push({user: friend2Id.toString(), birthday: birthdayfriend2})

        await user.save()
        
    })

    it('should succeed on correct friend birthday', async () => {

        const response = await retrieveFriendBday(id)

        expect(response).to.exist
        expect(response.length).to.be.greaterThan(0)
        expect(response[0].id).to.equal(friend2Id)
        expect(response[0].birthday).to.exist
        expect(response[0].name).to.equal(friendName)

    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await retrieveFriendBday(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    
   
    it('should fail on incorrect id', () => {
        const wrongId = 'wrong id'
        expect(() => retrieveFriendBday(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveFriendBday(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveFriendBday([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveFriendBday({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveFriendBday(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveFriendBday(null)).to.throw(TypeError, 'null is not a string')

        expect(() => retrieveFriendBday('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriendBday(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveFriendBday(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

    })

    after(() => User.deleteMany().then(database.disconnect))
})