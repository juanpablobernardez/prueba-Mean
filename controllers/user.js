'use strict'

var validator = require('validator');
var User = require ('../models/user');
var bcrypt = require('bcrypt-node');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path')
const crypto = require('crypto');
var nodemailer = require('nodemailer');

	

var controller = {

	register: function(req, res){

		// Recibir datos
		var params = req.body;

		// Validar datos		
		try{
			var validateName=!validator.isEmpty(params.name);
			var validateEmail=!validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validatePassword=!validator.isEmpty(params.password);
		}catch(err){
			return res.status(400).send({
			message: 'Datos incorrectos.'				
			});
		}

		if(validateName && validateEmail && validatePassword){

			var user=new User();

			user.name=params.name;
			user.email=params.email;
			user.role='student';
			user.image=null;
			user.confirmation_code=crypto.randomBytes(64).toString('hex');
		
			
			User.findOne({email:user.email}, (err, issetUser) => {
						
				if(err) {
					return res.status(500).send({
						message: 'Error al comprobar la duplicidad de usuario.'
					});	
				}

				if(!issetUser){

					bcrypt.hash(params.password, null, null, (err, hash)=>{

						
						user.password=hash;
					// Enviar mail de confirmación


					// Crear transporter
						var transporter = nodemailer.createTransport({
							service: "gmail",
							auth: {
								user:'juanpablopruebasweb@gmail.com',
								pass: 'pruebasWebpulus'
							}
						});

						// Crear mensaje

						var customUrl = 'http://'+req.headers.host+'/api/verify/'+user.confirmation_code;
						console.log(customUrl);

						// Configuración email
						var mailOptions = {
							from: 'Juan Pablo Pruebas <juanpablopruebasweb@gmail.com>',
							to: user.email,
							subject: 'Por favor confirme su correo',
							html:`<a href="${customUrl}">Click to verify your email</a>`
						}


						// Enviar el correo

						transporter.sendMail(mailOptions, function(error, info){
							  if (error) {
							    console.log(error);
							  } else {
							    console.log('Email enviado: ' + info.response);
							  }
						});



						user.save((err, userStored)=>{
							if(err) {
								return res.status(500).send({
									message: 'Error al guardar el usuario.'
								});	
							}
									
							if(!userStored) {
								return res.status(500).send({
									message: 'El usuario no se ha guardado.'
								});	
							}


							return res.status(200).send({
								status: 'success',
								user: userStored});	


						});	// close save

					});	// close bcrypt

				}else{
					return res.status(200).send({
						message: 'Error: ya existe un usuario con ese email.'
					});	
				}

			});// close !issetUser

		}else{
			return res.status(200).send({
				message: 'Validación incorrecta'
			});	
		}// close findOne
	},


   	login: function(req, res){
   		// Recibir datos
		var params = req.body;

		// Validar datos
		
		try{
			var validateEmail=!validator.isEmpty(params.email) && validator.isEmail(params.email);
			var validatePassword=!validator.isEmpty(params.password);
		}catch(err){
			return res.status(400).send({
				message: 'No hay datos enviados.'				
			});
		}

		if(!validateEmail || !validatePassword){
			return res.status(200).send({
				message: 'Los datos no son correctos.'
				});	
		}

		User.findOne({email:params.email}, (err, user) => {

			if(err){
				return res.status(500).send({
					message: 'Error en el login.'
				});
			}
					
			if(!user){
				return res.status(404).send({
					message: 'Usuario no encontrado',
					
				});
			}

			bcrypt.compare(params.password, user.password, (err, check)=>{

				if (check){

					if(user.confirmed == false){
						return res.status(401).send({
							status:'error',
							message: 'Debe confirmar su correo.',					
						});

					}else{
						// Quitar campos
						user.password=undefined;
													
								return res.status(200).send({
									message: 'success',
									user: user,
									token: jwt.createToken(user)
								});
							}

				}else{
					return res.status(200).send({
						message: 'Las credenciales no son correctas.',					
					});
				}

			})// cierre callback bcrypt
				
		}); // cierre callback findOne

   	},//cierre login


   	update: function(req, res){
		// Recibir datos
		var params = req.body;

		// Validar datos

		try{
			var validateName=!validator.isEmpty(params.name);
			var validateEmail=!validator.isEmpty(params.email) && validator.isEmail(params.email);
		}catch(err){
			return res.status(400).send({
				message: 'No hay datos enviados.'				
			});
		}
		// Eliminar propiedades innecesarias

		delete params.password;
		delete params.role;
		delete params._id;

		var userId = req.user.sub;

		// Comprobar email único

		if(req.user.email != params.email ){

			User.findOne({email:params.email}, (err, user) => {

			if(err){
				return res.status(500).send({
					message: 'Error en la actualización.'
				});
			}
					
			if(user && user.email == params.email){
				return res.status(200).send({
					message: 'Email duplicado.',
					
				});
			}else{
				User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdated)=>{

					if(err){
						return res.status(500).send({
							message: 'Error al actualizar el usuario',							
						});
					}

					if(!userUpdated){
						return res.status(400).send({
							message: 'Error: no se ha actuaizado el usuario.',							
						});
					}

					userUpdated.password=undefined;

					return res.status(200).send({
						message: 'success',
						user: userUpdated			
					});

				}); // close findOneAndUpdate				
			}

		});	

	}else{

			User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdated)=>{

				if(err){
					return res.status(500).send({
						message: 'Error al actualizar el usuario',							
					});
				}

				if(!userUpdated){
					return res.status(400).send({
						message: 'Error: no se ha actuaizado el usuario.',							
					});
				}

				userUpdated.password=undefined;

				return res.status(200).send({
					message: 'success',
					userUpdated			
				});

			}); // close findOneAndUpdate
			
		} //close else


   	},// close update

	uploadAvatar: function(req, res){
		// Recoger fichero
			var fileName = 'Avatar no cargado';
			
			if(!req.files){				
				return res.status(404).send({
					status: 'error',
					message: fileName		
				});

			}else{
				var filePath = req.files.file0.path;
				var fileSplit = filePath.split('/');

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

				// Sacar el id del usuario identificado
				var userId = req.user.sub;

				// Buscar y Actalizar documento
				User.findOneAndUpdate({_id:userId}, {image: fileName}, {new: true}, (err, userUpdated)=> {
					if(err || !userUpdated){

						// Devolver respuesta
						return res.status(500).send({
							status: 'error',
							message: 'Error al guardar la imagen.'
						});
					}

					// Devolver respuesta
					userUpdated.password=undefined;

					return res.status(200).send({
						message: 'success',
						user: userUpdated			
					});

				});

			}// close else	

		} //close else

	},//close upload-avatar


	avatar: function(req, res){

		var fileName = req.params.fileName;
		var pathFile = './uploads/users/'+fileName;
		

		fs.exists(pathFile, (exists)=>{
			if(exists){
				return res.sendFile(path.resolve(pathFile));
			}else{
				return res.status(404).send({
						status:'error',
						message: 'Imagen no encontrada'
					});				
			}

		});

	},//close avatar


	getUsers: function(req, res){
		User.find().exec((err, users)=>{
			if(err || !users){
				return res.status(404).send({
					status: 'error',
					message: 'No hay usuarios que mostrar.'
				});
			}else{
				return res.status(200).send({
					status: 'success',
					users: users
				});
			}
		});

	},//close getUsers



	getUser: function(req, res){
		var userId = req.params.userId;
		User.findById(userId).exec((err, user)=>{
			if(err || !user){
					return res.status(404).send({
						status: 'error',
						message: 'Usuario no encontrado.'
					});
				}else{
					return res.status(200).send({
						status: 'success',
						user: user
					});
				}
			});

		},//close getUser


	confirm: function(req, res){
		var confirmation_code = req.params.confirmation_code;
		User.findOne({
			confirmation_code: confirmation_code
		})
		.exec((err, user)=>{
			if(err || !user){
					return res.status(404).send({
						status: 'error',
						message: 'Error en la confirmación del correo.'
					});
				}else{
					user.confirmed=true;
					user.confirmation_code=null;
					user.save();

					return res.status(200).send({
						status: 'success',
						message:'Correo confirmado correctamente'
					});
				}
			});

		},//close getUser

	




};//cierre controller	


module.exports = controller;

