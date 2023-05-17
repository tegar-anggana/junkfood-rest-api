const express = require('express')

// controller functions
// const { loginUser, signupUser } = require('../controllers/userController')
const { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore, getUser, getUsers, updateUserInFirestore } = require('../controllers/userController')

const router = express.Router()

// login route
// router.post('/login', loginUser)

// signup route
// router.post('/signup', signupUser)

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/signup', createUserToAuthAndFirestore)
router.put('/:id', updateUserInFirestore)
router.delete('/:id', deleteUserInAuthAndFirestore)


module.exports = router