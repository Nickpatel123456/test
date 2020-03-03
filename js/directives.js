angular.module('sledstudio')
    .directive('navBar', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'html/navbar/navbar.html',
            controller: "NavbarController"
        };
    });
