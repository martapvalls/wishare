require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const modifyUser = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - modify user', () => {
    before(() => database.connect(TEST_DB_URL))

    let iduser, name, surname, email, year, month, day, birthday, password

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

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        iduser = user.id
    })

    it('should succeed on correct user data', async () => {
        const id = iduser
        const newYear = '1991'
        const newMonth = '2'
        const newDay = '6'
        const newPassword = `new-password-${random()}`
        const newDescription = `new-description-${random()}`

        const response = await modifyUser(id, newDay, newMonth, newYear, newPassword, newDescription)

        expect(response).to.not.exist

        const user = await User.findById(id)

        let newbday = new Date(newYear, newMonth - 1, newDay, 2, 0, 0, 0)

        expect(user.birthday).to.exist
        expect(user.birthday).to.be.an.instanceOf(Date)
        expect(user.birthday.toString()).to.equal(newbday.toString())

        expect(user.password).to.exist
        expect(user.password).to.be.a('string')
        expect(user.password).to.have.length.greaterThan(0)
        const match = await bcrypt.compare(newPassword, user.password)
        expect(match).to.be.true

        expect(user.description).to.exist
        expect(user.description).to.be.a('string')
        expect(user.description).to.have.length.greaterThan(0)
        expect(user.description).to.equal(newDescription)

        expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date)

    })
    it('should succed on correct user and new data, except for birthday', async () => {
        const id = iduser
        const newPassword = `new-password-${random()}`
        const newDescription = `new-description-${random()}`

        const { birthday } = await User.findById(id)

        const response = await modifyUser(id, undefined, undefined, undefined, newPassword, newDescription)

        expect(response).to.not.exist

        const user = await User.findById(id)

        expect(user.birthday).to.exist
        expect(user.birthday).to.be.an.instanceOf(Date)
        expect(user.birthday.toString()).to.equal(birthday.toString())

        expect(user.password).to.exist
        expect(user.password).to.be.a('string')
        expect(user.password).to.have.length.greaterThan(0)
        const match = await bcrypt.compare(newPassword, user.password)
        expect(match).to.be.true

        expect(user.description).to.exist
        expect(user.description).to.be.a('string')
        expect(user.description).to.have.length.greaterThan(0)
        expect(user.description).to.equal(newDescription)

        expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date)
    })
    it('should succed on correct user and new data, except for password', async () => {
        const id = iduser
        const newYear = '1991'
        const newMonth = '2'
        const newDay = '6'
        const newDescription = `new-description-${random()}`

        const { password } = await User.findById(id)

        const response = await modifyUser(id, newDay, newMonth, newYear, undefined, newDescription)

        expect(response).to.not.exist

        const user = await User.findById(id)

        let newbday = new Date(newYear, newMonth - 1, newDay, 2, 0, 0, 0)

        expect(user.birthday).to.exist
        expect(user.birthday).to.be.an.instanceOf(Date)
        expect(user.birthday.toString()).to.equal(newbday.toString())

        expect(user.password).to.exist
        expect(user.password).to.be.a('string')
        expect(user.password).to.have.length.greaterThan(0)
        expect(user.password).to.equal(password)

        expect(user.description).to.exist
        expect(user.description).to.be.a('string')
        expect(user.description).to.have.length.greaterThan(0)
        expect(user.description).to.equal(newDescription)

        expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date)
    })
    it('should succed on correct user and new data, except for description', async () => {
        const id = iduser
        const newYear = '1991'
        const newMonth = '2'
        const newDay = '6'
        const newPassword = `new-password-${random()}`

        const { description } = await User.findById(id)

        const response = await modifyUser(id, newDay, newMonth, newYear, newPassword, undefined)

        expect(response).to.not.exist

        const user = await User.findById(id)

        let newbday = new Date(newYear, newMonth - 1, newDay, 2, 0, 0, 0)

        expect(user.birthday).to.exist
        expect(user.birthday).to.be.an.instanceOf(Date)
        expect(user.birthday.toString()).to.equal(newbday.toString())

        expect(user.password).to.exist
        expect(user.password).to.be.a('string')
        expect(user.password).to.have.length.greaterThan(0)
        const match = await bcrypt.compare(newPassword, user.password)
        expect(match).to.be.true

        expect(user.description).to.equal(description)

        expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date)
    })
    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await modifyUser(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id, year, month, day, password and description type and content', () => {
        const wrongId = 'wrongid'

        expect(() => modifyUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyUser([])).to.throw(TypeError, ' is not a string')
        expect(() => modifyUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => modifyUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => modifyUser(null)).to.throw(TypeError, 'null is not a string')

        expect(() => modifyUser('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => modifyUser(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => modifyUser(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)

        expect(() => modifyUser(iduser, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyUser(iduser, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyUser(iduser, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyUser(iduser, {})).to.throw(TypeError, '[object Object] is not a string')


        expect(() => modifyUser(iduser, year, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyUser(iduser, year, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyUser(iduser, year, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyUser(iduser, year, {})).to.throw(TypeError, '[object Object] is not a string')

        expect(() => modifyUser(iduser, year, month, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyUser(iduser, year, month, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyUser(iduser, year, month, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyUser(iduser, year, month, {})).to.throw(TypeError, '[object Object] is not a string')

        expect(() => modifyUser(iduser, year, month, day, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyUser(iduser, year, month, day, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyUser(iduser, year, month, day, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyUser(iduser, year, month, day, {})).to.throw(TypeError, '[object Object] is not a string')

        expect(() => modifyUser(iduser, year, month, day, password, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyUser(iduser, year, month, day, password, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyUser(iduser, year, month, day, password, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyUser(iduser, year, month, day, password, {})).to.throw(TypeError, '[object Object] is not a string')

    })
    after(() => User.deleteMany().then(database.disconnect))
})