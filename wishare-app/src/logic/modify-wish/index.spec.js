const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const modifyWish = require('.')
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../helpers/jest-matchers')



describe('logic - modify wish', () => {
    beforeAll(() => database.connect(TEST_DB_URL))


    let id, token, wishId, title, link, price, description, name, surname, email, birthday, password, year, month, day


    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        year = '1999'
        month = '1'
        day = '25'


        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        await User.deleteMany()

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

        token = jwt.sign({ sub:id }, TEST_SECRET)

        title = `title-${random()}`
        link = `link-${random()}`
        price = `price-${random()}@mail.com`
        description = `description-${random()}`

        const wish = new Wish({ title, link, price, description })

        wishId = wish.id

        user.wishes.push(wish)
        await user.save()
    })


    it('should succeed on retrieveing user wishes', async () => {

        const newTitle = `new-title-${random()}`
        const newLink = `new-title-${random()}`
        const newPrice = `new-title-${random()}`
        const newDescription = `new-description-${random()}`


        const response = await modifyWish(token, wishId, newTitle, newLink, newPrice, newDescription)

        expect(response).toBeUndefined()

        const _user = await User.findById(id)

        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish.id).toBeDefined()
        expect(wish.id.toString()).toBe(wishId)
        
        expect(wish.title).toBeDefined()
        expect(wish.title).toBeOfType('string')
        expect(wish.title.length).toBeGreaterThan(0)
        expect(wish.title).toBe(newTitle)

        expect(wish.link).toBeDefined()
        expect(wish.link).toBeOfType('string')
        expect(wish.link.length).toBeGreaterThan(0)
        expect(wish.link).toBe(newLink)

        expect(wish.price).toBeDefined()
        expect(wish.price).toBeOfType('string')
        expect(wish.price.length).toBeGreaterThan(0)
        expect(wish.price).toBe(newPrice)

        expect(wish.description).toBeDefined()
        expect(wish.description).toBeOfType('string')
        expect(wish.description.length).toBeGreaterThan(0)
        expect(wish.description).toBe(newDescription)


    })

    it('should succeed on correct user and new wish data, except for description', async () => {
        const newTitle = `new-title-${random()}`
        const newLink = `new-title-${random()}`
        const newPrice = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        description = _wish.description

        const response = await modifyWish(token, wishId, newTitle, newLink, newPrice, undefined)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).toBeDefined()
        expect(wish.id.toString()).toBe(wishId)

        expect(wish.title).toBeDefined()
        expect(wish.title).toBeOfType('string')
        expect(wish.title.length).toBeGreaterThan(0)
        expect(wish.title).toBe(newTitle)

        expect(wish.link).toBeDefined()
        expect(wish.link).toBeOfType('string')
        expect(wish.link.length).toBeGreaterThan(0)
        expect(wish.link).toBe(newLink)

        expect(wish.price).toBeDefined()
        expect(wish.price).toBeOfType('string')
        expect(wish.price.length).toBeGreaterThan(0)
        expect(wish.price).toBe(newPrice)

        expect(wish.description).toBeDefined()
        expect(wish.description).toBeOfType('string')
        expect(wish.description.length).toBeGreaterThan(0)
        expect(wish.description).toBe(description)
    })
    it('should succeed on correct user and new wish data, except for price', async () => {
        const newTitle = `new-title-${random()}`
        const newLink = `new-title-${random()}`
        const newDescription = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        price = _wish.price

        const response = await modifyWish(token, wishId, newTitle, newLink, undefined, newDescription)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).toBeDefined()
        expect(wish.id.toString()).toBe(wishId)

        expect(wish.title).toBeDefined()
        expect(wish.title).toBeOfType('string')
        expect(wish.title.length).toBeGreaterThan(0)
        expect(wish.title).toBe(newTitle)

        expect(wish.link).toBeDefined()
        expect(wish.link).toBeOfType('string')
        expect(wish.link.length).toBeGreaterThan(0)
        expect(wish.link).toBe(newLink)

        expect(wish.price).toBeDefined()
        expect(wish.price).toBeOfType('string')
        expect(wish.price.length).toBeGreaterThan(0)
        expect(wish.price).toBe(price)

        expect(wish.description).toBeDefined()
        expect(wish.description).toBeOfType('string')
        expect(wish.description.length).toBeGreaterThan(0)
        expect(wish.description).toBe(newDescription)
    })
    it('should succeed on correct user and new wish data, except for link', async () => {
        const newTitle = `new-title-${random()}`
        const newPrice = `new-title-${random()}`
        const newDescription = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        link = _wish.link

        const response = await modifyWish(token, wishId, newTitle, undefined, newPrice, newDescription)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).toBeDefined()
        expect(wish.id.toString()).toBe(wishId)

        expect(wish.title).toBeDefined()
        expect(wish.title).toBeOfType('string')
        expect(wish.title.length).toBeGreaterThan(0)
        expect(wish.title).toBe(newTitle)

        expect(wish.link).toBeDefined()
        expect(wish.link).toBeOfType('string')
        expect(wish.link.length).toBeGreaterThan(0)
        expect(wish.link).toBe(link)

        expect(wish.price).toBeDefined()
        expect(wish.price).toBeOfType('string')
        expect(wish.price.length).toBeGreaterThan(0)
        expect(wish.price).toBe(newPrice)

        expect(wish.description).toBeDefined()
        expect(wish.description).toBeOfType('string')
        expect(wish.description.length).toBeGreaterThan(0)
        expect(wish.description).toBe(newDescription)
    })

    it('should succeed on correct user and new wish data, except for title', async () => {
        const newLink = `new-title-${random()}`
        const newPrice = `new-title-${random()}`
        const newDescription = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        title = _wish.title

        const response = await modifyWish(token, wishId, undefined, newLink, newPrice, newDescription)

        expect(response).toBeUndefined()

        const user = await User.findById(id)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).toBeDefined()
        expect(wish.id.toString()).toBe(wishId)

        expect(wish.title).toBeDefined()
        expect(wish.title).toBeOfType('string')
        expect(wish.title.length).toBeGreaterThan(0)
        expect(wish.title).toBe(title)

        expect(wish.link).toBeDefined()
        expect(wish.link).toBeOfType('string')
        expect(wish.link.length).toBeGreaterThan(0)
        expect(wish.link).toBe(newLink)

        expect(wish.price).toBeDefined()
        expect(wish.price).toBeOfType('string')
        expect(wish.price.length).toBeGreaterThan(0)
        expect(wish.price).toBe(newPrice)

        expect(wish.description).toBeDefined()
        expect(wish.description).toBeOfType('string')
        expect(wish.description.length).toBeGreaterThan(0)
        expect(wish.description).toBe(newDescription)
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        const token = jwt.sign({ sub: id }, TEST_SECRET)

        const newTitle = `new-title-${random()}`
        const newLink = `new-title-${random()}`
        const newPrice = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
    
        try {
            await modifyWish(token, wishId, newTitle, newLink, newPrice, newDescription)
    
            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id, wishid, title, link, price or description', () => {

        expect(() => modifyWish(1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyWish(true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyWish([])).toThrow(TypeError, ' is not a string')
        expect(() => modifyWish({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => modifyWish(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => modifyWish(null)).toThrow(TypeError, 'null is not a string')
    
        expect(() => modifyWish('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => modifyWish(' \t\r')).toThrow(ContentError, 'id is empty or blank')
    
        expect(() => modifyWish(token, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyWish(token, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyWish(token, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyWish(token, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => modifyWish(token, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => modifyWish(token, null)).toThrow(TypeError, 'null is not a string')
        
    
        expect(() => modifyWish(token, '')).toThrow(ContentError, 'wishId is empty or blank')
        expect(() => modifyWish(token, ' \t\r')).toThrow(ContentError, 'wishId is empty or blank')
    
        expect(() => modifyWish(token, wishId, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyWish(token, wishId, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyWish(token, wishId, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyWish(token, wishId, {})).toThrow(TypeError, '[object Object] is not a string')

        expect(() => modifyWish(token, wishId, ' \t\r')).toThrow(ContentError, 'title is empty or blank')
    
        expect(() => modifyWish(token, wishId, title, 1)).toThrow (TypeError, '1 is not a string')
        expect(() => modifyWish(token, wishId, title, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyWish(token, wishId, title, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyWish(token, wishId, title, {})).toThrow(TypeError, '[object Object] is not a string')

        expect(() => modifyWish(token, wishId, title, ' \t\r')).toThrow(ContentError, 'link is empty or blank')
    
        expect(() => modifyWish(token, wishId, title, link, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyWish(token, wishId, title, link, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyWish(token, wishId, title, link, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyWish(token, wishId, title, link, {})).toThrow(TypeError, '[object Object] is not a string')
   
        expect(() => modifyWish(token, wishId, title, link, ' \t\r')).toThrow(ContentError, 'price is empty or blank')
   
        expect(() => modifyWish(token, wishId, title, link, price, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => modifyWish(token, wishId, title, link, price, true)).toThrow(TypeError, 'true is not a string')
        expect(() => modifyWish(token, wishId, title, link, price, [])).toThrow(TypeError, ' is not a string')
        expect(() => modifyWish(token, wishId, title, link, price, {})).toThrow(TypeError, '[object Object] is not a string')
       
        expect(() => modifyWish(token, wishId, title, link, price, ' \t\r')).toThrow(ContentError, 'description is empty or blank')

    })
    afterAll(() => User.deleteMany().then(database.disconnect))
})