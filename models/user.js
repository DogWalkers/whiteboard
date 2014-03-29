// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');
var skillsList = ['CSS', 'Javascript'];

// define the schema for our user model
var userSchema = mongoose.Schema({
	facebook: {
    	id: String,
    	token: String,
    	email: String,
    	name: String
    },
   
	timeCreated : { type : Date, default: Date.now },
	skills: [{type: String, enum: skillsList}],
});

// methods ======================
// generating a hash
/*userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};*/

// checking if password is valid
/*userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};*/

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);