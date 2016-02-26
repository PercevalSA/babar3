'use strict';

/**
 * @ngdoc overview
 * @name BabarApp
 * @description
 * # BabarApp
 *
 * Main module of the application.
 */
angular
.module('BabarApp', [
	'ngAnimate',
	'ngAria',
	'ngCookies',
	'ngMessages',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngMaterial'
])
.config(function ($routeProvider, $mdThemingProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl',
		controllerAs: 'main'
	})
	.when('/error', {
		templateUrl: 'views/error.html',
		controller: 'ErrorCtrl',
		controllerAs: 'error'
	})
	.otherwise({
		redirectTo: '/'
	});
	$mdThemingProvider.theme('default')
	// default:
	// .primaryPalette('indigo')
	// .accentPalette('pink')
	// .warnPalette('red')
	// .backgroundPalette('grey');
	.primaryPalette('teal')
	.accentPalette('light-blue')
	.warnPalette('pink')
	.backgroundPalette('grey');
});
