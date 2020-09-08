'use strict'

var validator = require('validator');
var Cover = require ('../models/cover');



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
			var cover = new Cover();
			cover.title = params.title;
			cover.description = params.description;
			cover.tag = params.tag;
			cover.user=req.user.sub;

			cover.save((err, courseStored)=>{

				if(err || !coverStored){
					return res.status(404).send({
						status: 'error',
						message: 'El cover no se ha guardado.'
					});
				}	
				return res.status(200).send({
						status: 'success',
						cover: coverStored
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
			var courseId = req.params.coverId;


			Cover.findOneAndUpdate({_id: coverId, user: userId}, params, {new:true}, (err, coverUpdated)=>{

				if(err){
					return res.status(500).send({
						message: 'Error al actualizar el cover',							
					});
				}

				if(!courseUpdated){
					return res.status(400).send({
						message: 'Cover no encontrado.',							
					});
				}


				return res.status(200).send({
					message: 'success',
					cover: coverUpdated			
				});

			}); // close findOneAndUpdate				
		},


	getCovers: function(req, res){
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

		Cover.paginate({}, options, (err, topics)=>{
			if(err){
				return res.status(500).send({
					staus: 'error',
					message: 'Error al hacer la consulta'
				});

			}

			return res.status(200).send({
				staus: 'success',
				covers: covers.docs,
				totalDocs: covers.totalDocs,
				totalPages: covers.totalPages
			});
		});
	},


	show: function(req, res){
		var coverId = req.params.coverId;
		Cover.findById(coverId).exec((err, user)=>{
			if(err || !cover){
					return res.status(404).send({
						status: 'error',
						message: 'Cover no encontrado.'
					});
				}else{
					return res.status(200).send({
						status: 'success',
						cover: cover
					});
				}
			});

		},//close getCover

	delete: function(req, res){
	// Recibir datos
		var params = req.body;
		var userId = req.user.sub;
		var courseId = req.params.coverId;

		// Encontrar el cover

		Cover.findOneAndDelete({_id: coverId, user: userId}, params, {new:true}, (err, coverRemoved)=>{

			if(err){
				return res.status(500).send({
					message: 'Error al borrar el cover',							
				});
			}

			if(!courseUpdated){
				return res.status(400).send({
					message: 'Cover no encontrado.',							
				});
			}


			return res.status(200).send({
				message: 'success',
				cover: coverRemoved			
			});

		}); // close findOneAndDelete				
	},


};// close controller

module.exports = controller;
