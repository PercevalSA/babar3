'use strict';

describe('Directive: githubMdRenderer', function () {

  // load the directive's module
  beforeEach(module('BabarApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<github-md-renderer></github-md-renderer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the githubMdRenderer directive');
  }));
});
