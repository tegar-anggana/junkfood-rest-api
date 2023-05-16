// import admin from './firebase-service';
const { admin, db } = require('../firebase/firebase-service')

// signup user
const createUserToAuthAndFirestore = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = {
      email: email,
      password: password
    }

    const authResponse = await admin.auth().createUser(user);
    const firestoreResponse = await db.collection('users').doc(authResponse.uid).set(user)

    const response = {
      authResponse: authResponse,
      firestoreResponse: firestoreResponse
    }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// create user in firestore
const deleteUserInAuthAndFirestore = async (req, res) => {
  const { id } = req.params
  try {
    const authResponse = await admin.auth().deleteUser(id)
    const firestoreResponse = await db.collection('users').doc(id).delete()

    const response = {
      authResponse: authResponse,
      firestoreResponse: firestoreResponse
    }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

module.exports = { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore }