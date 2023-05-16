const Firestore = require('@google-cloud/firestore');
const admin = require("firebase-admin");
// path to service account
const serviceAccount = require("./ServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = new Firestore({
  projectId: 'bangkit-capstone-gar',
  keyFilename: './firebase/ServiceAccount.json',
});

module.exports = { admin, db };