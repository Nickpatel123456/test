angular.module('sledstudio')
.controller('SlearnUsageReportController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices) {
	
	$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
	$scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;
	
	$scope.goBack = function(){
		goBackServices.goBackPage($window);
	}
})
.directive('slearn1Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn1.html',
		controller:"Slearn1ReportController"
  };
})
.directive('slearn2Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn2.html',
		controller:"Slearn2ReportController"
  };
})
.directive('slearn3Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn3.html',
		controller:"Slearn3ReportController"
  };
})
.directive('slearn4Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn4.html',
		controller:"Slearn4ReportController"
  };
})
.directive('slearn5Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn5.html',
		controller:"Slearn5ReportController"
  };
})
.directive('slearn6Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn6.html',
		controller:"Slearn6ReportController"
  };
})
.directive('slearn7Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn7.html',
		controller:"Slearn7ReportController"
  };
})
.directive('slearn8Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn8.html',
		controller:"Slearn8ReportController"
  };
})
.directive('slearn9Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn9.html',
		controller:"Slearn9ReportController"
  };
})
.directive('slearn10Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn10.html',
		controller:"Slearn10ReportController"
  };
});
