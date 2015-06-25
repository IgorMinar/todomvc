angular.module('todomvc').
    directive('todoNewItem', function() {

      return {
        restrict: 'E',
        scope: true,
        terminal: true,
        link: function($scope, $element, $attrs) {

          ng.bootstrap(window.TodoNewItem).then(function(applicanRef) {

            var component = applicanRef.hostComponent;

            //debugger;
            component.todoSubmitted.observer({next: function(value) {
              $scope.$eval($attrs['(todoSubmitted)'], {$event: value});
              $scope.$apply();
            }});


            $scope.$watch($attrs['[disabled]'], function(newVal) {
              console.log('disabled changed', newVal);
              component.inputDisabled = newVal;
            });

            $scope.$watch(function() {
              console.log('ng2digest');
              component.cd._cd.detectChanges(false);
            });

          });
        }
      }
    });