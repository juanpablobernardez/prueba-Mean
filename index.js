'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://pulus:pulus@cluster0.gbofl.mongodb.net/bass?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => {
			console.log('Conexión a mongo OK');

			// Crear el servidor 
			app.listen(port, ()=>{
				console.log('3999 funcionando.')
				});


		})
		.catch(error=>console.log(error));


