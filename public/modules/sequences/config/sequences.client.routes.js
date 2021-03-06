'use strict';

//Setting up route
angular.module('sequences').config(['$stateProvider', function($stateProvider) {
	// Sequences state routing
	$stateProvider.
	state('createSequence', {
		url: '/courses/:courseSerial/sequences/create',
		templateUrl: 'modules/sequences/views/create-sequence.client.view.html'
	})
	.state('viewSequence', {
		url: '/courses/:courseSerial/sequences/:sequenceIndex',
		templateUrl: 'modules/sequences/views/view-sequence.client.view.html'
	})
	.state('editSequence', {
		url: '/courses/:courseSerial/sequences/:sequenceIndex/edit',
		templateUrl: 'modules/sequences/views/edit-sequence.client.view.html'
	})
	.state('sequenceStats', {
		url: '/courses/:courseSerial/sequences/:sequenceIndex/stats',
		templateUrl: 'modules/sequences/views/sequence-stats.client.view.html'
	});
}]);
