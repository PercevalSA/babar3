'use strict';

var SERVER = 'http://127.0.0.1:8000/api/';

/**
 * @ngdoc service
 * @name BabarApp.API
 * @description
 * # API
 * Service in the BabarApp.
 */
angular.module('BabarApp')
.service('API', function ($http, $location) {
	var call = function(config) {
		return $http(config)
		.then(function(res) {
			// 200, we're good
			return res;
		}, function(res) {
			// not good
			console.error(res);
			switch(res.status) {
				case 401:
					console.log('not auth');
				//request an auth in dialog
				break;
				default:
					$location.url('error?status=' + res.status.toString());
				break;
			}
		});
	};
	var get = function(path) {
		var config = {
			'url': SERVER + path,
			'method': 'GET'
		};
		return call(config);
	};
	var post = function(path, data) {
		var config = {
			'url': SERVER + path,
			'method': 'POST',
			'data': data
		};
		return call(config);
	};

	this.getCustomer = function(id) {
		var path = 'customer/';
		if(id) {
			path += id.toString();
		}
		return get(path);
	};

	this.getProduct = function(id) {
		var path = 'product/';
		if(id) {
			path += id.toString();
		}
		return get(path);
	};

	this.postPayment = function(customerId, amount) {
		var path = 'transaction/';
		var data = {
			'customer': customerId,
			'money': amount
		};
		return post(path, data);
	};

	this.postPurchase = function(customerId, productId, amount) {
		var path = 'purchase/';
		var data = {
			'customer': customerId,
			'product': productId,
			'money': amount
		};
		return post(path, data);
	};
});
