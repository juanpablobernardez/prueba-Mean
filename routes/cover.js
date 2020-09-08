'use strict'

var express = require('express');
var CoverController = require('../controllers/cover');

var router= express.Router();
var authMiddleware= require('../middlewares/authenticated');
var rolesMiddleware= require('../middlewares/roles');

router.post('/cover',authMiddleware.authenticated, CoverController.store);
router.get('/cover/:page?', authMiddleware.authenticated, CoverController.getCovers);
router.get('/cover/show/:coverId', authMiddleware.authenticated, CoverController.show);
router.put('/cover/:coverId', authMiddleware.authenticated, rolesMiddleware.isTeacher, CoverController.update);
router.delete('cover/:coverId', authMiddleware.authenticated, rolesMiddleware.isTeacher, CoverController.delete);

module.exports = router;