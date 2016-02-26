'use strict';

/**
 * @ngdoc function
 * @name BabarApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the BabarApp
 */
angular.module('BabarApp')
.controller('AuthCtrl', function ($mdDialog, $scope, API, why) {
	this.why = why;

	this.cancel = $mdDialog.cancel;
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
				console.error('Shouldn\'t have this error here: ' + res.status);
			}
		});
	};
});
