'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return (this.provider !== 'local' && ! this.updated) || property.length;
};

/**
 * A validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return this.provider !== 'local' || (password && password.length > 6);
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstname: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your firstname.']
	},
	lastname: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your lastname.']
	},
	displayname: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email.'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address.']
	},
	username: {
		type: String,
		unique: 'A user with the same username already exists.',
		required: 'Please fill in a username.',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer.']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required.'
	},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'teacher', 'admin']
		}],
		default: ['user']
	},
	registrations: {
		type: [new Schema({
			course: {
				type: Schema.ObjectId,
				ref: 'Course'
			},
			registered: {
				type: Date,
				default: Date.now
			},
			sequences: {
				type: [new Schema({
					lessons: {
						type: [new Schema({
							problems: {
								type: [new Schema({
									submitted: {
										type: Date,
										default: Date.now
									},
									feedback: {
										type: {},
										default: {}
									}
								})],
								default: []
							}
						})],
						default: []
					}
				})],
				default: []
			}
		})],
		default: []
	},
	picture: {
		type: Boolean,
		default: false
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	}
	return password;
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);
