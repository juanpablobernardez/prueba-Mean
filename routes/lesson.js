'use strict'

var express = require('express');
var LessonController = require('../controllers/lesson');

var router= express.Router();
var authMiddleware= require('../middlewares/authenticated');
var rolesMiddleware= require('../middlewares/roles');

router.post('/lesson',authMiddleware.authenticated, LessonController.store);
router.get('/lesson/:page?', authMiddleware.authenticated, LessonController.getLessons);
router.get('/lesson/show/:lessonId', authMiddleware.authenticated, LessonController.show);
router.put('/lesson/:lessonId', authMiddleware.authenticated, rolesMiddleware.isTeacher, LessonController.update);
router.delete('lesson/:lessonId', authMiddleware.authenticated, rolesMiddleware.isTeacher, LessonController.delete);


module.exports = router;