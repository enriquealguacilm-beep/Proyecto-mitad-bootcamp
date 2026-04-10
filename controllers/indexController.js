const connection = require('../config/db');
const getStars = require('../utils/starrating');

class IndexController {

  home = (req,res) => {
    let sqlUser = 'SELECT * FROM user WHERE user_is_deleted = 0';
    let sqlReviews = `
        SELECT b.*, u.name, u.last_name, u.avatar 
        FROM book b, user u 
        WHERE b.user_id = u.user_id  AND user_is_deleted = 0 AND book_is_deleted = 0 
        ORDER BY book_id desc 
        LIMIT 4`

    connection.query(sqlUser, (err, resultUsers) => {
      if (err){
        throw err;
      }
      else {

        connection.query(sqlReviews, (err2, resultReviews) => {
          if (err2){
            throw err2;
          }
          else {
            resultReviews.forEach((elem) =>{
              elem.rating = getStars(elem.rating);
            })
            res.render('index', { users: resultUsers, reviews: resultReviews});
          }
        })
       
      }
    })

  }


}




module.exports = new IndexController();