var router = require('express').Router();

router.get('/', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var selectSql = 'select * from user_type';
				//Select a record.
          connection.query(selectSql, function (err, result, next) {
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
					else {
            res.json(result);
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


router.get('/:code', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var selectSql = 'select my_profile.*, users.permission, users.profile_image, users.username, user_type.description from ((my_profile left join users on users.user_id = my_profile.user_id) inner join user_type on my_profile.user_type = user_type.code) where user_type = ?;';
        var selectValue = 'moderator';
        var selectCode = req.params.code;

        if(selectCode === '0'){
          selectSql = 'select my_profile.*, users.permission, users.profile_image, users.username, user_type.description from ((my_profile left join users on users.user_id = my_profile.user_id) inner join user_type on my_profile.user_type = user_type.code) where permission =?;';
          connection.query(selectSql, selectValue, function (err, result, next) {
          if(err){
    						res.send(err);
          }
					else {

            res.status(201).send(result);
					}
				});
        }

        else {
          connection.query(selectSql, selectCode, function (err, result, next) {
          if(err){
                res.send(err);
          }
          else {

            res.status(201).send(result);
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
