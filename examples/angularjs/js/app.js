/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute'])

	// declare an Angular 2 component directive
	.ng2component('todoNewItem', window.TodoNewItem)
	
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'TodoCtrl',
			templateUrl: 'todomvc-index.html',
			resolve: {
				store: function (todoStorage) {
					// Get the correct module (API or localStorage).
					return todoStorage.then(function (module) {
						module.get(); // Fetch the todo records in the background.
						return module;
					});
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	});
