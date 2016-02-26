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
		API.getCustomer(pk).then(function(res) {
			$scope.main.customer = res.data;
		});
	};
	this.unsetCustomer = function() {
		this.customer = null;
		this.customerSearchText = '';
	};
	this.reloadCustomer = function() {
		this.setCustomer($scope.main.customer.pk);
	};

	API.getProduct().then(function(res) {
		$scope.main.products = res.data;
	});
	this.setProduct = function(pk) {
		API.getProduct(pk).then(function(res) {
			$scope.main.product = res.data;
		});
	};
	this.unsetProduct = function() {
		this.product = null;
		this.productSearchText = '';
	};
	this.reloadProduct = function() {
		this.setProduct($scope.main.product.pk);
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
			).then(function() {
				$scope.main.product = null;
				$scope.main.reloadCustomer();
			});
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
			).then(function() {
				$scope.main.paymentIsOpen = false;
				$scope.main.reloadCustomer();
			});
		}, function() {
		});
	};

});
