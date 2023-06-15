const express = require('express')
const os = require('os');

const { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore, getUser, getUsers, updateUser } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: os.tmpdir() + '/' })

// login route
// router.post('/login', loginUser)

// signup route
// router.post('/signup', signupUser)

router.post('/signup', createUserToAuthAndFirestore)

router.use(requireAuth)

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', upload.single('image'), updateUser)
router.delete('/:id', deleteUserInAuthAndFirestore)


module.exports = router