'use strict'

var validator = require('validator');
var Lesson = require ('../models/lesson');



var controller = {

	store: function(req, res){		
		
		var params = req.body;

		try{

			var validateTitle=!validator.isEmpty(params.title);
			//var validateDescription=!validator.isEmpty(params.description);
			//var validateTag=!validator.isEmpty(params.tag);
			//var validatePdf=!validator.isEmpty(params.pdf);
			//var validateAudio=!validator.isEmpty(params.audio);
			//var validateVideo=!validator.isEmpty(params.video);

		}catch(err){
			return res.status(200).send({
				message: 'Faltan datos por enviar.'
			});
		}


		if(validateTitle /*&& validateDescription && validateTag && validatePdf && validateAudio && validateVideo*/){
			var lesson = new Lesson();
			lesson.title = params.title;
			lesson.description = params.description;
			lesson.tag = params.tag;
			lesson.course = params.course;
			lesson.user=req.user.sub;

			lesson.save((err, lessonStored)=>{

				if(err || !lessonStored){
					return res.status(404).send({
						status: 'error',
						message: 'La lección no se ha guardado.'
					});
				}	
				return res.status(200).send({
						status: 'success',
						lesson: lessonStored
					});
			});

		}else{
			return res.status(200).send({
				message: 'Validación incorrecta.'
			});
		}
	},

	update: function(req, res){
	// Recibir datos
		var params = req.body;
		var userId = req.user.sub;
		var lessonId = req.params.lessonId;


		Lesson.findOneAndUpdate({_id: lessonId, user: userId}, params, {new:true}, (err, lessonUpdated)=>{

			if(err){
				return res.status(500).send({
					message: 'Error al actualizar el lesson',							
				});
			}

			if(!lessonUpdated){
				return res.status(400).send({
					message: 'Lesson no encontrado.',							
				});
			}


			return res.status(200).send({
				message: 'success',
				lesson: lessonUpdated			
			});

		}); // close findOneAndUpdate				
	},

	getLessons: function(req, res){
		// Recoger página actual
		if(!req.params.page || req.params.page==null || req.params.page==undefined || req.params.page==0 || req.params.page=='0'){
			var page=1;
		}else{
			var page = parseInt(req.params.page);
		}
		// Opciones de paginación

		var options = {
			sort:{date: -1}, //Orden mas nuevos primero
			populate: 'user', // Muestra el usuario
			limit: 5, // Entradas por página
			page: page
		}

		// Find paginado

		Lesson.paginate({}, options, (err, topics)=>{
			if(err){
				return res.status(500).send({
					staus: 'error',
					message: 'Error al hacer la consulta'
				});

			}

			return res.status(200).send({
				staus: 'success',
				lessons: lessons.docs,
				totalDocs: lessons.totalDocs,
				totalPages: lessons.totalPages
			});
		});
	},

	show: function(req, res){
		var lessonId = req.params.lessonId;
		Lesson.findById(lessonId).exec((err, lesson)=>{
			if(err || !lesson){
					return res.status(404).send({
						status: 'error',
						message: 'Lesson no encontrado.'
					});
				}else{
					return res.status(200).send({
						status: 'success',
						lesson: lesson
					});
				}
			});

		},//close getCover

	delete: function(req, res){
	// Recibir datos
		var params = req.body;
		var userId = req.user.sub;
		var lessonId = req.params.lessonId;

		// Encontrar el cover

		Lesson.findOneAndDelete({_id: lessonId, user: userId}, params, {new:true}, (err, lessonRemoved)=>{

			if(err){
				return res.status(500).send({
					message: 'Error al borrar el lesson',							
				});
			}

			if(!lessonRemoved){
				return res.status(400).send({
					message: 'Lesson no encontrado.',							
				});
			}


			return res.status(200).send({
				message: 'success',
				lessonRemoved: lessonRemoved			
			});

		}); // close findOneAndDelete				
	},
	




};// close controller

module.exports = controller;