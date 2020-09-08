'use strict'

var express = require('express');
var CourseController = require('../controllers/course');

var router= express.Router();
var authMiddleware= require('../middlewares/authenticated');
var rolesMiddleware= require('../middlewares/roles');

// Configurar mltiparty
var multipart = require('connect-multiparty');
var uploadMiddleware = multipart({uploadDir: './uploads/courses'});

router.post('/course',authMiddleware.authenticated, CourseController.store);
router.get('/course/:page?'/*, authMiddleware.authenticated*/, CourseController.getCourses);
router.get('/course/show/:courseId', authMiddleware.authenticated, CourseController.show);
router.put('/course/:courseId', authMiddleware.authenticated, rolesMiddleware.isTeacher, CourseController.update);
router.delete('course/:courseId', authMiddleware.authenticated, rolesMiddleware.isTeacher, CourseController.delete);
router.post('/course/upload-image/:courseId', [authMiddleware.authenticated, uploadMiddleware], CourseController.uploadImage);
router.get('/course/get-image/:fileName', CourseController.getImage);

module.exports = router;