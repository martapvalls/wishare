const TEST_DB_URL = process.env.REACT_APP_TEST_DB_URL
const registerUser = require('.')
const { random } = Math
const { errors: { ContentError } } = require('wishare-util')
const { database, models: { User } } = require('wishare-data')
const bcrypt = require('bcryptjs')

describe('logic - register user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let name, surname, email, year, month, day, birthday, password, passwordconfirm

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'
        passwordconfirm = password


        birthday = new Date(year,month-1,day, 2, 0, 0, 0)
        return User.deleteMany()
    })

    it('should succeed on correct credentials', async () => {
        
        const response = await registerUser(name, surname, email, year, month, day, password, passwordconfirm)

        expect(response).toBeUndefined()

        const user = await User.findOne({ email })
        
        expect(user).toBeDefined()

        expect(user.name).toBe(name)
        expect(user.surname).toBe(surname)
        expect(user.email).toBe(email)
        expect(user.birthday.toString()).toBe(birthday.toString())
        expect(user.birthday).toBeInstanceOf(Date)
        const match = await bcrypt.compare(password, user.password)
        expect(match).toBe(true)
    })

    describe('when user already exists', () => {
        beforeEach(() => {
            let  year, month, day

            year = '1999'
            month = '1'
            day = '25'
            const birthday = new Date(`${year},${month},${day}`)

            User.create({ name, surname, email, birthday, password })
        })

        it('should fail on already existing user', async () => {
            try {
                await registerUser(name, surname, email, year, month, day, password, passwordconfirm)

                throw Error('should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                
                expect(error.message).toBeDefined()
                expect(typeof error.message).toBe('string')
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toBe(`user with email ${email} already exists`)
            }
        })
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => registerUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser([])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser('')).toThrow(ContentError, 'name is empty or blank')
        expect(() => registerUser(' \t\r')).toThrow(ContentError, 'name is empty or blank')

        expect(() => registerUser(name, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(name, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(name, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(name, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser(name, '')).toThrow(ContentError, 'surname is empty or blank')
        expect(() => registerUser(name, ' \t\r')).toThrow(ContentError, 'surname is empty or blank')

        expect(() => registerUser(name, surname, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser(name, surname, '')).toThrow(ContentError, 'e-mail is empty or blank')
        expect(() => registerUser(name, surname, ' \t\r')).toThrow(ContentError, 'e-mail is empty or blank')

        expect(() => registerUser(name, surname, email, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, email, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, email, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, email, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, email, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, email, null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser(name, surname, email, year, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, email, year, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, email, year, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, email, year, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, email, year, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, email, year, null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser(name, surname, email, year, month, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(name, surname, email, year, month, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(name, surname, email, year, month, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(name, surname, email, year, month, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(name, surname, email, year, month, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(name, surname, email, year, month, null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser(name, surname, email, year, month, day, '')).toThrow(ContentError, 'password is empty or blank')
        expect(() => registerUser(name, surname, email, year, month, day, ' \t\r')).toThrow(ContentError, 'password is empty or blank')

        expect(() => registerUser(name, surname, email, year, month, day, password, '')).toThrow(ContentError, 'passwordconfirm is empty or blank')
        expect(() => registerUser(name, surname, email, year, month, day, password, ' \t\r')).toThrow(ContentError, 'passwordconfirm is empty or blank')
    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})