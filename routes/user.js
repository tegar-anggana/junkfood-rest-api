const express = require('express')

// controller functions
// const { loginUser, signupUser } = require('../controllers/userController')
const { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore, getUser, getUsers, updateUser } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
// router.post('/login', loginUser)

// signup route
// router.post('/signup', signupUser)

router.post('/signup', createUserToAuthAndFirestore)

router.use(requireAuth)

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUserInAuthAndFirestore)


module.exports = router