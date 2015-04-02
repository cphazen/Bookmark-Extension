'use strict';

app.directive('bookmarkitem', function () {
    return {
        restrict: 'E',
        scope: {
            item:"="
        },
        templateUrl: 'list-template.html'
    }
});

app.directive('colorpicker', function () {
    return {
        restrict: 'E',
        scope: {
            colorlist: "=",
            selected: "="
        },
        templateUrl: 'color-template.html'
    }
});
