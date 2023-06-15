const { admin, db, bucket } = require('../firebase/firebase-service')
const fs = require('fs')
const { Readable } = require('stream')
const { URL } = require('url')

// get all user
const getUsers = async (req, res) => {
  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.get()
    let users = []
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data(), })
    });
    return res.status(200).send(users)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

// get user data
const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const userRef = db.collection('users').doc(id)
    const userData = await userRef.get()

    if (!userData.data()) {
      return res.status(404).send("User tidak ditemukan")
    }

    return res.status(200).send({ id: userRef.id, ...userData.data() })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// signup user
const createUserToAuthAndFirestore = async (req, res) => {
  try {
    const { name, email, password, gender, weight_kg, height_cm, birth_date } = req.body
    const user = {
      name: name,
      email: email,
      password: password,
      gender: gender,
      weight_kg: weight_kg,
      height_cm: height_cm,
      birth_date: birth_date
    }

    const authResponse = await admin.auth().createUser(user);
    await db.collection('users').doc(authResponse.uid).set(user)

    return res.status(200).send(user)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

// update user
const updateUser = async (req, res) => {
  const { id } = req.params; // id user
  try {
    const newData = JSON.parse(req.body.data);

    if (req.file) {
      const imgFile = req.file;
      const destPath = `profiles/${id}/` + Date.now()
      const [files] = await bucket.getFiles({ prefix: `profiles/${id}` })

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

      // delete temporary image in this express app directory (/tmp)
      // fs.unlink(req.file.path, (err) => {
      //   if (err) {
      //     console.log(err)
      //   }
      // })
    }

    if (newData) {
      const userRef = db.collection('users').doc(id);

      // Update Firestore data
      await userRef.update(newData);

      // Update user authentication information if email or password is provided
      if (newData.email || newData.password) {
        await admin.auth().updateUser(id, {
          email: newData.email,
          password: newData.password
        });
      }

      return res.status(200).send({ message: "User successfully updated." });
    }

    return res.status(400).send({ message: 'No data provided for update.' });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
}


// delete user
const deleteUserInAuthAndFirestore = async (req, res) => {
  const { id } = req.params
  try {
    const ref = db.collection('users').doc(id)
    const data = await ref.get()

    if (data.data().photoURL) {
      const publicURL = data.data().photoURL
      const parsedURL = new URL(publicURL)
      const path = parsedURL.pathname
      const segments = path.split('/')
      const desiredSeg = segments[segments.length - 1]

      await bucket.file(`profiles/${id}/${desiredSeg}`).delete()
    }

    await admin.auth().deleteUser(id)
    await ref.delete()

    return res.status(200).send({ message: "User successfully deleted." })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

module.exports = { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore, getUser, getUsers, updateUser }