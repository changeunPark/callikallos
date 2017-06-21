var router = require('express').Router();
var config = require('../../config');
var jwt = require('jsonwebtoken');

// localhost/api/me

router.use(function(req, res, next){
  var token = req.body.token || req.body.query || req.headers['x-access-token'];
  if(token){
    jwt.verify(token, config.secret, function(err, decoded){
      if(err){
        res.json({success:false, message:'Token invalid'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({success:false, message:'No token provided'});
  }
});

// 생성된 사용자와 입력된 정보 비교
router.post('/', function(req, res, next){
try{
    req.getConnection(function(err, connection) {
      if(err){
        console.error('SQL connection error : ', err);
        return next(err);
      }
      else
      {
        res.send(req.decoded);
      }
    });
  }
    catch(ex){
    console.log("Internal error: " +ex);
    return next(ex);
    }
});

module.exports= router;
