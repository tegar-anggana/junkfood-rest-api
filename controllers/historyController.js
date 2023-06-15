// import admin from './firebase-service';
const { db, bucket } = require('../firebase/firebase-service')
const fs = require('fs')
const { Readable } = require('stream')
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
      const destPath = `histories/${id}/${historyId}/` + Date.now()

      // Upload new image to cloud storage
      const fileStream = new Readable();
      fileStream.push(imgFile.buffer);
      fileStream.push(null);

      // Upload the file to Google Cloud Storage
      const file = bucket.file(destPath);
      await new Promise((resolve, reject) => {
        fileStream.pipe(file.createWriteStream({ resumable: false }))
          .on('error', reject)
          .on('finish', resolve);
      });
      // await bucket.upload(imgFile.path, { destination: destPath, public: true })
      const imgPublicURL = process.env.STORAGE_PUBLIC_URL + `/${destPath}`
      history.photoURL = imgPublicURL
    }

    if (history) {
      const historyData = { user_id: id, ...history }
      await db.collection('histories').doc(historyId).set(historyData)
      response = { id: historyId, ...historyData }

      return res.status(200).send(response)
    }

    return res.status(400).send('No data provided for history creation.')
  } catch (e) {
    return res.status(500).send({ error: e.message })
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
      histories.push({ id: doc.id, ...doc.data() })
    });
    return res.status(200).send(histories)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

// Ambil semua history milik semua user yang ada
const getHistories = async (req, res) => {
  try {
    const historiesRef = db.collection('histories')
    const snapshot = await historiesRef.get()
    let histories = []
    snapshot.forEach(doc => {
      histories.push({ id: doc.id, ...doc.data() })
    });
    return res.status(200).send(histories)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

// Update satu history
const updateHistory = async (req, res) => {
  const { userId, histId } = req.params
  try {
    const newData = JSON.parse(req.body.data)

    if (req.file) {
      // upload img ke cloud storage
      const imgFile = req.file
      const destPath = `histories/${userId}/${histId}/` + Date.now()
      const [files] = await bucket.getFiles({ prefix: `histories/${userId}/${histId}` })

      if (files.length > 0) {
        for (const file of files) {
          await file.delete()
        }
      }

      // Upload new image to cloud storage
      const fileStream = new Readable();
      fileStream.push(imgFile.buffer);
      fileStream.push(null);

      // Upload the file to Google Cloud Storage
      const file = bucket.file(destPath);
      await new Promise((resolve, reject) => {
        fileStream.pipe(file.createWriteStream({ resumable: false }))
          .on('error', reject)
          .on('finish', resolve);
      });
      // await bucket.upload(imgFile.path, { destination: destPath, public: true })
      const imgPublicURL = process.env.STORAGE_PUBLIC_URL + `/${destPath}`
      newData.photoURL = imgPublicURL
    }

    if (newData) {
      const historyRef = db.collection('histories').doc(histId)
      await historyRef.update(newData)
      return res.status(200).send({ message: "History successfully updated." })
    }

    return res.status(400).send('No data provided for update.')
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

// Delete satu history
const deleteHistory = async (req, res) => {
  const { userId, histId } = req.params
  try {
    const ref = db.collection('histories').doc(histId)
    const data = await ref.get()

    if (data.data().photoURL) {
      await bucket.file(`histories/${userId}/${histId}`).delete()
    }

    await ref.delete()

    return res.status(200).send({ message: "History successfully deleted." })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}


module.exports = { createHistory, getUserHistory, getHistories, updateHistory, deleteHistory }