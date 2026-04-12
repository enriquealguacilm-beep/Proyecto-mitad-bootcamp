const express = require('express');
const userControllers = require('../controllers/userControllers');
const uploadFile = require('../middlewares/uploadFile');
const router = express.Router();



router.get('/register', userControllers.showRegister);

router.post('/register', uploadFile("users") , userControllers.register);

router.get('/profile/:user_id', userControllers.profile);

router.get('/login', userControllers.showLogin);

router.post('/login', userControllers.login);

router.get('/logout', userControllers.logOut);

router.get('/deleteUser/:user_id', userControllers.deleteUser);

module.exports = router;
                                     