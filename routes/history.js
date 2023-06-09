const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createHistory, getUserHistory, getHistories, updateHistory, deleteHistory } = require('../controllers/historyController')
const multer = require('multer')

const router = express.Router()
// const upload = multer({ dest: 'uploads/' })
const upload = multer()

// require auth for all history routes
router.use(requireAuth)

// Buat history junk food / history activity
router.post('/user/:id', upload.single('image'), createHistory)

// Ambil semua history milik user id tersebut
router.get('/user/:id', getUserHistory)

// Ambil semua history milik semua user yang ada
router.get('/', getHistories)

// Update satu history
router.put('/user/:userId/:histId', upload.single('image'), updateHistory)

// Delete satu history
router.delete('/user/:userId/:histId', deleteHistory)


module.exports = router