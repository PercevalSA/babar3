'use strict';

/**
 * @ngdoc directive
 * @name BabarApp.directive:tweet
 * @description
 * # tweet
 */
angular.module('BabarApp')
.controller('TweetDialogCtrl', function($scope, $mdDialog) {
	this.hours = 0;
	this.minutes = 30;
	this.message = '';

	this.renderPreMessage = function() {
		/* This is duplicate of server code
		 * Kinda ugly to do, but better than
		 * asking the server all the time to
		 * render the preview itself...
		 */
		var preMessage = 'Le bar sera ouvert pendant ';
		if(this.hours > 0) {
			preMessage += this.hours.toString() + 'h';
		}
		if(this.minutes > 0) {
			preMessage += this.minutes.toString() + 'm';
		}
		preMessage += ' ! ';
		return preMessage;
	};

	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		$mdDialog.hide({
			time: $scope.tweetdialog.hours*60 + $scope.tweetdialog.minutes,
			message: $scope.tweetdialog.message
		});
	};
})
.controller('TweetCtrl', function($rootScope, $scope, $mdDialog, $mdToast, API) {
	this.tweet = function() {
		$mdDialog.show({
			templateUrl: 'views/tweet_dialog.html',
			controller: 'TweetDialogCtrl',
			controllerAs: 'tweetdialog',
			openFrom: 'tweet-icon',
			closeTo: 'tweet-icon',
			scope: $scope,
			preserveScope: true,
			clickOutsideToClose: true,
			escapeToClose: true,
		})
		.then(function(data) {
			API.tweet(data.time, data.message)
			.then(function() {
				//OK
				$mdToast.showSimple('Tweeted');
			}, function(res) {
				if(res !== undefined) {
					// Custom error report is needed here
					// Note: the disables are needed for grunt
					// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
					if(res.data.non_field_errors[0].toLowerCase().indexOf('wait') !== 1) {
						// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
						$mdToast.showSimple('Error: ' + res.data.non_field_errors[0]);
					}
					else {
						// Error, shouldn't happen though
						$mdToast.showSimple('Error: ' + res.status.toString() + ', ' + res.statusText);
					}
				}
			});
		}, function() {
			// User cancelled
			$mdToast.showSimple('Cancelled');
		});
	};
})
.directive('tweet', function () {
	return {
		controller: 'TweetCtrl',
		controllerAs: 'tweet',
		templateUrl: 'views/tweet.html',
		restrict: 'E'
	};
});
