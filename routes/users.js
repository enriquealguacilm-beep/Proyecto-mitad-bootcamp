const express = require('express');
const userControllers = require('../controllers/userControllers');
const uploadFile = require('../middlewares/uploadFile');
const router = express.Router();



router.get('/register', userControllers.showRegister);

router.post('/register', uploadFile("users") , userControllers.register);

router.get('/profile/:user_id', userControllers.profile);

module.exports = router;
                                     