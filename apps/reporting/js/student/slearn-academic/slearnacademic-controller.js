angular.module('sledstudio')
.controller('SlearnAcademicReportController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices) {
	
	$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
	$scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;
	
	$scope.goBack = function(){
		goBackServices.goBackPage($window);
	}
})
.directive('academic1Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-academic/academic1.html',
		controller:"Academic1LevelController"
  };
})
.directive('academic2Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-academic/academic2.html',
		controller:"Academic2LevelController"
  };
})
.directive('academic3Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-academic/academic3.html',
		controller:"Academic3LevelController"
  };
})
.directive('academic4Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-academic/academic4.html',
		controller:"Academic4LevelController"
  };
})
.directive('academic5Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-academic/academic5.html',
		controller:"Academic5LevelController"
  };
  
})
.directive('academic6Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-academic/academic6.html',
		controller:"Academic6LevelController"
  };
  
});
