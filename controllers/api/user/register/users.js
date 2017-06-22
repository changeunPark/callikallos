// 기존 사용자의 정보를 얻고 새로운 사용자를 생성하는 두가지 동작을 수행
var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//private
var config = require('../../privacy/config');
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


// http://localhost:3000/api/users
// USER REGISTERATION ROUTE
router.post('/', function(req, res, next){
  try{
      req.getConnection(function(err, connection) {
        if(err)
        {
          console.error('SQL Connection error: ', err);
          return next(err);
        }
        else {

          if(req.body.username === null || req.body.username === '' || req.body.username === undefined ||
          req.body.password === null || req.body.password === '' || req.body.password === undefined ||
          req.body.email === null || req.body.email === '' || req.body.email === undefined){
            res.status(201).send({success:false, message:'정보를 모두 입력해주세요.'});
          }else {
            bcrypt.hash(req.body.password, 10, function(err, hash){
            if(err) {
              return next(err);
            }
            else {
            var password = hash;

            var insertSql = 'INSERT INTO users set ?';
            var tempToken = jwt.sign({username:req.body.username, email:req.body.email}, config.secret, {expiresIn: '24h'});

            var insertValue = {
                                username: req.body.username,
                                password: password,
                                email:req.body.email,
                                permission: req.body.permission,
                                is_enrolled: req.body.is_enrolled,
                                temporarytoken:tempToken
                               };

                connection.query(insertSql, insertValue, function (error, results, next) {

                // databases에서  select 문으로 중복된 사용자 찾아야함.
                    if(error){
                      if(error.errno === 1062){
                        res.status(201).send({success: false, message: '등록된 아이디 또는 이메일이 존재합니다.'});
                      } else {
                        res.status(201).send(error);
                      }
                    } else{

                      var email = {
                        from: 'awesome@bar.com',
                        to: req.body.email,
                        subject:'Localhost Activation Link',
                        text: 'Hello'+ req.body.username + ', Thank you for REGISTERATION http://localhost:3000/activate/' + insertValue.temporarytoken,
                        html: 'Hello<strong>'+ req.body.username + '</strong>, <br><br> Thank you for REGISTERATION<br><a href="http://localhost:3000/#!/activate/'+insertValue.temporarytoken+'">http://localhost:3000/activate</a>'
                      };

                      client.sendMail(email, function(err, info){
                        if(err){
                          console.log(err);
                        } else {
                          console.log('Message sent:' + info.response);
                        }
                      });

                      res.status(201).send({success: true, message: '아이디가 생성되었습니다. 아이디 인증을 위한 이메일을 확인해주세요.'});
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
