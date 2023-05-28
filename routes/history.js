const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createHistory, getUserHistory, getHistories, updateHistory, deleteHistory } = require('../controllers/historyController')

const router = express.Router()

// require auth for all history routes
router.use(requireAuth)

// Buat history junk food / history activity
router.post('/user/:id', createHistory)

// Ambil semua history milik user id tersebut
router.get('/user/:id', getUserHistory)

// Ambil semua history milik semua user yang ada
router.get('/', getHistories)

// Update satu history
router.put('/:id', updateHistory)

// Delete satu history
router.delete('/:id', deleteHistory)


module.exports = router