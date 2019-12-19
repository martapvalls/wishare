const { validate, errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, models: { User, Wish } } = require('wishare-data')
const fs = require('fs')

/**
 * function to creat a new wish 
 * 
 * @param {string} id of user 
 * @param {String} title wish
 * @param {String} link wish
 * @param {String} price wish
 * @param {String} description wish 
 * 
 * @returns {Promise}
 * 
 */

module.exports = function ( id, title, link, price, description) {

    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)
    
    validate.string(title)
    validate.string.notVoid('title', title)

    validate.string(link)
    validate.string.notVoid('link', link)

    validate.string(price)
    validate.string.notVoid('price', price)

    validate.string(description)
    validate.string.notVoid('description', description)

    return (async () => {

        const user = await User.findById(id)        
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        
        const wish = new Wish({ title, link, price, description })
        
        user.wishes.push(wish)
        
        await user.save()
        
        const dir = `./data/users/${id}/wishes`
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        return wish.id
    })()
}