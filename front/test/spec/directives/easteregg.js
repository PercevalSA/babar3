'use strict';

describe('Directive: easterEgg', function () {

  // load the directive's module
  beforeEach(module('BabarApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<easter-egg></easter-egg>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the easterEgg directive');
  }));
});
