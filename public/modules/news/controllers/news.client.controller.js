'use strict';

// News controller
angular.module('news').controller('NewsController', ['$scope', '$stateParams', '$location', 'Authentication', 'News', '$http', '$filter', function($scope, $stateParams, $location, Authentication, News, $http, $filter) {
	$scope.authentication = Authentication;
	$scope.courses = [];
	var coursesList = [];

	// Create new news
	$scope.create = function() {
		// Create new news object
		var coursesIDs = [];
		for (var i = 0; i < this.courses.length; i++) {
			coursesIDs.push(this.courses[i]._id);
		}
		var news = new News ({
			title: this.title,
			content: this.content,
			course: coursesIDs.length > 0 ? coursesIDs[0] : null,
		});
		// Redirect after save
		news.$save(function(response) {
			$location.path('news/' + response._id);

			// Clear form fields
			$scope.title = '';
			$scope.content = '';
			$scope.courses = [];
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing news
	$scope.remove = function(news) {
	};

	// Update existing news
	$scope.update = function() {
		// Create new news object
		var coursesIDs = [];
		for (var i = 0; i < this.courses.length; i++) {
			coursesIDs.push(this.courses[i]._id);
		}
		var news = $scope.news;
		news.course = coursesIDs.length > 0 ? coursesIDs[0] : null;
		news.$update({
			'newsId': news._id
		}, function() {
			$location.path('news/' + news._id);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of news
	$scope.find = function() {
		$scope.news = News.query();
	};

	// Find existing news
	$scope.findOne = function() {
		$scope.news = News.get({
			newsId: $stateParams.newsId
		}, function() {
			if ($scope.news.course !== null) {
				$scope.courses = [$scope.news.course];
			}
		});
	};

	// Load the list of courses, for autocompletion of course field
	$scope.initNewsForm = function() {
		$http.get('/courses?filter=all').success(function(data, status, headers, config) {
			coursesList = data;
		});
	};

	// Filter list of available courses
	$scope.loadCourses = function(query) {
		return $filter('filter')(coursesList, query);
	};

	// Test whether the current user has one of the specified roles
	$scope.hasRole = function(roles) {
		return $scope.authentication.user && roles.some(function(element, index, array) {
			return $scope.authentication.user.roles.indexOf(element) !== -1;
		});
	};

	// Test whether the current user is a coordinator of this course
	$scope.isCoordinator = function() {
		return $scope.authentication.user && $scope.course.coordinators.some(function(element, index, array) {
			return $scope.authentication.user._id === element._id;
		});
	};
}]);
