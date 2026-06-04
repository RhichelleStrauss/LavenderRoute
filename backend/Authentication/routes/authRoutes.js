const express = require('express');
const router  = express.Router();

const { register, login, reviewPost } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.post('/review-post', reviewPost);

module.exports = router;