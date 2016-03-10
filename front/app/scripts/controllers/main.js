'use strict';

/**
 * @ngdoc function
 * @name BabarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the BabarApp
 */
angular.module('BabarApp')
.controller('MainCtrl', function ($scope, $mdDialog, $mdToast, API) {
	API.getCustomer().then(function(res) {
		$scope.main.customers = res.data;
	});
	this.unsetCustomer = function() {
		this.customerSearchText = '';
		this.customer = undefined;
	};
	this.setCustomer = function(pk) {
		if(pk) {
			API.getCustomer(pk).then(function(res) {
				$scope.main.customer = res.data;
			});
		}
		else {
			this.unsetCustomer();
		}
	};
	this.reloadCustomer = function() {
		this.setCustomer($scope.main.customer.pk);
	};

	API.getProduct().then(function(res) {
		$scope.main.products = res.data;
	});
	this.unsetProduct = function() {
		this.productSearchText = '';
		this.product = undefined;
	};
	this.setProduct = function(pk) {
		if(pk) {
			API.getProduct(pk).then(function(res) {
				$scope.main.product = res.data;
			});
		}
		else {
			this.unsetProduct();
		}
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
				$scope.main.product.pk
			).then(function() {
				// OK
				$scope.main.unsetProduct();
				$scope.main.reloadCustomer();
				$mdToast.showSimple('Purchased');
			}, function(res) {
				if(res !== undefined) {
					// Error, shouldn't happen though
					$mdToast.showSimple('Error: ' + res.status.toString() + ', ' + res.statusText);
				}
			});
		}, function() {
			// User cancelled
			$mdToast.showSimple('Cancelled');
		});
	};

	this.paymentIsOpen = false;
	this.makePayment = function() {
		var confirm = $mdDialog.confirm({
			title: 'Make the payment?',
			textContent: $scope.main.customer.nickname + ': ' + $scope.main.paymentAmount + ' €',
			ok: 'Yes',
			cancel: 'No',
		});
		$mdDialog.show(confirm).then(function() {
			API.postPayment(
				$scope.main.customer.pk,
				$scope.main.paymentAmount
			).then(function() {
				// OK
				$scope.main.paymentIsOpen = false;
				$scope.main.reloadCustomer();
				$mdToast.showSimple('Payed');
			}, function(res) {
				if(res !== undefined) {
					// Error, shouldn't happen though
					$mdToast.showSimple('Error: ' + res.status.toString() + ', ' + res.statusText);
				}
			});
		}, function() {
			// User cancelled
			$mdToast.showSimple('Cancelled');
		});
	};
});
