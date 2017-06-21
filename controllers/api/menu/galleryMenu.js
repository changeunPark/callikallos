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

        var selectSql = 'select * from photo_type';
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
        var selectSql = 'select B.*, (select username from users where user_id = B.user_id) as username, (select description from photo_type where code = B.photo_type) as description, (select profile_image from users where user_id = B.user_id) as profile_image, (select count(*) from comment where photo_id = B.photo_id) as comment_count, (select count(*) from opinion where photo_id = B.photo_id) as opinion_count from my_photos B where photo_type = ?;';
        var selectValue = req.params.code;
        if(selectValue === '0'){
          selectSql = 'select B.*, (select username from users where user_id = B.user_id) as username, (select description from photo_type where code = B.photo_type) as description, (select profile_image from users where user_id = B.user_id) as profile_image, (select count(*) from comment where photo_id = B.photo_id) as comment_count, (select count(*) from opinion where photo_id = B.photo_id) as opinion_count from my_photos B;';
          connection.query(selectSql, function (err, result, next) {
          if(err){
    						res.send(err);
          }
					else {

            res.status(201).send(result);
					}
				});
        }

        else {
          connection.query(selectSql, selectValue, function (err, result, next) {
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
