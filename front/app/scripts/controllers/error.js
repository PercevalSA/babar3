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
});
