'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Course = mongoose.model('Course');

/**
 * Globals
 */
var user, course;

/**
 * Unit tests
 */
describe('Course Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			course = new Course({
				title: 'Course title',
				coordinator: user,
				user: user
			});

			done();
		});
	});

	describe('Method save', function() {
		it('should be able to save without problems', function(done) {
			return course.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) { 
			course.title = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without coordinator', function(done) { 
			course.title = 'Course title';
			course.coordinator = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Course.remove().exec();
		User.remove().exec();

		done();
	});
});
