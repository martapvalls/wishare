require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveUsers = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve users', () => {
    before(() => database.connect(TEST_DB_URL))

    let id1, id2, name, surname, email, year, month, day, birthday, password, ids, emails

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = 1999
        month = 1
        day = 25
        passwordconfirm = password

        email2 = `email2-${random()}@mail.com`


        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        await User.deleteMany()

        const user1 = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })
        const user2 = await User.create({ name, surname, email: email2, birthday, password: await bcrypt.hash(password, 10) })

        id1 = user1.id
        id2 = user2.id
        
        ids = []
        ids.push(id1, id2)

        email1 = user1.email
        email2 = user2.email

        emails = []
        emails.push(email1, email2)
    })

    it('should succeed on correct retrieving users', async () => {
        const users = await retrieveUsers()

        expect(users).to.exist
        expect(users).to.have.length

        users.forEach(user => {
            
            expect(user).to.exist
            expect(user.id).to.be.oneOf(ids)
            expect(user.id).to.be.a('string')
            expect(user._id).to.not.exist

            expect(user.name).to.equal(name)
            expect(user.name).to.be.a('string')

            expect(user.surname).to.equal(surname)
            expect(user.surname).to.be.a('string')

            expect(user.email).to.be.oneOf(emails)
            expect(user.email).to.be.a('string')

            expect(user.birthday.toString()).to.equal(birthday.toString())
            expect(user.birthday).to.be.an.instanceOf(Date)
        })

    })


    after(() => User.deleteMany().then(database.disconnect))
})