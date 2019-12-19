const { Router } = require('express')
const { registerUser, authenticateUser, retrieveUser, modifyUser, deleteUser, saveProfileImage, loadProfileImage, retrieveUsers, searchUsers } = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('wishare-util')
const Busboy = require('busboy')

const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/', jsonBodyParser, (req, res) => {
    const { body: { name, surname, email, year, month, day, password, passwordconfirm } } = req

    try {
        registerUser(name, surname, email, year, month, day, password, passwordconfirm)
            .then(() => res.status(201).end())
            .catch(error => {
                const { message } = error

                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { email, password } } = req

    try {
        authenticateUser(email, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, SECRET, { expiresIn: '1d' })

                res.json({ token })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/user', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveUser(id)
            .then(user => res.json(user))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

router.patch('/update', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id , body: { year, month, day, password, description } } = req
  
        modifyUser(id, year, month, day, password, description)
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

router.delete('/:id', tokenVerifier, (req, res) => {
    try {
        const { params: { id } } = req
        deleteUser(id)
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


router.post('/uploadimage',tokenVerifier, (req, res) => {
    
    const { id } = req
  
    const busboy = new Busboy({ headers: req.headers })
    
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        filename = 'profile'

        await saveProfileImage(id, file, filename)
        
        // let saveTo = path.join(__dirname, `../../data/users/${id}/` + filename +'.png')
        // file.pipe(fs.createWriteStream(saveTo))
    })

    busboy.on('finish', () => {
        res.end("That's all folks!")
    })

    return req.pipe(busboy)

})

router.get('/profileimage/:id', async (req, res) => {

    const { params: { id } } = req

    const stream = await loadProfileImage(id) 
    //let goTo = path.join(__dirname, `../../data/users/${id}/profile.png`)
    //stream = fs.createReadStream(goTo)

    res.setHeader('Content-Type', 'image/jpeg')

    return stream.pipe(res)
})

router.get('/', (req, res) => {
    try {

        retrieveUsers()
            .then(users => res.json(users))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

router.get('/search/:query', jsonBodyParser, (req, res) => {
    try {
        
        const { params: { query } } = req
        
        searchUsers(query)
            .then(users => res.json(users))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})


// router.post('/upload', tokenVerifier, (req, res) => {
    
//     const { id } = req
  
//     const busboy = new Busboy({ headers: req.headers })

//     busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//         filename = 'profile'
        
//         let saveTo = path.join(__dirname, `../../data/users/${id}/` + filename +'.png')
//         file.pipe(fs.createWriteStream(saveTo))
//     })

//     busboy.on('finish', () => {
//         res.end("That's all folks!")
//     })

//     return req.pipe(busboy)

// })


// router.get('/userimage', tokenVerifier, (req, res) => {

//     const { id } = req

//     fs.createReadStream(`../../data/users/${id}/` + 'profile.png').pipe(res)


// })


module.exports = router