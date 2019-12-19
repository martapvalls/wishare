const TEST_DB_URL = process.env.REACT_APP_TEST_DB_URL
const authenticateUser = require('.')
const { random } = Math
const { errors: { ContentError, CredentialsError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let id, name, surname, email, year, month, day, birthday, password

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = 1999
        month = 1
        day = 25


        birthday = new Date(`${year},${month},${day}`)

        await User.deleteMany()
        
        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id
    })

    it('should succeed on correct credentials', async () => {

        const token = await authenticateUser(email, password)

        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(0)

        const [, payload,] = token.split('.')

        const { sub } = JSON.parse(atob(payload))

        expect(id).toBe(sub)
    })

    describe('when wrong credentials', () => {
        it('should fail on wrong email', async () => {
            const email = 'wrong'

            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(CredentialsError)

                const { message } = error
                expect(message).toBe(`wrong e-mail`)
            }
        })

        it('should fail on wrong password', async () => {
            const password = 'wrong'

            try {
                await authenticateUser(email, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(CredentialsError)

                const { message } = error
                expect(message).toBe(`wrong password`)
            }
        })
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => authenticateUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser([])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser('')).toThrow(ContentError, 'email is empty or blank')
        expect(() => authenticateUser(' \t\r')).toThrow(ContentError, 'email is empty or blank')

        expect(() => authenticateUser(email, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(email, true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser(email, [])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser(email, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(email, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(email, null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser(email, '')).toThrow(ContentError, 'password is empty or blank')
        expect(() => authenticateUser(email, ' \t\r')).toThrow(ContentError, 'password is empty or blank')
    })

    // TODO other cases

    afterAll(() => User.deleteMany().then(database.disconnect))
})