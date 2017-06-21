var router = require('express').Router();

//private
var email = require('../../../../email');

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: email.api_user,
    api_key: email.api_key
  }
};

 var client = nodemailer.createTransport(sgTransport(options));


// localhost:3000/api/resetusername
router.get('/:email', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        if(!req.params.email){
          res.status(201).send({success:false, message: 'No e-mail was provided!'});
        }

        else {
          var selectSql = 'select email, username from users where email = ?';
          var selectValue = req.params.email;

            connection.query(selectSql, selectValue, function (err, result, next) {
            if(err){
                  res.send(err);
            }
            else {
              if(!result[0]){
                res.status(201).send({success : false, message: 'E-mail was not found'});
              }else {

                var userInfo = {
                  email:result[0].email,
                  username: result[0].username
                };

                var email = {
                  from: 'awesome@bar.com',
                  to: userInfo.email,
                  subject:'Localhost Username Request',
                  text: 'Hello'+ userInfo.username + ', You recently requeseted your username. Please save it in your files ! <br> your Id : ' + userInfo.username,
                  html: 'Hello<strong>'+ userInfo.username + '</strong> You recently requeseted your username. Please save it in your files! <br> your Id : ' + userInfo.username
                };

                client.sendMail(email, function(err, info){
                  if(err){
                    console.log(err);
                  } else {
                    console.log('Message sent:' + info.response);
                  }
                });

                res.status(201).send({success : true, message: 'Username has been sent to e-mail'});
              }

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
