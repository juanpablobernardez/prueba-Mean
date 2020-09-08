'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema=Schema({
	name: String,
	email: String,
	password: String,
	image: String,
	role: String,
	access: {type: Schema.ObjectId, ref: 'Course', default: null},
	confirmed: {type: Boolean, default: false},
	confirmation_code: String
});

UserSchema.methods.toJSON = function(){
	var obj = this.toObject();
	delete obj.password;
	delete obj.confirmed;
	delete obj.confirmation_code;

	return obj;
}

module.exports=mongoose.model('User', UserSchema);
							// lowercase y pluralizar el nombre 'users'