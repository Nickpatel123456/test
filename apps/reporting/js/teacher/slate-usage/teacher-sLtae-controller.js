angular.module('sledstudio')
.controller('TeacherSlateUsageReportController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices) {
	
	$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
	$scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;
	
	$scope.goBack = function(){
		goBackServices.goBackPage($window);
	}
})
.directive('teacherslate1Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate1.html',
		controller:"TeacherSlate1ReportController"
  };
})
.directive('teacherslate2Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate2.html',
		controller:"TeacherSlate2ReportController"
  };
})
.directive('teacherslate3Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate3.html',
		controller:"TeacherSlate3ReportController"
  };
})
.directive('teacherslate4Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate4.html',
		controller:"TeacherSlate4ReportController"
  };
})
.directive('teacherslate5Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate5.html',
		controller:"TeacherSlate5ReportController"
  };
})
.directive('teacherslate6Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate6.html',
		controller:"TeacherSlate6ReportController"
  };
})
.directive('teacherslate7Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate7.html',
		controller:"TeacherSlate7ReportController"
  };
})
.directive('teacherslate8Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate8.html',
		controller:"TeacherSlate8ReportController"
  };
});
