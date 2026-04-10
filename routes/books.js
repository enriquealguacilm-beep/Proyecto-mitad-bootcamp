const express = require('express');
const bookControllers = require('../controllers/bookControllers');
const uploadFile = require('../middlewares/uploadFile');
const router = express.Router();

router.get('/newBook/:user_id', bookControllers.showNewReview);

router.post('/newBook/:user_id', uploadFile("books") ,bookControllers.newReview);





module.exports = router;