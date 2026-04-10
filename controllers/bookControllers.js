const connection = require('../config/db');
const isNumber = require('../utils/numbersUtils');



class BookControllers{
  
  showNewReview = (req, res) => {
    const {user_id} = req.params;

    res.render('newReview', {user_id, formValues: req.body} );
  }

  newReview = (req, res) => {
    const { user_id } = req.params;
    const {title, genre, author_name, year_written, review, publisher,rating } = req.body;
    
    if (!title || !genre || !author_name || !year_written || !review || !publisher || !rating){
      res.render('newReview', {user_id, message: "Debes rellenar todos los campos",  formValues: req.body});
    }
    else if (!isNumber(year_written) || year_written.trim().length > 4){
      res.render('newReview', {user_id, messageYear: "El año introducido no es válido", formValues: req.body});
    }
    else {
      let release = Number(year_written);
      let sql = 'INSERT INTO book (title, genre, author_name, year_written, review, publisher, rating, user_id) VALUES (?,?,?,?,?,?,?,?)';
      let values = [title, genre, author_name, release, review, publisher, rating, user_id];

      if (req.file) {
        sql = 'INSERT INTO book (title, genre, author_name, year_written, review, publisher, rating, picture, user_id) VALUES (?,?,?,?,?,?,?,?)';
        values = [title, genre, author_name, release, review, publisher, rating, req.file.filename, user_id];


      }

      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        }
        else {
          res.redirect(`/users/profile/${user_id}`);
        }
      })

    }

    
    
  }

  
}

module.exports = new BookControllers();