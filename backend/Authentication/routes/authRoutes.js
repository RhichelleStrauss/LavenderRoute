const express = require('express');
const router  = express.Router();

const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.post('/create-admin', verifyToken, authorizeRoles('admin'), createAdmin);

module.exports = router;