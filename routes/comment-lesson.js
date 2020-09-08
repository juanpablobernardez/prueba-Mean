'use strict'

var express = require('express');
var CommentLessonController = require('../controllers/comment-lesson');

var router= express.Router();
var authMiddleware= require('../middlewares/authenticated');


router.post('/comment/lesson/:lessonId',authMiddleware.authenticated, CommentLessonController.store);
router.put('/comment/lesson/:commentId', authMiddleware.authenticated, CommentLessonController.update);
router.delete('/comment/lesson/:lessonId/:commentId', authMiddleware.authenticated, CommentLessonController.delete);

module.exports = router;