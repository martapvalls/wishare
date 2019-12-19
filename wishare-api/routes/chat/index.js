const { Router } = require('express')
const { createChat, retrieveChat, sendMessage } = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError } } = require('wishare-util')
const Busboy = require('busboy')

const jsonBodyParser = bodyParser.json()

const router = Router()

//create the chat by the owner id, the id comes by token
router.post('/', tokenVerifier, (req, res) => {    
    try {
        const { id } = req
        createChat(id)
            .then(chatId =>{ 
                res.status(201)
                res.json({ chatId }).end()
            })
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

//retrieve chat by chatId, it comes by params
router.get('/:userId', tokenVerifier, (req, res) => {    
    try {
        const { id, params:{userId}} = req
        retrieveChat(id, userId)
            .then(chat =>{ 
                res.status(201)
                res.json({ chat }).end()
            })
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


//send a message on chat
router.post('/message/:userId', tokenVerifier, jsonBodyParser, (req, res) => {
    try {

        const { id, body: { text }, params: { userId } } = req

        sendMessage(id, userId, text)
            .then(() => res.status(201).end())
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