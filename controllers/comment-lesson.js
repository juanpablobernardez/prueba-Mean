'use strict'

var validator = require('validator');
var Lesson = require ('../models/lesson');


var controller = {

	store: function(req, res){

		var lessonId = req.params.lessonId;


		Lesson.findById(lessonId).exec((err, lesson)=>{

			if(err){
				return res.status(500).send({
					status: 'Error',
					message: 'Error en la petición'
				});
			}

			if(!lesson){
				return res.status(404).send({
					status: 'Error',
					message: 'Lección no encontrada.'
				});
			}

			if(req.body.content){

				try{

					var validateContent=!validator.isEmpty(req.body.content);
					
				}catch(err){
					return res.status(200).send({
						message: 'No has comentado nada'
					});
				}

				if(validateContent){
					var comment = {
						user: req.user.sub,
						content: req.body.content
					};

					lesson.comments.push(comment);

					lesson.save((err, lesson)=>{

						if(err){
							return res.status(404).send({
								status: 'error',
								message: 'El comentario no se ha guardado.'
							});
						}	
						return res.status(200).send({
								status: 'success',
								lesson: lesson
							});
					});

				}else{
					return res.status(200).send({
						message: 'Validación incorrecta.'
					});
				}
			}
		});
	},

	update: function(req, res){

		var commentId = req.params.commentId;
		var params = req.body.content;

		try{

			var validateContent=!validator.isEmpty(params);
			
		}catch(err){
			return res.status(200).send({
				message: 'No has comentado nada'
			});
		}

		if(validateContent){
			Lesson.findOneAndUpdate(
				{'comments._id': commentId},
				{
					$set: {
						'comments.$.content': params
					}
				},
				{new: true},
				(err, lessonUpdated)=>{
					if(err){
						return res.status(404).send({
							status: 'error',
							message: 'El comentario no se ha editado.'
						});
					}

					if(!lessonUpdated){
						return res.status(404).send({
							status: 'Error',
							message: 'Lección no encontrada.'
						});
					}

					return res.status(200).send({
							status: 'success',
							lesson: lessonUpdated
					});
				});	

		}else{
			return res.status(200).send({
				message: 'Validación incorrecta.'
			});
		}
	},

	delete: function(req, res){
	// Recibir datos
		var lessonId = req.params.lessonId;
		var commentId = req.params.commentId;

		Lesson.findById(lessonId, (err, lesson)=>{
			
			if(err || !lesson){
					return res.status(404).send({
						status: 'error',
						message: 'Lección no encontrada.'
					});
			}		
			var comment = lesson.comments.id(commentId);

			if(comment){
				comment.remove();

				lesson.save((err, lesson)=>{

					if(err){
						return res.status(500).send({
							status: 'error',
							message: 'El comentario no se ha eliminado.'
						});
					}	
					return res.status(200).send({
						status: 'success',
						lesson: lesson
					});
				});
			}else{
				return res.status(404).send({
					status: 'error',
					message: 'Comentario no encontrado.'
				});
			}
		});	
		}
	}


module.exports = controller;