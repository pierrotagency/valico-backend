'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
|
*/
Route.group(() => {
        
    /*
    |--------------------------------------------------------------------------
    | API - Authentication
    |--------------------------------------------------------------------------
    */
    Route.post('/auth/register', 'Api/AuthController.register')
    Route.post('/auth/login', 'Api/AuthController.login')
    Route.post('/auth/token/refresh', 'Api/AuthController.refreshToken');
    Route.post('/auth/logout', 'Api/AuthController.logout');

    /*
    |--------------------------------------------------------------------------
    | API - Post
    |--------------------------------------------------------------------------
    */
    Route.put('/posts/:id', 'Api/PostController.update').middleware('auth').validator('UpdatePost')
    Route.delete('posts/:id', 'Api/PostController.delete').middleware('auth')
    Route.get('posts/:id/peep', 'Api/PostController.peep').middleware('auth')
    Route.get('posts/:id', 'Api/PostController.get').middleware('auth')
    Route.post('/posts', 'Api/PostController.store').middleware('auth').validator('StorePost')
    Route.get('/posts', 'Api/PostController.list').middleware('auth')
    
    Route.post('/posts/exists/slug', 'Api/PostController.slugExists').middleware('auth')

    /*
    |--------------------------------------------------------------------------
    | API - Tag
    |--------------------------------------------------------------------------
    */
    Route.post('/tags', 'Api/TagController.store').middleware('auth')
    Route.get('/tags', 'Api/TagController.list').middleware('auth')

    /*
    |--------------------------------------------------------------------------
    | API - Media
    |--------------------------------------------------------------------------
    */
    Route.post('/media/file/upload', 'Api/MediaController.uploadFile')
    Route.post('/media/image/upload', 'Api/MediaController.uploadImage')
    
    /*
    |--------------------------------------------------------------------------
    | API - User
    |--------------------------------------------------------------------------
    */
    Route.get('/user/me', 'Api/UserController.getUser').middleware('auth')
    

}).prefix('api/v1');
