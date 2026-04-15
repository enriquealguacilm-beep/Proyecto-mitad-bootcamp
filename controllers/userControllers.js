const connection = require('../config/db');
const bcrypt = require('bcrypt');
const getStars = require('../utils/starrating');
let login = false;
let getLoginId = null;




class UserControllers {
   
  showRegister = (req, res) => {
    res.render('formRegister', {formValues: req.body, formEnv: false});

  }

  register = (req, res) => {
    const { name, last_name, email, password, preferences } = req.body;
    if(!name || !last_name || !email || !password){

      res.render('FormRegister', {message: "* Debes cumplimentar todos los campos", formValues: req.body});
    }
    else {

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
              if (err.errno == 1062){
                res.render('formRegister', {formValues: req.body, formEnv: false, message: "* El Email ya está en uso"})
              }
              else {
                throw err;
              }
            }
            else {
              
              res.render('formRegister', {formEnv: true});
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
          else {
            resultBooks.forEach((elem) =>{
              elem.rating = getStars(elem.rating);
            })
            let isOwner = login && result[0].user_id === getLoginId;
            
            
            res.render('profile', { user: result[0], resultBooks,  formValues: req.body, login,isOwner,getLoginId} );
            
            
          }
        })
      }
    })

  }


  showLogin = (req, res) => {
    res.render('login', {login});
  }


  login = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    if (!email || !password) {
      res.render('login', {message: "* Debes cumplimentar todos los campos"});
    }
    else {
      let sql = 'SELECT * FROM user WHERE email = ? AND user_is_deleted = 0';

      connection.query(sql, [email], (err, result) => {
        if (err){
          throw err;
        }
        else {
          if(!result.length){
            res.render('login', {message: "* Credenciales incorrectas"});
          }
          else {
            let hashedPass = result[0].password;
            bcrypt.compare(password, hashedPass, (errCompare, resultCompare) => {
              if (errCompare){
                throw errCompare;
              }
              else {
                if (resultCompare === true) {
                  login = true;
                  getLoginId = result[0].user_id;
                  res.redirect(`/users/profile/${result[0].user_id}`)
                }
                else {
                  
                  res.render('login', {message: "*Credenciales incorrectas"});
                }
              }
            })
          }
        }
      })
    }
  }
  
  logOut = (req, res) => {
    login = false;
    getLoginId = null;
    res.redirect('/');
  }

  deleteUser = (req, res) => {
    const {user_id} = req.params;
    let sqlU = 'UPDATE user SET user_is_deleted = 1 WHERE user_id = ? ';
    let sqlB = 'UPDATE book SET book_is_deleted = 1 WHERE user_id = ?' ;

    connection.query(sqlU, [user_id], (errU, resultU) => {
      if (errU){
        throw errU;
      }
      else {
        connection.query(sqlB, [user_id], (errB, resultB) => {
          if (errB) {
            throw errB;
          }
          else {
            login = false;
            res.redirect('/back');
          }
        })
      }
    })
  }

  showEditUser = (req, res) => {
    const {user_id} = req.params;
    let sql = 'SELECT * FROM user WHERE user_id = ? AND user_is_deleted = 0';

    connection.query(sql, [user_id], (err, result) => {
      if (err){
        throw err;
      }
      else {
        console.log(result);
        let preferences = result[0].preferences.split(", ");
        result[0].preferences = preferences; 
        res.render('editUser', {user: result[0],login, getLoginId})
      }
    })
  }

  editUser = (req, res) => {
    const {user_id} = req.params;
    const {name, last_name, email, preferences} =req.body;
    let sqlUser = 'SELECT * FROM user WHERE user_id = ? AND user_is_deleted = 0';
    let sql = 'UPDATE user SET name = ?, last_name = ?, email = ?, preferences = ? WHERE user_id = ? AND user_is_deleted = 0';
    let values = [name, last_name, email, preferences, user_id];

    if (req.file) {
      sql = 'UPDATE user SET name = ?, last_name = ?, email = ?, preferences = ?, avatar = ? WHERE user_id = ? AND user_is_deleted = 0';
      values = [name, last_name, email, preferences, req.file.filename, user_id];

    }
    connection.query(sqlUser, [user_id], (errUs, resultUs) => {
      if (errUs){
        throw errUs;
      }
      else {
        connection.query(sql, values, (err, result) => {
          if (err){
            if (err.errno == 1062){
             res.render('editUser', {user: resultUs[0],login, getLoginId, message: "* El Email ya está en uso"})
            }
            else {
            throw err;
            }
          }
          else {
             res.redirect(`/users/profile/${user_id}`);
          }
        })


        
      }
    })
       
  }

}


module.exports = new UserControllers();