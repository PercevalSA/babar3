'use strict';

var SERVER = 'http://localhost:8000/';
var AUTH_HEADER_NAME = 'Authorization';

/**
 * @ngdoc service
 * @name BabarApp.API
 * @description
 * # API
 * Service in the BabarApp.
 */
angular.module('BabarApp')
.service('API', function ($http, $q, $location, auth) {
	// Store the last status for errors
	var error = { code: '', text: ''};
	this.getLatestError = function() { return error; };

	var call = function(config) {
		return $http(config)
		/* Set the latest error and/or propagate */
		.then(function(res) {
			return $q.resolve(res);
		}, function(res) {
			error.code = res.status.toString();
			error.text = res.statusText;
			return $q.reject(res);
		})
		/* React to the server's response */
		.then(function(res) {
			// OK
			return $q.resolve(res);
		}, function(res) {
			// not OK
			switch(res.status) {
				/* Request is bad
				 * Propagate that to the view that made the call.
				 */
				case 400: return $q.reject(res);
				/* Request is unauthorized or forbidden
				 * Propagate that to the auth view,
				 * which should have made the call.
				 */
				case 403: return $q.reject(res);
				case 401: return $q.reject(res);
				/* This should not happen
				 * Go to the error view
				 */
				default:
					$location.url('error');
				return $q.reject(res);
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
			'data': data || {},
			'headers': {}
		};
		// POST methods need login
		return auth.getHeader().then(function(header) {
			config.headers[AUTH_HEADER_NAME] = header;
			// Tokens are valid only once.
			auth.clearHeader();
			return call(config);
		}, function() {
			return $q.reject();
		});
	};
	var postWithoutLogin = function(path, data) {
		var config = {
			'url': SERVER + path,
			'method': 'POST',
			'data': data || {},
			'headers': {}
		};
		return call(config);
	};

	this.getCustomer = function(pk) {
		var path = 'api/customer/';
		if(pk) {
			path += pk.toString() + '/';
		}
		else {
			path += '?info=basic';
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
		// This one is always authorized.
		return postWithoutLogin(path, data);
	};

	this.login = function(username, password) {
		/* Login is special: it uses Basic auth. */
		var config = {
			'url': SERVER + 'api/auth/login/',
			'method': 'POST',
			'headers': {
				'Authorization':'Basic ' + btoa(username + ':' + password)
			},
			'data': {}
		};
		return call(config);
	};

	this.logout = function() {
		var path = 'api/auth/logout/';
		return post(path);
	};

	this.logoutAll = function() {
		var path = 'api/auth/logoutall/';
		return post(path);
	};

	this.tweet = function(time, message) {
		var path = 'social/tweet/';
		var data = {
			'time': time,
			'message': message
		};
		return post(path, data);
	};
});
