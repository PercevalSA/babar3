'use strict';

/**
 * @ngdoc service
 * @name BabarApp.auth
 * @description
 * # auth
 * Service in the BabarApp.
 */
angular.module('BabarApp')
.controller('AuthCtrl', function ($location, $scope, $mdDialog, API, why) {
	this.why = why;

	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		/* Try an authentication
		 * If it fails, demand another password or a cancellation
		 * It it succeeds, resolve the dialog;
		 * this will retrigger the previous request.
		 */
		API.login(this.username, this.password)
		.then(function(res)  {
			// Auth successful, store the token and exit
			API.setToken(res.data.key);
			$mdDialog.hide();
		}, function(res) {
			// Auth unsuccessful, tell the user
			if(res.status === 400) {
				$scope.authForm.password.$error.wrong = true;
			}
			else {
				$location.url('error');
			}
		});
	};
})
.service('auth', function ($mdDialog, $mdToast) {
	this.prompt = function(why) {
		return $mdDialog.show({
			templateUrl: '../views/auth.html',
			openFrom: '#left',
			closeTo: '#right',
			clickOutsideToClose: true,
			escapeToClose: true,
			controller: 'AuthCtrl',
			controllerAs: 'auth',
			locals: {why: why},
		}).then(function() {
			// OK
			// Don't say nothing, OP will talk
		}, function() {
			// Cancelled
			$mdToast.showSimple('Cancelled');
		});
	};
});
