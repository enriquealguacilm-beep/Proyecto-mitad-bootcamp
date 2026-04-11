const connection = require('../config/db');
const bcrypt = require('bcrypt');
const getStars = require('../utils/starrating');

class UserControllers {
  
  showRegister = (req, res) => {
    res.render('formRegister', {formValues: req.body});

  }

  register = (req, res) => {
    const { name, last_name, email, password, preferences } = req.body;

    if(!name || !last_name || !email || !password){

      res.render('FormRegister', {message: "* Debes cumplimentar todos los campos", formValues: req.body});
    }
    else{

      bcrypt.hash(password.trim(), 10, (errHash, hashedPassword) => {
        if (errHash){
          throw errHash;
        }
        else{

          let sql = 'INSERT INTO user (name, last_name, email, password, preferences) VALUES (?,?,?,?,?)';
          let values = [name.trim(), last_name.trim(), email.trim(), hashedPassword, preferences];

          if (req.file){
            sql =  'INSERT INTO user (name, last_name, email, password, preferences, avatar) VALUES (?,?,?,?,?,?)';
            values =  [name.trim(), last_name.trim(), email.trim(), hashedPassword, preferences, req.file.filename];
          }
          connection.query(sql, values, (err, result) => {
            if (err){
              throw err;
            }
            else {
              
              
              res.send("ok");                               // falta la vista
            }
          })

        }
      })
    }


  }

  profile = (req, res) => {
    const {user_id} = req.params;
    let sqlUser = 'SELECT * FROM user WHERE user_id = ? AND user_is_deleted = 0';
    let sqlBooks = 'SELECT * FROM book WHERE user_id = ? AND book_is_deleted = 0 ORDER BY book_id desc';

    connection.query(sqlUser, [user_id], (err, result) => {
      if (err){
        throw err;
      }
      else {
        
        connection.query(sqlBooks, [user_id], (err2, resultBooks) => {
          if (err2){
            throw err2;
          }
          else {console.log("asfgbbassssssssssssssssssssss",resultBooks);
            resultBooks.forEach((elem) =>{
              elem.rating = getStars(elem.rating);
            })
            res.render('profile', { user: result[0], resultBooks,  formValues: req.body});
            
            
          }
        })
      }
    })

  }


}


module.exports = new UserControllers();