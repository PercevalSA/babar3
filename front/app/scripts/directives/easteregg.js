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
		template: `
		<unicorn
		ng-show="
		['dryvenn', 'iansus', 'percy']
		.indexOf(main.customer.nickname.toLowerCase()) >= 0
		">
		</unicorn>
		`,
	};
});
