const { validate, errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')

/**
 * function to modify data of an existing wish 
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

module.exports = function ( id, wishId, title, link, price, description) {

    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new NotFoundError(`user with id ${id} not found`)

    validate.string(wishId)
    validate.string.notVoid('wishId', wishId)
    if (!ObjectId.isValid(wishId)) throw new NotFoundError(`wish with${wishId} not found`)
    
    if(title){
    validate.string(title)
    validate.string.notVoid('title', title)}

    if(link){
    validate.string(link)
    validate.string.notVoid('link', link)}

    if(price){
    validate.string(price)
    validate.string.notVoid('price', price)}

    if(description){
    validate.string(description)
    validate.string.notVoid('description', description)}

    return (async () => {
        const user = await User.findById(id)        
        if (!user) throw new NotFoundError(`user with id ${id} not found`)
        
        const wish = user.wishes.find(wish => wish.id === wishId)        
        if (!wish) throw new NotFoundError(`user does not have task with id ${wishId}`)

        user.lastAccess = new Date

        await user.save()

        title && (wish.title = title)
        link && (wish.link = link)
        price && (wish.price = price)
        description && (wish.description = description)
        wish.lastAccess = new Date
       
        await User.updateOne(
            { _id: ObjectId(id) },
            { $set: { "wishes.$[wish]" : wish} },
            { arrayFilters: [ { "wish._id": ObjectId(wishId)  } ] }
        )

    })()
}