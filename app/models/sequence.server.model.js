'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sequence Schema
 */
var SequenceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please select a name for the sequence.',
		trim: true
	},
	course: {
		type: Schema.ObjectId,
		ref: 'Course',
		required: 'Please select a course for this sequence'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Sequence', SequenceSchema);
