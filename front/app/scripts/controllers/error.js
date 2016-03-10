'use strict';

/**
 * @ngdoc function
 * @name BabarApp.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the BabarApp
 */
angular.module('BabarApp')
.controller('ErrorCtrl', function (API) {
	this.status = API.getLatestError();

	// Some particular errors need to be dealt with
	switch(this.status.code) {
		case '-1':
			this.status.text = 'Server unreachable';
		break;
	}
});
