'use strict'

var User = require ('../models/user');
var jwt = require('jwt-simple');
var secret = 'clave-secrteta-token-ffhh5566';


exports.isSuper = function(req, res, next){

	if(!req.headers.authorization){
		return res.status(403).send({
			message: 'Token no recibido.',					
			});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');
	var payload = jwt.decode(token, secret);

	//Encuentra el usuario y comprueba el rol

	var userId = payload.sub;
		User.findById(userId).exec((err, user)=>{
			if(err || !user){
					return res.status(404).send({
						status: 'error',
						message: 'Usuario no encontrado.'
					});
			}else{
					
				if(user.role=='super'){
				next();

				}else{
					return res.status(401).send({
						message: 'Acceso denegado.',					
					});
				}
			}
		});
}

exports.isTeacher = function(req, res, next){

	if(!req.headers.authorization){
		return res.status(403).send({
			message: 'Token no recibido.',					
			});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');
	var payload = jwt.decode(token, secret);

	//Encuentra el usuario y comprueba el rol

	var userId = payload.sub;
		User.findById(userId).exec((err, user)=>{
			if(err || !user){
					return res.status(404).send({
						status: 'error',
						message: 'Usuario no encontrado.'
					});
			}else{
					
				if(user.role=='teacher'){
				next();

				}else{
					return res.status(401).send({
						message: 'Acceso denegado.',					
					});
				}
			}
		});
}