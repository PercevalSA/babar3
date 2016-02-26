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

	var getMessage = function(status) {
		var message = '';
		switch(status) {
			case '400':
				message = 'Bad request.';
			break;
			case '404':
				message = 'Not found.';
			break;
			case '418':
				message = 'I\'m a keg.';
			break;
			case '200':
			case '201':
			case '401':
			case '403':
				message = 'Ouch! This error (' + status + ') should not lead here!';
			break;
			default:
				message = 'Ouch! This error (' + status + ') is unknown!';
			break;
		}
		return message;
	};

	this.status = $routeParams.status.toString();
	this.message = getMessage(this.status);
});
