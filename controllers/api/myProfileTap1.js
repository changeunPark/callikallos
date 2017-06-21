var router = require('express').Router();

// 계정정보
router.get('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        if(!req.headers['x-auth']){
          console.log('로그인이 필요합니다.');
        }
        else {
// 흠 두 번 써야 해?
// select B.*, (select profile_id from my_profile where user_id = B.user_id) as userstatus from users B;
          var selectSql = 'SELECT ?? FROM users WHERE user_id = ?';
          var selectValue = [
            'username',
            'email',
            'profile_image',
            'permission',
            'is_enrolled'
          ];
          connection.query(selectSql, [selectValue, req.auth.user_id], function (err, result, next) {
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
          res.status(201).send(result[0]);
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


// 사용자 정보 변경
router.put('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        if(!req.headers['x-auth']){
          console.log('로그인이 필요합니다.');
        }
        else {

          var updateValue = {
            username:req.body.response.username,
            email:req.body.response.email,
            permission:req.body.permission,
            is_enrolled:req.body.is_enrolled
          };

          var user_id = req.auth.user_id;
          var updateRecord = 'UPDATE users SET ? WHERE user_id = ?';
          // connection.query('UPDATE * FROM employee WHERE id = ?', [id], function (err, employee) {
            connection.query(updateRecord, [updateValue, user_id], function (err, response) {
          if(err) throw err;
          else {
            res.status(201).send({success:true, message:"개인정보가 변경되었습니다."});
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
