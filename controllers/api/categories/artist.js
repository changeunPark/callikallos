var router = require('express').Router();

router.get('/:id', function(req, res, next){
try{

    req.getConnection(function(err, connection) {
      if(err)
      {
        console.error('SQL Connection error: ', err);
        return next(err);
      }
      else {
        var selectSql = 'select B.*,  (select username from users where user_id = B.user_id) as username, (select profile_image from users where user_id = B.user_id) as profile_image, (select description from photo_type where code = B.photo_type) as description from my_photos B where user_id = ?';
        var selectValue = req.params.id;
// (select count(*) from comment where photo_id = B.photo_id) as comment_count, (select count(*) from opinion where photo_id = B.photo_id) as opinion_count
          connection.query(selectSql, selectValue, function (err, result, next) {
          if(err){
    						res.send(err);
          }
					else {

// 사용자가 작품을 하나도 안 올렸을 때
            if(result.length === 0){
              var selectSql = 'select * from users where user_id = ?;';
              var selectValue = req.params.id;
              connection.query(selectSql, selectValue, function(err, result, next){
                if(err){
                  res.send(err);
                } else {
                  {
                    res.json(result);
                  }
                }
              });
            }
// 사용자가 작품을 하나 이상 올렸을 때
            else {
              res.json(result);
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
