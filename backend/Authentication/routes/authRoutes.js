const express = require('express');
const router  = express.Router();

const { register, login, reviewPost } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/authRoles');


router.post('/review-post', verifyToken, requireRole('admin'), reviewPost);
router.post('/register', register);
router.post('/login', login);


module.exports = router;