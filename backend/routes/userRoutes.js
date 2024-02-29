const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateNamePassword,
} = require('../controllers/userController');
const verifyAuthToken = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/:userId', verifyAuthToken, updateNamePassword);

module.exports = router;
