'use strict';

/**
 * @ngdoc directive
 * @name BabarApp.directive:link
 * @description
 * # link
 */
angular.module('BabarApp')
.directive('linkButton', function () {
	return {
		templateUrl: 'views/link-button.html',
		restrict: 'E',
		scope: {
			url: '@',
			icon: '@',
			label: '@'
		}
	};
});
