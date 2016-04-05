'use strict';

var SERVER = 'http://localhost:8000/';

/**
 * @ngdoc service
 * @name BabarApp.Token
 * @description
 * # Token
 * Service in the BabarApp.
 */
angular.module('BabarApp')
.service('Token', function () {
	var token = '';
	this.get = function() {
		return token;
	};
	this.set = function(val) {
		token = 'Token ' + val;
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
.service('API', function ($http, $q, $location, Token, auth) {
	// Store the last status for errors
	var error = { code: '', text: ''};
	this.getLatestError = function() { return error; };

	var call = function(config) {
		/* Non-login POST methods need authentication */
		if(config.method === 'POST' && config.url.indexOf('login') < 0) {
			config.headers = {
				'Authorization': Token.get()
			};
		}
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
				/* If was a login, it means it
				 * failed, so transmit that.
				 *
				 * If it was something else,
				 * authentication is needed,
				 * use the auth module to do it.
				 * If success, remake the call and
				 * propagate the result (successful
				 * or not).
				 * If failure (ie cancellation),
				 * just give up.
				 */
				case 401:
				case 403:
				if(config.url.indexOf('login') >= 0) {
					return $q.reject(res);
				}
				else {
					return auth.prompt(res.statusText)
					.then(function() {
						return call(config);
					});
				}
				break;
				/* Request is bad
				 * Let's just propagate that to the view that made the call.
				 */
				case 400: return $q.reject(res);
				/* This should not happen
				 * Go to the error view
				 */
				default: $location.url('error'); return $q.reject(res);
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
			'headers': {
				'Authorization':'Basic ' + btoa(username + ':' + password)
			},
			'data': {}
		};
		return call(config)
		.then(function(res) {
			Token.set(res.data.token);
			return $q.resolve(res);
		}, function(res) {
			return $q.reject(res);
		});
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
