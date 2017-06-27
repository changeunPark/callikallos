var router = require('express').Router();

// 계정정보
router.get('/:username', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
          var selectSql = 'SELECT ?? FROM users WHERE username = ?';
          var selectValue = [
            'username',
            'email',
            'profile_image'
          ];
          var username = req.params.username;
          connection.query(selectSql, [selectValue, username], function (err, result, next) {
          if(err){
            throw err;
          }
          if(!result[0]){
            res.status(201).send({success:false, message:"잘못된 정보입니다."});

          } else {
            res.status(201).send({success:true, message:"정보를 성공적으로 불러왔습니다.", profiles: result[0]});
          }
          });
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
          var updateValue = {
            username:req.body.username,
            email:req.body.email,
          };

          var user_id = req.body.user_id;
          var updateRecord = 'UPDATE users SET ? WHERE user_id = ?';
          // connection.query('UPDATE * FROM employee WHERE id = ?', [id], function (err, employee) {
            connection.query(updateRecord, [updateValue, user_id], function (err, response) {
          if(err) throw err;
          else {
            console.log(response);
            if(!response){
              res.status(201).send({success:false, message:"잘못된 정보입니다.?"});
            } else {
              res.status(201).send({success:true, message:"개인정보가 변경되었습니다."});
            }
          }
        });
        }


  });
}
catch(ex){
  console.error("Internal error: "+ex);
  return next(ex);
}
});



module.exports = router;
