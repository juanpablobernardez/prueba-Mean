'use strict'

var validator = require('validator');
var Course = require ('../models/course');

var fs = require('fs');
var path = require('path')

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


		if(validateTitle){
			var course = new Course();
			course.title = params.title;
			course.description = params.description;
			course.tag = params.tag;
			course.user=req.user.sub;

			course.save((err, courseStored)=>{

				if(err || !courseStored){
					return res.status(404).send({
						status: 'error',
						message: 'El curso no se ha guardado.'
					});
				}	
				return res.status(200).send({
						status: 'success',
						course: courseStored
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
		var courseId = req.params.courseId;


		Course.findOneAndUpdate({_id: courseId, user: userId}, params, {new:true}, (err, courseUpdated)=>{

			if(err){
				return res.status(500).send({
					message: 'Error al actualizar el curso',							
				});
			}

			if(!courseUpdated){
				return res.status(400).send({
					message: 'Curso no encontrado.',							
				});
			}


			return res.status(200).send({
				message: 'success',
				course: courseUpdated			
			});

		}); // close findOneAndUpdate				
	},

	getCourses: function(req, res){
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

		Course.paginate({}, options, (err, courses)=>{
			if(err){
				return res.status(500).send({
					staus: 'error',
					message: 'Error al hacer la consulta'
				});

			}

			return res.status(200).send({
				staus: 'success',
				courses: courses.docs,
				totalDocs: courses.totalDocs,
				totalPages: courses.totalPages
			});
		});
	},

	show: function(req, res){
		var courseId = req.params.courseId;
		Course.findById(courseId).exec((err, course)=>{
			if(err || !course){
					return res.status(404).send({
						status: 'error',
						message: 'Curso no encontrado.'
					});
				}else{
					return res.status(200).send({
						status: 'success',
						course: course
					});
				}
			});

		},//close getCourse

	getCourseLessons: function(req, res){
		var courseId = req.params.courseId;
		Cover.findById(courseId).exec((err, user)=>{
			if(err || !course){
					return res.status(404).send({
						status: 'error',
						message: 'Curso no encontrado.'
					});
				}else{
					return res.status(200).send({
						status: 'success',
						course: course
					});
				}
			});

		},//close getCourse

	delete: function(req, res){
	// Recibir datos
		var params = req.body;
		var userId = req.user.sub;
		var courseId = req.params.courseId;

		// Encontrar el curso

		Course.findOneAndDelete({_id: courseId, user: userId}, params, {new:true}, (err, courseRemoved)=>{

			if(err){
				return res.status(500).send({
					message: 'Error al borrar el curso',							
				});
			}

			if(!courseUpdated){
				return res.status(400).send({
					message: 'Curso no encontrado.',							
				});
			}


			return res.status(200).send({
				message: 'success',
				course: courseRemoved			
			});

		}); // close findOneAndDelete				
	},

	uploadImage: function(req, res){
		// Recoger fichero
			var fileName = 'Imagen no cargada.';
			
			if(!req.files){				
				return res.status(404).send({
					status: 'error',
					message: fileName		
				});

			}else{
				var filePath = req.files.file0.path;
				var fileSplit = filePath.split('\\');

				// Nombre del archivo
				fileName = fileSplit[2];
				// Extensión
				var extSplit = fileName.split('\.');
				var fileExt = extSplit[1];				
				// Comprobar extensión, si no es válida borrar archivo subido
				if(fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif'){
					fs.unlink(filePath, (err)=>{
						
						return res.status(200).send({
							status: 'error',
							message: 'La extensión no es válida.'
							
						});
					});

				}else{

				
				var courseId = req.params.courseId;

				// Buscar y Actalizar documento
				Course.findOneAndUpdate({_id:courseId}, {image: fileName}, {new: true}, (err, courseUpdated)=> {
					if(err || !courseUpdated){

						// Devolver respuesta
						return res.status(500).send({
							status: 'error',
							message: 'Error al guardar la imagen.'
						});
					}



					return res.status(200).send({
						message: 'success',
						course: courseUpdated			
					});

				});

			}// close else	

		} //close else

	},//close upload-image

	getImage: function(req, res){

	var fileName = req.params.fileName;
	var pathFile = './uploads/courses/'+fileName;
	

	fs.exists(pathFile, (exists)=>{
		if(exists){
			return res.sendfile(path.resolve(pathFile));
		}else{
			return res.status(404).send({
					status:'error',
					message: 'Imagen no encontrada'
				});				
			}

		});

	},

	
};// close controller

module.exports = controller;
