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
		controllerAs: 'easter',
		controller: function() {
			this.display = function(customer) {
				return customer.nickname.match(/dryvenn|iansus|percy/i) !== null;
			};
		}
	};
});
