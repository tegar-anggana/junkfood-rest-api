// import admin from './firebase-service';
const { admin, db, bucket } = require('../firebase/firebase-service')
const fs = require('fs')

// get all user
const getUsers = async (req, res) => {
  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.get()
    let users = []
    snapshot.forEach(doc => {
      // console.log(doc.id, '=>', doc.data());
      users.push({ id: doc.id, ...doc.data() })
    });
    return res.status(200).send(users)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
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
    const { name, email, password } = req.body

    const user = {
      name: name,
      email: email,
      password: password
    }

    const authResponse = await admin.auth().createUser(user);
    const firestoreResponse = await db.collection('users').doc(authResponse.uid).set(user)

    const response = { ...user, authResponse, firestoreResponse }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    let response = {};
    const newData = JSON.parse(req.body.data);

    if (req.file) {
      const imgFile = req.file;
      // Upload the image to cloud storage
      await bucket.upload(imgFile.path, { destination: 'profiles/' + id });
      const imgPublicURL = "https://storage.googleapis.com/bangkit-capstone-gar.appspot.com/profiles/" + id;
      newData.photoURL = imgPublicURL;

      // delete temporary image in this express app directory (/uploads)
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }

    if (newData) {
      const userRef = db.collection('users').doc(id);

      // Update Firestore data
      const firestoreResponse = await userRef.update(newData);

      // Update user authentication information if email or password is provided
      let authResponse = "";
      if (newData.email || newData.password) {
        authResponse = await admin.auth().updateUser(id, {
          email: newData.email,
          password: newData.password
        });
      }

      response.authResponse = authResponse;
      response.firestoreResponse = firestoreResponse;

      return res.status(200).send(response);
    }

    return res.status(200).send('No data provided for update.');
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}


// delete user
const deleteUserInAuthAndFirestore = async (req, res) => {
  const { id } = req.params
  try {
    const authResponse = await admin.auth().deleteUser(id)
    const firestoreResponse = await db.collection('users').doc(id).delete()

    const response = { authResponse, firestoreResponse }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

module.exports = { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore, getUser, getUsers, updateUser }