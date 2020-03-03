angular.module('sledstudio')
.controller('TeacherReportUsageReportController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices) {
	
	$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
	$scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;
	
	$scope.goBack = function(){
		goBackServices.goBackPage($window);
	}
})
.directive('teacherreport1Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/report-usage/report1.html',
		controller:"TeacherReport1Controller"
  };
});
