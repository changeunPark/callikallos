var app = angular.module('app');
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
$urlRouterProvider.otherwise('/');
 $stateProvider
           .state('app', {
             url: '/',
             views:{
               'header': {
               templateUrl: '/fixed/mainMenu.html',
               controller: 'MainMenuController'
               },
               'content': {
               templateUrl: '/category/home.html'
               },
               'footer': {
               templateUrl: '/fixed/footer.html'
               }
             }
            })

            .state('resetusername',
            {
              url: '/resetusername',
              templateUrl: '/fixed/reset/username.html',
              controller: 'usernameCtrl',
              controllerAs: 'username'
            })

            .state('resetpassword',
            {
              url: '/resetpassword',
              templateUrl: '/fixed/reset/password.html',
              controller: 'passwordCtrl',
              controllerAs: 'password'
            })

            .state('reset',
            {
              url: '/reset/:token',
              templateUrl: '/fixed/reset/newpassword.html',
              controller: 'resetCtrl',
              controllerAs: 'reset'
            })


            .state('activate',
            {
              url: '/activate/:token',
              templateUrl: '/fixed/activation/activate.html',
              controller: 'emailCtrl',
              controllerAs: 'email'
            })

            .state('resend',
            {
              url: '/resend',
              templateUrl: '/fixed/activation/resend.html',
              controller: 'resendCtrl',
              controllerAs: 'resend'
            })


            .state('login',
            {
              url: '/login',
              templateUrl: '/isLoggedOut/login.html',
              authenticated: false
            })

           .state('register',
            {
              url: '/register',
              controller: 'regCtrl',
              controllerAs: 'register',
              templateUrl: '/isLoggedOut/register.html',
              authenticated: false
           })

            .state('app.intro',
            {
              url: 'intro',
              views:{
                'content@': {
                  templateUrl: '/fixed/introduce/intro.html',
                  authenticated: false
                }
              }
            })

            .state('app.terms',
            {
              url: 'terms',
              views:{
                'content@': {
                  templateUrl: '/fixed/law/terms.html',
                  authenticated: false
                }
              }
            })

            .state('app.privacy',
            {
              url: 'privacy',
              views:{
                'content@': {
                  templateUrl: '/fixed/law/privacy.html',
                  authenticated: false
                }
              }
            })


// 유저 프로필 모아 놓은 곳  / 계정 정보
         .state('app.profiles', {
           url: 'profiles',
           views:{
             'content@': {
              templateUrl: 'isLoggedIn/myProfiles.html',
              controller: 'ProfileController',
              authenticated: true
             }
           }
          })

// 유저 작품 모아 놓은 곳  / 작품 정보
          .state('app.photos', {
            url: 'photos',
            views:{
              'content@': {
                templateUrl: 'isLoggedIn/myPhotos.html',
                controller: 'PhotosController',
                authenticated: false
              }
            }
           })


// 업로드 하는 곳
           .state('app.upload', {
             url: 'upload',
             views:{
               'content@': {
                templateUrl: 'isLoggedIn/upload.html',
                controller: 'UploadPhotoController',
                authenticated: true
               }
             }
            })


// ==================  artist / gallery / exhibition / board ============================ //
// ==================  artist 카테고리 ============================ //

            .state('app.artist', {
              url: 'artist',
              views:{
                'content@': {
                  templateUrl: 'category/artist.html',
                  controller: 'ArtistController',
                  authenticated: false
                },
                'artist-header@app.artist':{
                  templateUrl: '/fixed/subMenu.html',
                  controller: 'ArtistMenuController',
                  authenticated: false
                },
              } 
             })

            .state('app.artist.category', {
              url: '/category=:code',
              views: {
                'detail@app.artist':{
                  templateUrl: '/partialArtist/content.html',
                  controller: 'ArtistMenuController',
                  authenticated: false
                }
              }
            })

             .state('app.artist.show', {
               url: '/:artist_id',
               views:{
                 'content@':{
                   templateUrl: '/partialArtist/artist.html',
                   controller: 'ArtistController',
                   authenticated: false
                 }
               }
              })


// ==================  artist / gallery / exhibition / board ============================ //
// ==================  gallery 카테고리 ============================ //
          .state('app.gallery', {
            url: 'gallery',
            views:{
              'content@': {
                templateUrl: 'category/gallery.html',
                controller: 'GalleryController',
                authenticated: false
              },
              'gallery-header@app.gallery':{
                templateUrl: '/fixed/subMenu.html',
                controller: 'GalleryMenuController',
                authenticated: false
              }
            }
           })

          .state('app.gallery.category', {
            url: '/category=:code',
            views: {
              'detail@app.gallery':{
                templateUrl: '/partialGallery/content.html',
                controller: 'GalleryMenuController',
                authenticated: false
              }
            }
          })

           .state('app.gallery.show', {
             url: '/category=:photo_type/photos:photo_id',
             views:{
               'content@':{
                 templateUrl: '/partialGallery/photo.html',
                 controller: 'GalleryController',
                 authenticated: false
               }
             }
            })

            .state('app.gallery.edit', {
              url: '/edit/:photo_id',
              views:{
                'content@':{
                  templateUrl: '/partialGallery/photoEdit.html',
                  controller: 'GalleryController',
                  authenticated: true
                }
              }
             })

// ==================  artist / gallery / exhibition / board ============================ //
// ==================  exhibition 카테고리 ============================ //

              .state('app.display', {
                url: 'display',
                views:{
                  'content@': {
                    templateUrl: 'category/display.html',
                    authenticated: false
                  },
                  'display-header@app.display':{
                    templateUrl: '/fixed/subMenu.html',
                    controller: 'displayMenuController',
                    authenticated: false
                  }
                }
               })

              .state('app.display.category', {
                url: '/category=:code',
                views: {
                  'detail@app.display':{
                    templateUrl: '/partialDisplay/content.html',
                    controller: 'displayMenuController',
                    authenticated: false

                  }
                }
              })

// ==================  artist / gallery / exhibition / board ============================ //
// ==================  board 카테고리 ============================ //

            .state('app.board', {
              url: 'board',
              views:{
                'content@': {
                  templateUrl: 'category/board.html',
                  controller: 'BoardController',
                  authenticated: false
                },
                'board-header@app.board':{
                  templateUrl: '/fixed/boardMenu.html',
                  controller: 'BoardMenuController',
                  authenticated: false
                },
              }
             })

            .state('app.board.category', {
              url: '/category=:code',
              views: {
                'content@app.board':{
                  templateUrl: '/partialBoard/content.html',
                  controller: 'BoardMenuController',
                  authenticated: false
                }
              }
            })

            .state('app.board.create',
            {
              url:'/create',
              views:{
                'content@app.board':{
                  controller: 'BoardController',
                  templateUrl:'/partialBoard/boardCreate.html',
                  authenticated: true
                }
              }
            })

           .state('app.board.show',
           {
             url: '/:board_id',
             views:{
               'content@app.board':{
                 controller: 'BoardController',
                 templateUrl: 'partialBoard/article.html',
                 authenticated: false,
               }
             }
           })

           .state('app.board.edit',
           {
             url: '/edit/:board_id',
             views:{
               'content@app.board':{
               controller: 'BoardController',
               templateUrl: 'partialBoard/boardUpdate.html',
               authenticated: true
             }
           }
         });
        //  $locationProvider.html5Mode(true);

});
