'use strict';

/**
 * @ngdoc function
 * @name BabarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the BabarApp
 */
angular.module('BabarApp')
.controller('MainCtrl', function ($scope, $mdDialog, API) {
	this.actionIsOpen = false;
	this.paymentIsOpen = false;

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
				$scope.main.product = res.data;
			});
		}
		else {
			$scope.main.product = null;
		}
	};

	this.makePurchase = function() {
		var confirm = $mdDialog.confirm({
			title: 'Make the purchase?',
			textContent: $scope.main.customer.nickname + ': ' + $scope.main.product.name,
			ok: 'Yes',
			cancel: 'No',
		});
		$mdDialog.show(confirm).then(function() {
			API.postPurchase(
				$scope.main.customer.pk,
				$scope.main.product.pk,
				$scope.main.product.price
			);
			$scope.main.product = null;
		}, function() {
		});
	};

	this.makePayment = function() {
		var confirm = $mdDialog.confirm({
			title: 'Make the payment?',
			textContent: $scope.main.customer.nickname + ': ' + $scope.main.paymentMoney + ' €',
			ok: 'Yes',
			cancel: 'No',
		});
		$mdDialog.show(confirm).then(function() {
			API.postPayment(
				$scope.main.customer.pk,
				$scope.main.paymentMoney
			);
			$scope.main.paymentIsOpen = false;
		}, function() {
		});
	};

});
