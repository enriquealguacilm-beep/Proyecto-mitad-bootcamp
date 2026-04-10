const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'instabook'
});


connection.connect((err)=>{
  if(err){
    console.log(err.stack);
  }else{
    console.log("Conexión con bd ok");
  }
})

module.exports = connection;