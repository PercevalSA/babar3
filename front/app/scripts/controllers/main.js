'use strict';

/**
 * @ngdoc function
 * @name BabarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the BabarApp
 */
angular.module('BabarApp')
.controller('MainCtrl', function ($scope, $mdDialog, $mdDialogPreset, API) {
	API.getCustomer().then(function(res) {
		$scope.main.customers = res.data;
	});
	this.setCustomer = function(pk) {
		if(pk) {
			API.getCustomer(pk).then(function(res) {
				$scope.main.customer = res.data;
			});
		}
		else {
			$scope.main.customer = null;
		}
	};

	API.getProduct().then(function(res) {
		$scope.main.products = res.data;
	});
	this.setProduct = function(pk) {
		if(pk) {
			API.getProduct(pk).then(function(res) {
				$scope.main.product = res.data[0];
			});
		}
		else {
			$scope.main.product = null;
		}
	};

	this.makePurchase = function() {
	};
});
