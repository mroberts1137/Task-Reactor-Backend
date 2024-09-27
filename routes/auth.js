const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../middleware/validation');

const router = express.Router();

// @route   POST api/auth
// @desc    Authenticate user & get JWT token
// @access  Public
router.post(
  '/',
  validation.validateLogin,
  validation.checkValidationErrors,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // jwt payload. Used to identify user by routes requiring auth
      const payload = { id: user._id };

      // This is currently using HttpOnly Cookies & local session storage:
      // remove res.cookie to switch to only use local session storage
      // don't send token in response to switch to only use cookies

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true, secure: true });
          res.json({ token, user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
