'use strict';

var SERVER = 'http://localhost:8000/';
var AUTH_HEADER = 'Authorization';


/**
 * @ngdoc service
 * @name BabarApp.Credentials
 * @description
 * # Credentials
 * Service in the BabarApp.
 */
angular.module('BabarApp')
.service('Credentials', function () {
	/*
	 * Either 'Basic' or 'Token'.
	 * Never use basic auth without https!
	 */
	var TYPE = 'Token';
	this.getType = function() {return TYPE;};

	var credentials = '';
	this.get = function() {
		var c = credentials;
		if(TYPE === 'Basic') {
			credentials = '';
		}
		return c;
	};
	this.set = function(val) {
		credentials = TYPE + ' ' + val;
	};
	this.encodeForBasic = function(username, password) {
		return btoa(username + ':' + password);
	};
});

/**
 * @ngdoc service
 * @name BabarApp.API
 * @description
 * # API
 * Service in the BabarApp.
 */
angular.module('BabarApp')
.service('API', function ($http, $q, $location, Credentials, auth) {
	// Store the last status for errors
	var error = { code: '', text: ''};
	this.getLatestError = function() { return error; };

	var call = function(config) {
		config.headers = config.headers || {};
		// Are there already some credentials?
		config.headers[AUTH_HEADER] = config.headers[AUTH_HEADER] || Credentials.get();

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
				/* Authentication is needed,
				 * use the auth module to do it.
				 * If success, remake the call and
				 * propagate the result (successful
				 * or not).
				 * If failure (ie cancellation),
				 * just give up.
				 */
				case 401:
				case 403:
				return auth.prompt(res.statusText)
				.then(function() { return call(config); });
				/* Request is bad
				 * Let's just propagate that to the view that made the call.
				 */
				case 400: return $q.reject(res);
				/* This should not happen
				 * Go to the error view
				 */
				default: $location.url('error');
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
			'data': data || {}
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
		return post(path, data);
	};

	this.login = function(username, password) {
		/* Login is special: whatever the current
		 * Credential type, it always uses Basic.
		 */
		var config = {
			'url': SERVER + 'api/auth/login/',
			'method': 'POST',
			'headers': {},
			'data': {}
		};
		config.headers[AUTH_HEADER] = 'Basic ' + Credentials.encodeForBasic(username, password);
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
