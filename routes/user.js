const express = require('express')

// controller functions
// const { loginUser, signupUser } = require('../controllers/userController')
const { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore } = require('../controllers/userController')

const router = express.Router()

// login route
// router.post('/login', loginUser)

// signup route
// router.post('/signup', signupUser)

router.post('/signup', createUserToAuthAndFirestore)
router.delete('/:id', deleteUserInAuthAndFirestore)

module.exports = router