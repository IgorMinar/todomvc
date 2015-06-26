(function(angular, ng, window) {	
  "use strict";

  // Monkey patch module to include the new component helper
  var _module = angular.module;
  angular.module = function module(name, requires, configFn) {
    var moduleInstance = _module(name, requires, configFn);

    // We will be able to compute the `name` of the directive from the `selector`
    // once we are able to get hold of the directiveResolver out here 
    moduleInstance.ng2component = function ng2component(name, ComponentClass) {

      // Create an Angular 1 "adaptor/wrapper" directive that instantiates and wires up
      // the Angular 2 component  
      return moduleInstance.directive(name, function() {
        return {
          // We are going to restrict component directives to element selectors
          restrict: 'E',
          // We create a new scope in case the Angular 2 component uses Angular 1
          // directives internally
          scope: true,
          // We terminate the compiler to prevent the HTML inside this element from
          // being compiled inadvertently by Angular 1
          terminal: true,
          link: function(scope, element, attrs) {
            // Right now we must bootstrap a new app in the link function
            // Once the bootstrap gets refactored we will be able to create
            // the ProtoView up front before the directive is needed,
            // then just instantiate a ProtoViewInstance as needed in this
            // link function.
            ng.bootstrap(ComponentClass).then(function(appRef) {
              // Once we are able to get hold of a top level injector we will be able
              // to get hold of the directiveResolver outside of this directive
              // method.
              var injector = appRef.injector;
              var directiveResolver = injector.get(ng.DirectiveResolver);

              // Once we have multi-phase Angular 2 bootstrap, we will be simply
              // instantiating a ComponentClass ProtoView here
              var component = appRef.hostComponent;
              
              // Get hold of the meta data for this component from its Directive (Component) annotation
              var annotations = directiveResolver.resolve(ComponentClass);          

              // wire up events
              var events = annotations.events;
              events.forEach(function(eventString) {
                var eventInfo = getInfo(eventString);
                var eventEmitter = component[eventInfo.name];      
                eventEmitter.observer({next: function(value) {
                  scope.$apply(function() {
                    scope.$eval(attrs['(' + eventInfo.attribute + ')'], {$event: value});
                  });
                }});
                
              });
              
              // wire up properties
              var properties = annotations.properties;
              properties.forEach(function(propertyString) {
                var propertyInfo = getInfo(propertyString);
                scope.$watch(attrs['[' + propertyInfo.attribute + ']'], function(newVal) {
                  component[propertyInfo.name] = newVal;
                });
              });
              
              // wire up digest <-> change detection
              scope.$watch(function() {
                component.cd._cd.detectChanges(false);
              });
            });
          }          
        };
      });
    };

    return moduleInstance;
  };
  
  
  // A little helper function to extract the parts from events and properties annotations
  function getInfo(infoString) {
    var parts = infoString.split(':');
    var name = parts[0].trim();
    var attribute = parts[1] ? parts[1].trim() : name;
    return {
      name: name,
      attribute: attribute      
    };
  }
      
})(window.angular, window.ng, window);