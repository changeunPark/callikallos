// privacy
var mysqlInfo = require('../mysql');

var express = require('express');
var router = express.Router();
var morgan = require('morgan');

var mysql = require('mysql');
var connection = require('express-myconnection'); // express-myconnection module

var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(morgan('dev'));

router.use(express.static(__dirname + '/../assets'));
router.use(express.static(__dirname + '/../templates'));
router.use(express.static(__dirname + '/../node_modules'));
router.use(express.static(__dirname + '/../bower_components'));

router.use(connection(mysql, {
  host     : mysqlInfo.host,
  user     : mysqlInfo.user,
  password : mysqlInfo.password,
  database : mysqlInfo.database
}, 'single'));

router.get('/', function (req, res) {
    res.sendfile('layouts/app.html');
});

module.exports = function (req, res, next){
  if(req.headers['x-access-token']){
  } else {
    next();
  }
};

module.exports = router;
