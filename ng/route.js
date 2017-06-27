var app = angular.module('app');
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
$urlRouterProvider.otherwise('/');
// $locationProvider.html5Mode(true);


 $stateProvider
           .state('app', {
             url: '/',
             views:{
               'header': {
               templateUrl: '/menues/mainMenu.html',
               controller: 'MainMenuController'
               },
               'content': {
               templateUrl: '../categories/home.html'
               },
               'footer': {
               templateUrl: '/company/footer.html'
               }
             }
            })

            .state('registerStep1',
             {
               url: '/register/step1',
               controller: 'regCtrl',
               controllerAs: 'register',
               templateUrl: '/isLoggedOut/registerStep1.html',
               authenticated: false
            })

            .state('registerStep2',
             {
               url: '/register/step2',
               controller: 'regCtrl',
               controllerAs: 'register',
               templateUrl: '/isLoggedOut/registerStep2.html',
               authenticated: false
            })


            .state('resetusername',
            {
              url: '/resetusername',
              templateUrl: '/users/reset/username.html',
              controller: 'usernameCtrl',
              controllerAs: 'username'
            })

            .state('resetpassword',
            {
              url: '/resetpassword',
              templateUrl: '/users/reset/password.html',
              controller: 'passwordCtrl',
              controllerAs: 'password'
            })

            .state('reset',
            {
              url: '/reset/:token',
              templateUrl: '/users/reset/newpassword.html',
              controller: 'resetCtrl',
              controllerAs: 'reset'
            })


            .state('activate',
            {
              url: '/activate/:token',
              templateUrl: '/users/activation/activate.html',
              controller: 'emailCtrl',
              controllerAs: 'email'
            })

            .state('resend',
            {
              url: '/resend',
              templateUrl: '/users/activation/resend.html',
              controller: 'resendCtrl',
              controllerAs: 'resend'
            })



  // 유저 작품 모아 놓은 곳  / 작품 정보
            .state('app.photos', {
              url: 'photos',
              views:{
                'content@': {
                  templateUrl: 'isLoggedIn/artistPhotos.html',
                  controller: 'PhotosController',
                  authenticated: false
                }
              }
             })

  // 유저 프로필 모아 놓은 곳  / 계정 정보
           .state('app.profiles', {
             url: 'profiles',
             views:{
               'content@': {
                templateUrl: 'isLoggedIn/userProfiles.html',
                controller: 'profileCtrl',
                controllerAs: 'profile'
               }
             }
            })

// 등록된 작가가 작품 업로드 하는 곳
           .state('app.artistProfiles', {
             url: 'artist',
             views:{
               'content@': {
                templateUrl: 'isLoggedIn/artistProfiles.html',
                controller: 'artistCtrl',
                controllerAs: 'artist',
                authenticated: true
               }
             }
            })


            .state('app.intro',
            {
              url: 'intro',
              views:{
                'content@': {
                  templateUrl: '/company/intro.html',
                  authenticated: false
                }
              }
            })

            .state('app.terms',
            {
              url: 'terms',
              views:{
                'content@': {
                  templateUrl: '/company/terms.html',
                  authenticated: false
                }
              }
            })

            .state('app.privacy',
            {
              url: 'privacy',
              views:{
                'content@': {
                  templateUrl: '/company/privacy.html',
                  authenticated: false
                }
              }
            })





// ==================  artist / gallery / exhibition / board ============================ //
// ==================  artist 카테고리 ============================ //

            .state('app.artist', {
              url: 'artist',
              views:{
                'content@': {
                  templateUrl: 'categories/artist.html',
                  controller: 'ArtistController',
                  authenticated: false
                },
                'artist-header@app.artist':{
                  templateUrl: '/menues/subMenu.html',
                  controller: 'ArtistMenuController',
                  authenticated: false
                },
              }
             })

            .state('app.artist.categories', {
              url: '/categories=:code',
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
                templateUrl: 'categories/gallery.html',
                controller: 'GalleryController',
                authenticated: false
              },
              'gallery-header@app.gallery':{
                templateUrl: '/menues/subMenu.html',
                controller: 'GalleryMenuController',
                authenticated: false
              }
            }
           })

          .state('app.gallery.categories', {
            url: '/categories=:code',
            views: {
              'detail@app.gallery':{
                templateUrl: '/partialGallery/content.html',
                controller: 'GalleryMenuController',
                authenticated: false
              }
            }
          })

           .state('app.gallery.show', {
             url: '/categories=:photo_type/photos:photo_id',
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
                    templateUrl: 'categories/display.html',
                    authenticated: false
                  },
                  'display-header@app.display':{
                    templateUrl: '/menues/subMenu.html',
                    controller: 'displayMenuController',
                    authenticated: false
                  }
                }
               })

              .state('app.display.categories', {
                url: '/categories=:code',
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
                  templateUrl: 'categories/board.html',
                  controller: 'BoardController',
                  authenticated: false
                },
                'board-header@app.board':{
                  templateUrl: '/menues/boardMenu.html',
                  controller: 'BoardMenuController',
                  authenticated: false
                },
              }
             })

            .state('app.board.categories', {
              url: '/categories=:code',
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

});
