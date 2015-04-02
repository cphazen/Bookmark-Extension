'use strict';

var app = angular.module('bookmarks', ['ngRoute', 'ngMaterial','ui.select']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {
		    templateUrl: 'views/search.html',
            controller: 'SearchController'
		}).
		when('/add', {
		    templateUrl: 'views/add.html',
            controller: 'AddController'
		}).
		when('/edit', {
		    templateUrl: 'views/edit.html',
            controller: 'SettingsController'
		}).
		when('/folder', {
		    templateUrl: 'views/folder.html',
		    controller: 'FolderController'
		}).
		when('/settings', {
		    templateUrl: 'views/settings.html',
		    controller: 'FolderController'
		})
		.otherwise({
			redirectTo: '/'
		})
}]);