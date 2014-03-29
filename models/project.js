// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');
// define the schema for our user model
var projectSchema = mongoose.Schema({
    title: {type: String},
    description: {type: String},
    dateCreated: {type: Date, default: Date.now},
    startDate: {type: Date},
    numPositions: {type: Number},
    timeRequired: {type: String},
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    numViews: {type:Number, default: 0}
});

module.exports = mongoose.model('Project', projectSchema);