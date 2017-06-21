var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(express.static('image'));
app.use('/', require('./controllers/static'));

// 전체 메뉴
app.use('/api/header', require('./controllers/api/menu/header'));
// ============================== 부 메뉴 ======================================== //
app.use('/api/artistMenu', require('./controllers/api/menu/artistMenu'));
app.use('/api/displayMenu', require('./controllers/api/menu/displayMenu'));
app.use('/api/galleryMenu', require('./controllers/api/menu/galleryMenu'));
app.use('/api/boardMenu', require('./controllers/api/menu/boardMenu'));
// =============================================================================== //
app.use('/api/home', require('./controllers/api/home'));
app.use('/api/artist', require('./controllers/api/artist'));
app.use('/api/gallery', require('./controllers/api/gallery'));
app.use('/api/board', require('./controllers/api/board'));
// =============================================================================== //
app.use('/api/authenticate', require('./controllers/api/authenticate'));
app.use('/api/renewToken', require('./controllers/api/renewToken'));
app.use('/api/me', require('./controllers/api/me'));
app.use('/api/users', require('./controllers/api/users'));
app.use('/api/activate', require('./controllers/api/activate'));
app.use('/api/resend', require('./controllers/api/resend'));
app.use('/api/resetusername', require('./controllers/api/user/reset/username'));
app.use('/api/resetpassword', require('./controllers/api/user/reset/password'));
app.use('/api/savepassword', require('./controllers/api/user/save/password'));
// =============================================================================== //
// =============================================================================== //
app.use('/api/comment', require('./controllers/api/comment'));
app.use('/api/opinion', require('./controllers/api/opinion'));
// =============================================================================== //
app.use('/api/myProfileTap1', require('./controllers/api/myProfileTap1'));
app.use('/api/myProfileTap2', require('./controllers/api/myProfileTap2'));
// =============================================================================== //
app.use('/api/upload', require('./controllers/api/upload'));
app.use('/api/uploadTemp', require('./controllers/api/uploadTemp'));
app.use('/api/uploadDisplay', require('./controllers/api/uploadDisplay'));
app.use('/api/uploadDisplayTemp', require('./controllers/api/uploadDisplayTemp'));
// =============================================================================== //
app.use('/api/myPhotos', require('./controllers/api/myPhotos'));
app.use('/api/myProfileImage', require('./controllers/api/myProfileImage'));


// app.use(require('./auth'));
app.listen(3000, function () {
    console.log('Server listening on', 3000);
});
