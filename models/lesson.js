'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

// Modelo de comment
var CommentLessonSchema=Schema({
	content: String,
	date:{type: Date, default: Date.now},
	user:{type: Schema.ObjectId, ref: 'User'}
});

var comment=mongoose.model('CommentLesson', CommentLessonSchema);

// Modelo de lesson
var LessonSchema=Schema({
	title: String,
	description: String,
	course: {type: Schema.ObjectId, ref: 'Course'},
	image: String,
	tag: String,
	pdf: String,
	audio: String,
	video: String,
	date:{type: Date, default: Date.now},
	user:{type: Schema.ObjectId, ref: 'User'},
	comments: [CommentLessonSchema]
});

// cargar paginación
LessonSchema.plugin(mongoosePaginate);


module.exports=mongoose.model('Lesson', LessonSchema);
							