require('dotenv').config()

const express = require('express')
// const mongoose = require('mongoose')
// const workoutRoutes = require('./routes/workouts')
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
// app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.use('/api/history', historyRoutes)


// NYOBA
// const requireAuth = require('./middleware/requireAuth')
// app.use(requireAuth)
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })

app.listen(process.env.PORT, () => {
  console.log('connected to db & listening on port', process.env.PORT)
})

// connect to db
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     // listen for requests
//     app.listen(process.env.PORT, () => {
//       console.log('connected to db & listening on port', process.env.PORT)
//     })
//   })
//   .catch((error) => {
//     console.log(error)
//   })