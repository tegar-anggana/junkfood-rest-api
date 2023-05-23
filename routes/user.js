const express = require('express')

// controller functions
// const { loginUser, signupUser } = require('../controllers/userController')
const { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore, getUser, getUsers, updateUserInFirestore } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
// router.post('/login', loginUser)

// signup route
// router.post('/signup', signupUser)

router.post('/signup', createUserToAuthAndFirestore)

router.use(requireAuth) // routes-routes berikutnya butuh auth

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUserInFirestore)
router.delete('/:id', deleteUserInAuthAndFirestore)


module.exports = router