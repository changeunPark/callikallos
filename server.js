var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(express.static('image'));
app.use('/', require('./controllers/static'));


// 사용자 및 작가 정보
app.use('/api/userProfiles', require('./controllers/api/userProfiles'));
app.use('/api/artistProfiles', require('./controllers/api/artistProfiles'));
app.use('/api/artistPhotos', require('./controllers/api/artistPhotos'));

// 전체 메뉴
app.use('/api/header', require('./controllers/api/menu/header'));
// ============================== 부 메뉴 ======================================== //
app.use('/api/artistMenu', require('./controllers/api/menu/artistMenu'));
app.use('/api/displayMenu', require('./controllers/api/menu/displayMenu'));
app.use('/api/galleryMenu', require('./controllers/api/menu/galleryMenu'));
app.use('/api/boardMenu', require('./controllers/api/menu/boardMenu'));

// middleware
app.use('/api/me', require('./controllers/api/middleware/me'));

// categories //
app.use('/api/home', require('./controllers/api/categories/home'));
app.use('/api/artist', require('./controllers/api/categories/artist'));
app.use('/api/gallery', require('./controllers/api/categories/gallery'));
app.use('/api/board', require('./controllers/api/categories/board'));

// user/reset
app.use('/api/resetusername', require('./controllers/api/user/reset/username'));
app.use('/api/resetpassword', require('./controllers/api/user/reset/password'));
app.use('/api/savepassword', require('./controllers/api/user/reset/savepassword'));

// Login
app.use('/api/authenticate', require('./controllers/api/user/login/authenticate'));

// Register
app.use('/api/users', require('./controllers/api/user/register/users'));

// 부서적인 것들/
app.use('/api/renewToken', require('./controllers/api/user/renewToken'));
app.use('/api/activate', require('./controllers/api/user/activate'));
app.use('/api/resend', require('./controllers/api/user/resend'));

// =============================================================================== //
app.use('/api/comment', require('./controllers/api/comment'));
app.use('/api/commentBoard', require('./controllers/api/commentBoard'));
// =============================================================================== //
app.use('/api/uploadTemp', require('./controllers/api/uploadTemp'));
app.use('/api/uploadDisplay', require('./controllers/api/uploadDisplay'));
app.use('/api/uploadDisplayTemp', require('./controllers/api/uploadDisplayTemp'));
// =============================================================================== //

// app.use(require('./auth'));
app.listen(3000, function () {
    console.log('Server listening on', 3000);
});
