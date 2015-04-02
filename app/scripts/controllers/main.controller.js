'use strict';

app.controller('MainController', ['$scope','$routeParams', '$location', '$window','bookmarks', 'color', 'activeBookmark', function($scope, $routeParams, $location, $window, bookmarks, color, activeBookmark) {

    $scope.bookmarks = bookmarks;
    $scope.bookmarks.get();

    $scope.current = activeBookmark;

    $scope.color = color;
    $scope.color.get();

}]);

app.controller('SearchController', ['$scope', '$routeParams', '$location', '$window', 'bookmarks', 'color', 'activeBookmark', function ($scope, $routeParams, $location, $window, bookmarks, color, activeBookmark) {

}]);

app.controller('AddController', ['$scope', '$routeParams', '$location', '$window', '$mdDialog', 'bookmarks', 'color', 'activeBookmark', function ($scope, $routeParams, $location, $window, $mdDialog, bookmarks, color, activeBookmark) {
    $scope.delete = function () {
        if ($window.confirm("Are you sure you want to delete this bookmark? This action cannot be undone.")) {
            $scope.bookmarks.remove($scope.current.item.id);
            $location.path("/");
        }
    };

    $scope.test = ['1', '2', 'testing', 'testful'];
    

}]);

app.controller('SettingsController', ['$scope', '$routeParams', '$location', '$window', 'bookmarks', 'color', 'activeBookmark', function ($scope, $routeParams, $location, $window, bookmarks, color, activeBookmark) {


}]);

app.controller('FolderController', ['$scope', '$routeParams', '$location', '$window', 'bookmarks', 'color', 'activeBookmark', function ($scope, $routeParams, $location, $window, bookmarks, color, activeBookmark) {


}]);

function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}