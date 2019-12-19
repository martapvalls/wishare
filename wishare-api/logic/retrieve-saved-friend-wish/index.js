const { validate, errors: { NotFoundError, ContentError } } = require('wishare-util')
const { ObjectId, models: { User } } = require('wishare-data')


/**
* Retrieves friends birthdays and calculates if less than a week remains
* 
* @param {ObjectId} id user id
* 
* @returns {Promise} with friend and wish data
*/

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        let user = await User.findById(id)
        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        user = await User.findById(id).populate('savedWishes.user', 'id name')

        let savedWishes = user.savedWishes.toObject()

        let response = []

        savedWishes.forEach(savedWish =>{
            response.push({
                name: savedWish.user.name,
                id: savedWish.user._id.toString(),
                wish: savedWish.wish._id.toString(),
                title: savedWish.wish.title,
                link: savedWish.wish.link,
                price: savedWish.wish.price,
                description: savedWish.wish.description,
                blocked: savedWish.wish.blocked,
                given: savedWish.wish.given
            })
        })
        return response
    })()
}
