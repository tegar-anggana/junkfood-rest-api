require('dotenv').config()

const express = require('express')
const userRoutes = require('./routes/user')
const historyRoutes = require('./routes/history')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/history', historyRoutes)
app.get('/api/scan', (req, res) => {
  const imgurl = req.params
  return res.status(200).json("halo")
})

// NYOBA
// const requireAuth = require('./middleware/requireAuth')
// app.use(requireAuth)
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })

app.listen(process.env.PORT, () => {
  console.log('connected to db & listening on port', process.env.PORT)
})