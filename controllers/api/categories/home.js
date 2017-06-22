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

          selectSql = 'select B.*, (select username from users where user_id = B.user_id) as username, (select description from photo_type where code = B.photo_type) as description from my_photos B;';
          connection.query(selectSql, function (err, result, next) {
          if(err){
    						res.send(err);
          }
					else {
            res.status(201).send(result);
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
