const { admin } = require('../firebase/firebase-service');
const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authorization.split(' ')[1]

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      console.log(decodeValue);
      console.log(decodeValue.uid)
      return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
  } catch (e) {
    // return res.status(500).json({ message: 'Internal Error' });
    return res.status(500).json({ message: e.message });
  }
}

module.exports = requireAuth

