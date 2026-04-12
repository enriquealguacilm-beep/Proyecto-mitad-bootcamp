const express = require('express');
const bookControllers = require('../controllers/bookControllers');
const uploadFile = require('../middlewares/uploadFile');
const router = express.Router();


router.post('/newBook/:user_id', uploadFile("books") ,bookControllers.newReview);

router.get('/editBook/:book_id', bookControllers.showEditBook);

router.post('/editBook/:book_id/:user_id', uploadFile("books") ,bookControllers.editBook);

router.get('/delete/:book_id/:user_id', bookControllers.delete)





module.exports = router;