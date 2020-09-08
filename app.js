'use strict'

// Requires

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// Ejecutar express

var app = express();


// Cargar archivos de rutas

var user_routes =require('./routes/user');
var lesson_routes =require('./routes/lesson');
var course_routes =require('./routes/course');
var cover_routes =require('./routes/cover');
var comment_lesson_routes = require('./routes/comment-lesson');


// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Reesribir rutas

app.use(express.static( 'client', {redirect: false}));
app.use('/api', user_routes);
app.use('/api', lesson_routes);
app.use('/api', course_routes);
app.use('/api', cover_routes);
app.use('/api', comment_lesson_routes);

app.get('*', function(req, res, next){
	res.sendfile(path.resolve('client/index.html'));
});


// Exportar módulo

module.exports=app;
