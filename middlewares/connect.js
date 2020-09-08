'use strict'


var mongoose = require('mongoose');

exports.connect = function(){
	// Conectar el modelo a una base de datos distinta
	mongoose.connect('mongodb://localhost:27017/bass2', {useNewUrlParser: true});
}