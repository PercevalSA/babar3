'use strict';

/**
 * @ngdoc function
 * @name BabarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the BabarApp
 */
angular.module('BabarApp')
.controller('MainCtrl', function ($scope, API) {
	this.customers = [];
	API.getCustomer().then(function(res) {
		$scope.main.customers = res.data;
	});
});
