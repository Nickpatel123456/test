angular.module('sledstudio')
    .controller('SlateUsageReportController', function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices) {

        $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;

        $scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;

        $scope.goBack = function () {
            goBackServices.goBackPage($window);
        }
    })
    .directive('slate1Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate1.html',
            controller: "Slate1ReportController"
        };
    })
    .directive('slate2Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate2.html',
            controller: "Slate2ReportController"
        };
    })
    .directive('slate3Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate3.html',
            controller: "Slate3ReportController"
        };
    })
    .directive('slate4Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate4.html',
            controller: "Slate4ReportController"
        };
    })
    .directive('slate5Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate5.html',
            controller: "Slate5ReportController"
        };
    })
    .directive('slate6Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate6.html',
            controller: "Slate6ReportController"
        };
    })
    .directive('slate7Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate7.html',
            controller: "Slate7ReportController"
        };
    })
    .directive('slate8Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate8.html',
            controller: "Slate8ReportController"
        };
    })
    .directive('slate9Report', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/student/slate-usage/slate9.html',
            controller: "Slate9ReportController"
        };
    });