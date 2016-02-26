'use strict';

/**
 * @ngdoc service
 * @name BabarApp.auth
 * @description
 * # auth
 * Service in the BabarApp.
 */
angular.module('BabarApp')
  .service('auth', function ($mdDialog) {
	  this.prompt = function(why) {
		  return $mdDialog.show({
			  templateUrl: '../views/auth.html',
			  openFrom: '#left',
			  closeTo: '#right',
			  clickOutsideToClose: true,
			  escapeToClose: true,
			  controller: 'AuthCtrl',
			  controllerAs: 'auth',
			  locals: {why: why},
		  });
	  };
  });
