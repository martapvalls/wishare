require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const deleteUser = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - delete user', () => {
    before(() => database.connect(TEST_DB_URL))

    let iduser, name, surname, email, year, month, day, birthday, password, passwordconfirm

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        year = 1999
        month = 1
        day = 25
        passwordconfirm = password


        birthday = new Date(year,month-1,day, 2, 0, 0, 0)

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        iduser = user.id
    })

    it('should succeed on correct user data delete', async () => {
        const id = iduser

        const response = await deleteUser(id)

        expect(response).to.not.exist

        const user = await User.findById(id)

        expect(user).to.not.exist

    })
    it('should fail on unexisting user ', async () => {
        const id = 'a913jdjsjssj'

        try {
            await deleteUser(id)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id data', () => {
        const wrongId = 'wrong id'

        expect(() => deleteUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => deleteUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => deleteUser([])).to.throw(TypeError, ' is not a string')
        expect(() => deleteUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => deleteUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => deleteUser(null)).to.throw(TypeError, 'null is not a string')
    
        expect(() => deleteUser('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => deleteUser(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        expect(() => deleteUser(wrongId)).to.throw(ContentError,  `${wrongId} is not a valid id`)
    
     })
    
    after(() => User.deleteMany().then(database.disconnect))
})