const { Router } = require('express')
const { createWish, listWishes, modifyWish, deleteWish, saveWishImage, loadWishImage, givenWish, blockedWish } = require('../../logic')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('wishare-util')
const Busboy = require('busboy')

const jsonBodyParser = bodyParser.json()

const router = Router()

//create the wish, id from token
router.post('/', jsonBodyParser, tokenVerifier, (req, res) => {
    const { id, body: { title, link, price, description } } = req
    try {
        createWish(id, title, link, price, description)
            .then(wishId => res.json(wishId))
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

//list all wishes
router.get('/:id', (req, res) => {
    const { params: { id } } = req
    try {
        listWishes(id)
            .then(wishes => res.json(wishes))
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

// update a wish, wishId from params and id from token, all other inputs from body
router.patch('/:wishId', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, params: { wishId }, body: { title, link, price, description } } = req
        
        modifyWish(id, wishId, title, link, price, description)
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

//delete a wish
router.delete('/:wishId', tokenVerifier, (req, res) => {
    try {
        const { id, params: { wishId } } = req

        deleteWish(id, wishId)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

//endpoint to save wishes images

router.post('/upload/:wishId', tokenVerifier, (req, res) => {
    
    const { id, params: { wishId } } = req
  
    const busboy = new Busboy({ headers: req.headers })

    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        filename = wishId

        await saveWishImage(id, wishId, file, filename)
        
    })

    busboy.on('finish', () => {
        res.end("That's all folks!")
    })

    return req.pipe(busboy)

})

//endpoint download wishes images

router.get('/:id/wish/:wishId', async (req, res) => {

    const { params: { id, wishId } } = req

    const stream = await loadWishImage(id, wishId) 

    res.setHeader('Content-Type', 'image/jpeg')

    return stream.pipe(res)
})

//to mark a wish as given, only the owner of the wish can do it
router.patch('/:wishId/given', tokenVerifier, (req, res) => {
    try {
        const { id, params: { wishId }} = req
 
        givenWish(id, wishId)
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

//to mark a wish as given, only the friends of the owner of the wish can do it
router.patch('/:wishId/:friendId/blocked', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, params: { wishId, friendId } } = req

        blockedWish(id, friendId, wishId)
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


module.exports = router