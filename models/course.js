'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');


// Modelo de course
var CourseSchema=Schema({
	title: String,
	description: String,
	image: String,
	tag: String,
	date:{type: Date, default: Date.now},
	user:{type: Schema.ObjectId, ref: 'User'},
	lessons:{type: Schema.ObjectId, ref: 'Lesson'}
});

// cargar paginación
CourseSchema.plugin(mongoosePaginate);


module.exports=mongoose.model('Course', CourseSchema);
							