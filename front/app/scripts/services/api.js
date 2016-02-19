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
.service('API', function ($http) {

	var get = function(path) {
		return $http.get(SERVER + 'api/' + path);
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
});
