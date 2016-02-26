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

	// Store the last status for errors
	var error = { code: '', text: ''};
	this.getLatestError = function() { return error; };

	var call = function(config) {
		if(!config.headers) {
			config.headers = {};
		}
		if(token !== '') {
			config.headers.Authorization = 'Token ' + token;
		}

		return $http(config)
		/* Set the latest error and/or propagate */
		.then(function(res) {
			return res;
		}, function(res) {
			error.code = res.status.toString();
			error.text = res.statusText;
			throw res;
		})
		/* React to the server's response */
		.then(function(res) {
			// OK
			return res;
		}, function(res) {
			// not OK
			switch(res.status) {
				/* Authentication is needed
				 * Use the auth module to do it
				 * In case of success, make the request again
				 * If not, just give it up
				 */
				case 401:
				case 403:
					return auth.prompt(res.statusText).then(function() { return call(config); });
				/* Request is bad
				 * Let's just propagate that to the view that made the call.
				 */
				case 400: throw res;
				/* This should not happen
				 * Go to the error view
				 */
				default: return $location.url('error');
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
			'amount': amount
		};
		return post(path, data);
	};

	this.postPurchase = function(customerPK, productPK) {
		var path = 'api/purchase/';
		var data = {
			'customer': customerPK,
			'product': productPK,
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
