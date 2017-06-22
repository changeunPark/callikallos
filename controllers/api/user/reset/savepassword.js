var router = require('express').Router();
var bcrypt = require('bcryptjs');

//private
var email = require('../../privacy/email');

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: email.api_user,
    api_key: email.api_key
  }
};

 var client = nodemailer.createTransport(sgTransport(options));


// localhost:3000/api/savepassword
router.put('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {

        if(req.body.password === null || req.body.password === '' ||req.body.password === undefined){
            res.status(201).send({success:false, message:'Password not privided'});
        } else if(req.body.username === null || req.body.username === '' ||req.body.username === undefined){
           res.status(201).send({success:false, message:'Unreconized username'});
        }else {

          bcrypt.hash(req.body.password, 10, function(err, hash){
          if(err) {
            return next(err);
          }
          else {
            var selectSql = 'select username, email from users where username = ?';
            var username = req.body.username;
            var password = hash;

            connection.query(selectSql, username, function (err, result, next) {

            if(err) throw err;
            else {


              var updateSql = 'UPDATE users SET ? WHERE username = ?';
              var updateValue = {
                password: password
              };
              updateValue.resettoken = '0';

              var userInfo = {
                username:result[0].username,
                email:result[0].email
              };

              connection.query(updateSql, [updateValue, username], function (err, result, next) {

              if(err) throw err;
              else {
                console.log(result);
                var email = {
                  from : 'callikallos Staff, staff@callikallos.com',
                  to: userInfo.email,
                  subject: 'callikallos Reset Password',
                  text: 'Hello'+userInfo.username+',This e-mail is to notify you that your password was recently reset at callikallos.com',
                  html: 'Hello<string>'+userInfo.username+'</strong>, <br><br>This e-mail is to notify you that your password was recently reset at callikallos.com'
                };

                client.sendMail(email, function(err, info){
                  if(err) console.log(err);
                });
                res.json({success:true, message: 'Password has been reset!'});

                }
              });
              }
            });
          }
      });
    }
    }
  });

}
catch(ex){
  console.error("Internal error: "+ex);
  return next(ex);
}
});

module.exports = router;
