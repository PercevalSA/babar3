'use strict';

describe('Directive: linkButton', function () {

  // load the directive's module
  beforeEach(module('BabarApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<link-button></link-button>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the link directive');
  }));
});
