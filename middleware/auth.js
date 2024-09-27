const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // For header token: 'Authorization: Bearer token'
    // const token = req.headers.authorization?.split(' ')[1];

    // For HttpOnly cookie JWT:
    const token = req.cookies['token']; // using cookie-parser
    // const token = req.headers.cookie.split('=')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Not authorized' });
  }
};

module.exports = auth;
