'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave-secrteta-token-ffhh5566';
var User = require ('../models/user');

exports.authenticated = function(req, res, next){

	if(!req.headers.authorization){
		return res.status(403).send({
			message: 'Token no recibido.',					
			});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{

		var payload = jwt.decode(token, secret);

	}catch(ex){
	return res.status(404).send({
		message: 'El token no es válido.',					
		});
	}

		// Comprobar si existe el usuario
		var userId = payload.sub;


		User.findById(userId).exec((err, user)=>{
			
			if(err || !user){
					return res.status(404).send({
						status: 'error',
						message: 'Login incorrecto. No existe el usuario.'
					});
			}else{

				if(payload.exp <= moment.unix() ){
					return res.status(404).send({
						message: 'El token ha expirado.',					
					});
				}

				req.user = payload;
				next();
			}
			
		});


	
}