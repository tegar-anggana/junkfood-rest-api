const Firestore = require('@google-cloud/firestore');
const admin = require("firebase-admin");
// path to service account
const serviceAccount = require("./ServiceAccount.json");
const { getStorage } = require("firebase-admin/storage")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'bangkit-capstone-gar.appspot.com'
});

const db = new Firestore({
  projectId: 'bangkit-capstone-gar',
  keyFilename: './firebase/ServiceAccount.json',
});

const bucket = getStorage().bucket()

module.exports = { admin, db, bucket };