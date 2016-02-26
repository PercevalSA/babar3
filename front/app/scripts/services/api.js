'use strict';

var SERVER = 'http://127.0.0.1:8000/';

/**
 * @ngdoc service
 * @name BabarApp.API
 * @description
 * # API
 * Service in the BabarApp.
 */
angular.module('BabarApp')
.service('API', function ($http, $location, auth) {
	// Store the token in memory
	var token = '';
	this.setToken = function(val) {
		token = val;
	};

	var handleAuth = function(config, why) {
		/* Ask user to authenticate
		 * If success, start again
		 * If not, just give it up
		 */
		return auth
		.prompt(why)
		.then(function() { return call(config); });
	};
	var handleError = function(status) {
		return $location.url('error?status=' + status);
	};
	var call = function(config) {
		if(!config.headers) {
			config.headers = {};
		}
		if(token !== '') {
			config.headers.Authorization = 'Token ' + token;
		}

		return $http(config)
		.then(function(res) {
			console.log(res);
			// 200, good
			return res;
		}, function(res) {
			console.error(res);
			// not 200, not good
			switch(res.status) {
				case 401: return handleAuth(config, 'Unauthorized'); // invoke auth
				case 403: return handleAuth(config, 'Forbidden'); // invoke auth
				case 400: throw res; // propagate that to auth
				default: return handleError(res.status);
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

	this.getCustomer = function(pk) {
		var path = 'api/customer/';
		if(pk) {
			path += pk.toString() + '/';
		}
		return get(path);
	};

	this.getProduct = function(pk) {
		var path = 'api/product/';
		if(pk) {
			path += pk.toString() + '/';
		}
		return get(path);
	};

	this.postPayment = function(customerPK, amount) {
		var path = 'api/payment/';
		var data = {
			'customer': customerPK,
			'money': amount
		};
		return post(path, data);
	};

	this.postPurchase = function(customerPK, productPK, amount) {
		var path = 'api/purchase/';
		var data = {
			'customer': customerPK,
			'product': productPK,
			'money': amount
		};
		return post(path, data);
	};

	this.login = function(username, password) {
		var path = 'auth/login/';
		var data = {
			'username': username,
			'password': password
		};
		return post(path, data);
	};
});
