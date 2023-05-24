// import admin from './firebase-service';
const { db } = require('../firebase/firebase-service')

// Buat history junk food / history activity
const createHistory = async (req, res) => {
  try {
    const history = req.body
    const { id } = req.params // id user (uid), bukan id history
    const historyData = { user_id: id, ...history }
    const firestoreResponse = await db.collection('histories').doc().set(historyData)

    const response = { ...historyData, firestoreResponse }

    return res.status(200).send(response)
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
      histories.push(doc.data())
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
      histories.push(doc.data())
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
  const newData = req.body
  try {
    const historyRef = db.collection('histories').doc(id)
    const firestoreResponse = await historyRef.update(newData)
    const response = { firestoreResponse }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Delete satu history
const deleteHistory = async (req, res) => {
  const { id } = req.params // id history, bukan id user
  try {
    const firestoreResponse = await db.collection('histories').doc(id).delete()

    const response = { firestoreResponse }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}


module.exports = { createHistory, getUserHistory, getHistories, updateHistory, deleteHistory }