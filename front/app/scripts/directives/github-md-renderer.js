'use strict';

/**
 * @ngdoc directive
 * @name BabarApp.directive:githubMdRenderer
 * @description
 * # githubMdRenderer
 */
angular.module('BabarApp')
.controller('GithubMdRendererDialogCtrl', function($scope, $http, $mdDialog) {
	this.content = '';

	$scope.htmlUrl = 'https://github.com/' + $scope.stub + '/blob/' + $scope.branch + '/' + $scope.path;

	$scope.rawUrl = 'https://raw.githubusercontent.com/' + $scope.stub + '/' + $scope.branch + '/' + $scope.path;

	$http
	.get($scope.rawUrl)
	.then(function(res) {
		$scope.content = res.data;
	}, function(res) {
		$scope.content = '# Error ' + res.status.toString() + '\r\n';
		$scope.content += res.statusText;
	});

	this.close = $mdDialog.cancel;
})
.controller('GithubMdRendererCtrl', function($scope, $mdDialog) {
	this.open = function() {
		$mdDialog.show({
			templateUrl: 'views/github-md-renderer-dialog.html',
			controller: 'GithubMdRendererDialogCtrl',
			controllerAs: 'rendererdialog',
			scope: $scope,
			preserveScope: true,
			clickOutsideToClose: true,
			escapeToClose: true,
			fullscreen: true,
		});
	};
})
.directive('githubMdRenderer', function () {
	return {
		controller: 'GithubMdRendererCtrl',
		controllerAs: 'renderer',
		templateUrl: 'views/github-md-renderer.html',
		restrict : 'E',
		/* New isolated scope for this renderer and its dialog. */
		scope: {
			stub: '@',
			branch: '@',
			path: '@',
			icon: '@'
		}
	};
});
