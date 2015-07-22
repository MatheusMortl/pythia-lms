'use strict';

// Sequences controller
angular.module('sequences').controller('SequencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'Sequences', function($scope, $stateParams, $location, Authentication, Courses, Sequences) {
	$scope.authentication = Authentication;

	// Create new sequence
	$scope.create = function() {
		// Create new sequence object
		var sequence = new Sequences ({
			name: this.name,
			course: this.course
		});

		// Redirect after save
		sequence.$save(function(response) {
			$location.path('sequences/' + response._id);

			// Clear form fields
			$scope.name = '';
			$scope.course = null;
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing sequence
	$scope.remove = function(sequence) {
		if ( sequence ) { 
			sequence.$remove();

			for (var i in $scope.sequences) {
				if ($scope.sequences [i] === sequence) {
					$scope.sequences.splice(i, 1);
				}
			}
		} else {
			$scope.sequence.$remove(function() {
				$location.path('sequences');
			});
		}
	};

	// Update existing sequence
	$scope.update = function() {
		var sequence = $scope.sequence;

		sequence.$update(function() {
			$location.path('sequences/' + sequence._id);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of sequences
	$scope.find = function() {
		$scope.sequences = Sequences.query();
	};

	// Find existing sequence
	$scope.findOne = function() {
		$scope.sequence = Sequences.get({ 
			sequenceId: $stateParams.sequenceId
		});
	};

	// Find existing course
	$scope.findCourse = function() {
		$scope.course = Courses.get({ 
			courseId: $stateParams.courseId
		});
	};
}]);
