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

  showEditBook = (req,res) => {
    const { book_id } = req.params;
    let sql = 'SELECT * FROM book WHERE book_id = ? AND book_is_deleted = 0';

    connection.query(sql, [book_id], (err, result) => {
      if (err){
        throw err;
      }
      else {
        res.render("editBook", {book: result[0]});
      }
    })
  }



  editBook = (req,res) => {
    const { book_id, user_id } = req.params;
    const {title, author_name, year_written, review, publisher,rating } = req.body;

    if (!rating){
      res.render('editBook', {book_id, messageRating: "Debes actualizar la valoración"});
      
    }
    else if (!isNumber(year_written) || year_written.trim().length > 4){
      res.render('editBook', {book_id, messageYear: "El año introducido no es válido"});
    }
    else {
      let release = Number(year_written);
      let sql = `
      UPDATE book 
      SET title = ?,  author_name = ?, year_written = ?, review = ?, publisher = ?,rating = ?
      WHERE book_id = ? AND book_is_deleted = 0`;
      let values = [title, author_name, year_written, review, publisher, rating, book_id];

      if (req.file) {
        sql = `
          UPDATE book 
          SET title = ?, author_name = ?, year_written = ?, review = ?, publisher = ?,rating = ?, picture = ?
          WHERE book_id = ? AND book_is_deleted = 0`;
          values = [title, author_name, year_written, review, publisher, rating, req.file.filename, book_id];
      }

      connection.query(sql, values, (err, result) => {
        if (err){
          throw err;
        }
        else {
          res.redirect(`/users/profile/${user_id}`);
        }
      })

    }
  }

  delete = (req, res) => {
    const { book_id, user_id} = req.params;
    let sql = 'DELETE FROM book WHERE book_id = ?'

    connection.query(sql, [book_id], (err, result) => {
      if (err) {
        throw err;
      }
      else {
        res.redirect(`/users/profile/${user_id}#books`);
      }
    })
  }

  
}

module.exports = new BookControllers();