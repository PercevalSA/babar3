'use strict';

/**
 * @ngdoc function
 * @name BabarApp.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the BabarApp
 */
angular.module('BabarApp')
.controller('ErrorCtrl', function ($routeParams) {
	var getStatus = function() {
		if($routeParams.status) {
			return $routeParams.status;
		}
		else {
			return '0';
		}
	};

	var getMessage = function() {
		switch(getStatus()) {
			case '200':
				return 'Everything is allright.';
			case '400':
				return 'This is a bad request.';
			case '401':
				return 'This operation requires an authentication.';
			case '403':
				return 'Those are incorrect credentials (login/password).';
			case '404':
				return 'This content could not be found on server.';
			case '405':
				return 'Ouch! The client encountered an unexpected error.';
			case '409':
				return 'This content already exists on server.';
			case '418':
				return 'The server\'s saying she is a keg.';
			case '420':
				return 'The app did not meet the user\'s expectations.';
			case '498':
				return 'This session has expired, please log in.';
			default:
				return 'Ouch! The application encountered an unexpected error.';
		}
	};

	var isContactNeeded = function() {
		switch(getStatus().toString()) {
			case '200':
				return false;
			case '400':
				return true;
			case '401':
				return false;
			case '403':
				return false;
			case '404':
				return false;
			case '405':
				return true;
			case '409':
				return false;
			case '418':
				return false;
			case '420':
				return true;
			case '498':
				return false;
			default:
				return true;
		}
	};

	this.status = getStatus();
	this.message = getMessage();
	this.needToContact = isContactNeeded();
});
