require('dotenv').config()

const express = require('express')
const userRoutes = require('./routes/user')
const historyRoutes = require('./routes/history')
const { db } = require('./firebase/firebase-service')

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

// NYOBA
// const requireAuth = require('./middleware/requireAuth')
// app.use(requireAuth)
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })

app.get('/api/exercise/list', async (req, res) => {
  try {
    const exerciseRef = db.collection('exercises')
    const snapshot = await exerciseRef.get()
    let exercises = []
    snapshot.forEach(doc => {
      // exercises.push({ id: doc.id, ...doc.data(), })
      exercises.push({
        judul: doc.data()['Activity, Exercise or Sport (1 hour)'],
        calorie_per_kg: doc.data()['Calories per kg'],
        duration_minute: doc.data()['Duration (minutes)'],
        intensity_description: doc.data()['Intensity Description'],
      })
    });

    exercises.sort((a, b) => {
      const judulA = a.judul.toUpperCase();
      const judulB = b.judul.toUpperCase();

      if (judulA < judulB) {
        return -1;
      }
      if (judulA > judulB) {
        return 1;
      }
      return 0;
    });
    return res.status(200).send(exercises)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

app.post('/api/exercise/recommendation', async (req, res) => {
  const { calorie_kcal, user_weight_kg, exercise_time_minute } = req.body
  try {
    const caloriesPerOneKg = calorie_kcal / user_weight_kg / exercise_time_minute;
    const exercisesQuerySnapshot = await db.collection('exercises').get();
    const recommendations = [];

    exercisesQuerySnapshot.forEach((doc) => {
      const exercise = doc.data();
      const jarak = Math.abs(exercise['Calories per kg'] - caloriesPerOneKg);

      recommendations.push({
        exercise: exercise['Activity, Exercise or Sport (1 hour)'],
        jarak: jarak,
        calorie_per_kg: exercise['Calories per kg'],
        calorie: exercise['Calories per kg'] * user_weight_kg * exercise_time_minute
      });
    });

    recommendations.sort((a, b) => a.jarak - b.jarak);
    const topRecommendations = recommendations.slice(0, 10);
    // return topRecommendations;
    return res.status(200).send(topRecommendations.map(e => ({
      exercise: e.exercise,
      calorie: e.calorie,
      time_minute: exercise_time_minute
    })))

  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

app.post('/api/junklist', async (req, res) => {
  const { hasil } = req.body // hasil klasifikasi dari client
  try {
    const junkfoodRef = db.collection('junkfoods');
    const snapshot = await junkfoodRef.where('Jenis', '==', hasil).get();
    let junkfoods = []
    snapshot.forEach(doc => {
      junkfoods.push({ id: doc.id, ...doc.data() })
    });
    return res.status(200).send(junkfoods)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

app.listen(process.env.PORT, () => {
  console.log('connected to db & listening on port', process.env.PORT)
})