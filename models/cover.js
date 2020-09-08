'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

// Modelo de comment
var CommentCoverSchema=Schema({
	content: String,
	date:{type: Date, default: Date.now},
	user:{type: Schema.ObjectId, ref: 'User'}
});

var comment=mongoose.model('CommentCover', CommentCoverSchema);

// Modelo de cover
var CoverSchema=Schema({
	title: String,
	description: String,
	image: String,
	tag: String,
	video: String,
	audio: String,
	pdf: String,
	date:{type: Date, default: Date.now},
	user:{type: Schema.ObjectId, ref: 'User'},
	comments: [CommentCoverSchema]
});

// cargar paginación
CoverSchema.plugin(mongoosePaginate);


module.exports=mongoose.model('Cover', CoverSchema);
							