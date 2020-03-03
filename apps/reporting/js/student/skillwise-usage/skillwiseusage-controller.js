angular.module('sledstudio')
.controller('SkillWiseUsageReportController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices) {
	
	$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
	
	$scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;

	$scope.goBack = function(){
		goBackServices.goBackPage($window);
	}
})
.directive('skill1Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/skillwise-usage/skill1-report.html',
		controller:"Skill1ReportController"
  };
})
.directive('skill2Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/skillwise-usage/skill2-report.html',
		controller:"Skill2ReportController"
  };
})
.directive('skill3Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/skillwise-usage/skill3-report.html',
		controller:"Skill3ReportController"
  };
})
.directive('skill4Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/skillwise-usage/skill4-report.html',
		controller:"Skill4ReportController"
  };
});