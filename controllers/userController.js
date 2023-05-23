// import admin from './firebase-service';
const { admin, db } = require('../firebase/firebase-service')

// get all user
const getUsers = async (req, res) => {
  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.get()
    let users = []
    snapshot.forEach(doc => {
      // console.log(doc.id, '=>', doc.data());
      users.push(doc.data())
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

    return res.status(200).send(userData.data())
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
const updateUserInFirestore = async (req, res) => {
  const { id } = req.params
  const newData = req.body
  try {
    const userRef = db.collection('users').doc(id)
    const firestoreResponse = await userRef.update(newData)
    const authResponse = await admin.auth().updateUser(id, newData)
    const response = { authResponse, firestoreResponse }

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
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

module.exports = { createUserToAuthAndFirestore, deleteUserInAuthAndFirestore, getUser, getUsers, updateUserInFirestore }