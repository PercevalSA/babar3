'use strict';

/**
 * @ngdoc directive
 * @name BabarApp.directive:easterEgg
 * @description
 * # easterEgg
 */
angular.module('BabarApp')
.directive('easterEgg', function () {
	return {
		restrict: 'E',
		templateUrl: 'views/easteregg.html',
	};
});
