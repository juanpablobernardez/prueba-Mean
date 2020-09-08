'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router= express.Router();
var authMiddleware= require('../middlewares/authenticated');

// Configurar mltiparty
var multipart = require('connect-multiparty');
var uploadMiddleware = multipart({uploadDir: './uploads/users'});


// Rutas de usuario
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/user/update', authMiddleware.authenticated, UserController.update);
router.post('/user/upload-avatar', [authMiddleware.authenticated, uploadMiddleware], UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', authMiddleware.authenticated, UserController.getUsers);
router.get('/user/:userId',authMiddleware.authenticated, UserController.getUser);

// Ruta para confirmar el correo
router.get('/verify/:confirmation_code', UserController.confirm);



module.exports = router;