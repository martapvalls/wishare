const { Router } = require('express')
const { addFriend, deleteFriend, saveFriendWish, retrieveFriendWish, removeFriendWish, retrieveBirthdayFriends, retrieveFriends, retrieveFriend } = require('../../logic')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('wishare-util')


const jsonBodyParser = bodyParser.json()

const router = Router()

// add a friend in user friend list, id from token and friendId from params
router.post('/:friendId', tokenVerifier, (req, res) => {
    try {
        const { id, params: { friendId } } = req

        addFriend(id, friendId)
            .then(friend => res.json(friend))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

//delete a friend from user friends list
router.delete('/:friendId', tokenVerifier, (req, res) => {
    try {
        const { id, params: { friendId } } = req
        deleteFriend(id, friendId)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

//save a friend wish in user wishes saved list
router.post('/wish/:friendId', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, params: { friendId }, body: { wishId } } = req

        saveFriendWish(id, friendId, wishId)
            .then(wish => res.json(wish))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

//retrieve saved friends wishes

router.get('/wishes', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveFriendWish(id)
            .then(savedWish => res.json(savedWish))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

//delete a friend wish in user wishes saved list
router.delete('/wish/:friendId', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, params: { friendId }, body: { wishId } } = req

        removeFriendWish(id, friendId, wishId)
            .then(wish => res.json(wish))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

//get friends birthday if it's less than a week to be
router.get('/birthday', tokenVerifier, (req, res) => {
    try {
        const { id } = req
        retrieveBirthdayFriends(id)
            .then(birthdays => res.json(birthdays))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

//retrieve all friends 
router.get('/', tokenVerifier, (req, res) => {
    try {
        const { id } = req
        retrieveFriends(id)
            .then(friends => res.json(friends))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

//retrieve a friend
router.get('/:friendId', tokenVerifier, (req, res) => {
    try {
        const { id , params: { friendId } } = req
        retrieveFriend(id, friendId)
            .then(friend => res.json(friend))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


module.exports = router