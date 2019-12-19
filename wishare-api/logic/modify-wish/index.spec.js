require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const modifyWish = require('.')
const { random } = Math
const { errors: { NotFoundError, ContentError } } = require('wishare-util')
const { database, ObjectId, models: { User, Wish } } = require('wishare-data')
const bcrypt = require('bcryptjs')


describe('logic - modify wish', () => {
    before(() => database.connect(TEST_DB_URL))


    let id, title, link, price, description, name, surname, email, birthday, password


    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        year = 1999
        month = 1
        day = 25


        birthday = new Date(year, month - 1, day, 2, 0, 0, 0)

        await Promise.all([User.deleteMany(), Wish.deleteMany()])

        const user = await User.create({ name, surname, email, birthday, password: await bcrypt.hash(password, 10) })

        id = user.id

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


        const response = await modifyWish(id, wishId, newTitle, newLink, newPrice, newDescription)

        expect(response).to.not.exist

        const _user = await User.findById(id)

        const wish = _user.wishes.find(wish => wish.id === wishId)

        expect(wish.id).to.exist
        expect(wish.id.toString()).to.equal(wishId)
        
        expect(wish.title).to.exist
        expect(wish.title).to.be.a('string')
        expect(wish.title).to.have.length.greaterThan(0)
        expect(wish.title).to.equal(newTitle)

        expect(wish.link).to.exist
        expect(wish.link).to.be.a('string')
        expect(wish.link).to.have.length.greaterThan(0)
        expect(wish.link).to.equal(newLink)

        expect(wish.price).to.exist
        expect(wish.price).to.be.a('string')
        expect(wish.price).to.have.length.greaterThan(0)
        expect(wish.price).to.equal(newPrice)

        expect(wish.description).to.exist
        expect(wish.description).to.be.a('string')
        expect(wish.description).to.have.length.greaterThan(0)
        expect(wish.description).to.equal(newDescription)

        expect(wish.lastAccess).to.exist
        expect(wish.lastAccess).to.be.an.instanceOf(Date)


    })

    it('should succeed on correct user and new wish data, except for description', async () => {
        const newTitle = `new-title-${random()}`
        const newLink = `new-title-${random()}`
        const newPrice = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        description = _wish.description

        const response = await modifyWish(id, wishId, newTitle, newLink, newPrice, undefined)

        expect(response).to.not.exist

        const user = await User.findById(id)

        expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).to.exist
        expect(wish.id.toString()).to.equal(wishId)

        expect(wish.title).to.exist
        expect(wish.title).to.be.a('string')
        expect(wish.title).to.have.length.greaterThan(0)
        expect(wish.title).to.equal(newTitle)

        expect(wish.link).to.exist
        expect(wish.link).to.be.a('string')
        expect(wish.link).to.have.length.greaterThan(0)
        expect(wish.link).to.equal(newLink)

        expect(wish.price).to.exist
        expect(wish.price).to.be.a('string')
        expect(wish.price).to.have.length.greaterThan(0)
        expect(wish.price).to.equal(newPrice)

        expect(wish.description).to.exist
        expect(wish.description).to.be.a('string')
        expect(wish.description).to.have.length.greaterThan(0)
        expect(wish.description).to.equal(description)

        expect(wish.lastAccess).to.exist
        expect(wish.lastAccess).to.be.an.instanceOf(Date)
    })
    it('should succeed on correct user and new wish data, except for price', async () => {
        const newTitle = `new-title-${random()}`
        const newLink = `new-title-${random()}`
        const newDescription = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        price = _wish.price

        const response = await modifyWish(id, wishId, newTitle, newLink, undefined, newDescription)

        expect(response).to.not.exist

        const user = await User.findById(id)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).to.exist
        expect(wish.id.toString()).to.equal(wishId)

        expect(wish.title).to.exist
        expect(wish.title).to.be.a('string')
        expect(wish.title).to.have.length.greaterThan(0)
        expect(wish.title).to.equal(newTitle)

        expect(wish.link).to.exist
        expect(wish.link).to.be.a('string')
        expect(wish.link).to.have.length.greaterThan(0)
        expect(wish.link).to.equal(newLink)

        expect(wish.price).to.exist
        expect(wish.price).to.be.a('string')
        expect(wish.price).to.have.length.greaterThan(0)
        expect(wish.price).to.equal(price)

        expect(wish.description).to.exist
        expect(wish.description).to.be.a('string')
        expect(wish.description).to.have.length.greaterThan(0)
        expect(wish.description).to.equal(newDescription)

        expect(wish.lastAccess).to.exist
        expect(wish.lastAccess).to.be.an.instanceOf(Date)
    })
    it('should succeed on correct user and new wish data, except for link', async () => {
        const newTitle = `new-title-${random()}`
        const newPrice = `new-title-${random()}`
        const newDescription = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        link = _wish.link

        const response = await modifyWish(id, wishId, newTitle, undefined, newPrice, newDescription)

        expect(response).to.not.exist

        const user = await User.findById(id)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).to.exist
        expect(wish.id.toString()).to.equal(wishId)

        expect(wish.title).to.exist
        expect(wish.title).to.be.a('string')
        expect(wish.title).to.have.length.greaterThan(0)
        expect(wish.title).to.equal(newTitle)

        expect(wish.link).to.exist
        expect(wish.link).to.be.a('string')
        expect(wish.link).to.have.length.greaterThan(0)
        expect(wish.link).to.equal(link)

        expect(wish.price).to.exist
        expect(wish.price).to.be.a('string')
        expect(wish.price).to.have.length.greaterThan(0)
        expect(wish.price).to.equal(newPrice)

        expect(wish.description).to.exist
        expect(wish.description).to.be.a('string')
        expect(wish.description).to.have.length.greaterThan(0)
        expect(wish.description).to.equal(newDescription)

        expect(wish.lastAccess).to.exist
        expect(wish.lastAccess).to.be.an.instanceOf(Date)
    })

    it('should succeed on correct user and new wish data, except for title', async () => {
        const newLink = `new-title-${random()}`
        const newPrice = `new-title-${random()}`
        const newDescription = `new-title-${random()}`

        const _user = await User.findById(id)

        const _wish = _user.wishes.find(wish => wish.id === wishId)

        title = _wish.title

        const response = await modifyWish(id, wishId, undefined, newLink, newPrice, newDescription)

        expect(response).to.not.exist

        const user = await User.findById(id)

        const wish = user.wishes.find(wish => wish.id === wishId)
        

        expect(wish.id).to.exist
        expect(wish.id.toString()).to.equal(wishId)

        expect(wish.title).to.exist
        expect(wish.title).to.be.a('string')
        expect(wish.title).to.have.length.greaterThan(0)
        expect(wish.title).to.equal(title)

        expect(wish.link).to.exist
        expect(wish.link).to.be.a('string')
        expect(wish.link).to.have.length.greaterThan(0)
        expect(wish.link).to.equal(newLink)

        expect(wish.price).to.exist
        expect(wish.price).to.be.a('string')
        expect(wish.price).to.have.length.greaterThan(0)
        expect(wish.price).to.equal(newPrice)

        expect(wish.description).to.exist
        expect(wish.description).to.be.a('string')
        expect(wish.description).to.have.length.greaterThan(0)
        expect(wish.description).to.equal(newDescription)

        expect(wish.lastAccess).to.exist
        expect(wish.lastAccess).to.be.an.instanceOf(Date)
    })

    it('should fail on wrong user id', async () => {
        id = 'wrongid'
        const newTitle = `new-title-${random()}`
        const newLink = `new-title-${random()}`
        const newPrice = `new-title-${random()}`
        const newDescription = `new-description-${random()}`
    
        try {
            await modifyWish(id, wishId, newTitle, newLink, newPrice, newDescription)
    
            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })
    it('should fail on incorrect id, wishid, title, link, price or description', () => {

        expect(() => modifyWish(1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyWish(true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyWish([])).to.throw(TypeError, ' is not a string')
        expect(() => modifyWish({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => modifyWish(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => modifyWish(null)).to.throw(TypeError, 'null is not a string')
    
        expect(() => modifyWish('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => modifyWish(' \t\r')).to.throw(ContentError, 'id is empty or blank')
    
        expect(() => modifyWish(id, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyWish(id, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyWish(id, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyWish(id, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => modifyWish(id, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => modifyWish(id, null)).to.throw(TypeError, 'null is not a string')
        
    
        expect(() => modifyWish(id, '')).to.throw(ContentError, 'wishId is empty or blank')
        expect(() => modifyWish(id, ' \t\r')).to.throw(ContentError, 'wishId is empty or blank')
    
        expect(() => modifyWish(id, wishId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyWish(id, wishId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyWish(id, wishId, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyWish(id, wishId, {})).to.throw(TypeError, '[object Object] is not a string')

        expect(() => modifyWish(id, wishId, ' \t\r')).to.throw(ContentError, 'title is empty or blank')
    
        expect(() => modifyWish(id, wishId, title, 1)).to.throw (TypeError, '1 is not a string')
        expect(() => modifyWish(id, wishId, title, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyWish(id, wishId, title, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyWish(id, wishId, title, {})).to.throw(TypeError, '[object Object] is not a string')

        expect(() => modifyWish(id, wishId, title, ' \t\r')).to.throw(ContentError, 'link is empty or blank')
    
        expect(() => modifyWish(id, wishId, title, link, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyWish(id, wishId, title, link, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyWish(id, wishId, title, link, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyWish(id, wishId, title, link, {})).to.throw(TypeError, '[object Object] is not a string')
   
        expect(() => modifyWish(id, wishId, title, link, ' \t\r')).to.throw(ContentError, 'price is empty or blank')
   
        expect(() => modifyWish(id, wishId, title, link, price, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => modifyWish(id, wishId, title, link, price, true)).to.throw(TypeError, 'true is not a string')
        expect(() => modifyWish(id, wishId, title, link, price, [])).to.throw(TypeError, ' is not a string')
        expect(() => modifyWish(id, wishId, title, link, price, {})).to.throw(TypeError, '[object Object] is not a string')
       
        expect(() => modifyWish(id, wishId, title, link, price, ' \t\r')).to.throw(ContentError, 'description is empty or blank')

    })
    after(() => User.deleteMany().then(database.disconnect))
})