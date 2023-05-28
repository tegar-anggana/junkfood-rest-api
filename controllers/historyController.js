// import admin from './firebase-service';
const { db, bucket } = require('../firebase/firebase-service')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Buat history junk food / history activity
const createHistory = async (req, res) => {
  const { id } = req.params // id user (uid), bukan id history

  try {
    const historyId = uuidv4()
    let response = {}
    const history = JSON.parse(req.body.data)

    if (req.file) {
      // upload img ke cloud storage
      const imgFile = req.file
      await bucket.upload(imgFile.path, { destination: 'histories/' + historyId })
      const imgPublicURL = "https://storage.googleapis.com/bangkit-capstone-gar.appspot.com/histories/" + historyId;
      history.photoURL = imgPublicURL

      // delete temporary file di express app directory
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }

    if (history) {
      const historyData = { user_id: id, ...history }
      const firestoreResponse = await db.collection('histories').doc(historyId).set(historyData)
      response = { id: historyId, ...historyData, firestoreResponse }

      return res.status(200).send(response)
    }

    return res.status(400).send('No data provided for history creation.')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Ambil semua history milik user id tersebut
const getUserHistory = async (req, res) => {
  const { id } = req.params // id user (uid), bukan id history
  try {
    const historyRef = db.collection('histories');
    const snapshot = await historyRef.where('user_id', '==', id).get();
    let histories = []
    snapshot.forEach(doc => {
      // console.log(doc.id, '=>', doc.data());
      histories.push({ id: doc.id, ...doc.data() })
    });
    return res.status(200).send(histories)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Ambil semua history milik semua user yang ada
const getHistories = async (req, res) => {
  try {
    const historiesRef = db.collection('histories')
    const snapshot = await historiesRef.get()
    let histories = []
    snapshot.forEach(doc => {
      // console.log(doc.id, '=>', doc.data());
      histories.push({ id: doc.id, ...doc.data() })
    });
    return res.status(200).send(histories)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Update satu history
const updateHistory = async (req, res) => {
  const { id } = req.params // id history, bukan id user
  try {
    let response = {}
    const newData = JSON.parse(req.body.data)

    if (req.file) {
      const imgFile = req.file

      await bucket.upload(imgFile.path, { destination: '/histories/' + id })
      const imgPublicURL = "https://storage.googleapis.com/bangkit-capstone-gar.appspot.com/histories/" + id
      newData.photoURL = imgPublicURL

      // delete temporary image in express dir
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }

    if (newData) {
      const historyRef = db.collection('histories').doc(id)
      const firestoreResponse = await historyRef.update(newData)
      response = { firestoreResponse }
      return res.status(200).send(response)
    }

    return res.status(400).send('No data provided for update.')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Delete satu history
const deleteHistory = async (req, res) => {
  const { id } = req.params // id history, bukan id user
  try {
    await bucket.file('histories/' + id).delete()
    const firestoreResponse = await db.collection('histories').doc(id).delete()

    const response = { firestoreResponse }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}


module.exports = { createHistory, getUserHistory, getHistories, updateHistory, deleteHistory }