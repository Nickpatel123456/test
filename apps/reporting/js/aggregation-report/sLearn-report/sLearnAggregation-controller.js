angular.module('sledstudio')
.controller('AggreationSlearnController',function ($scope, $window, basicFactory) {
	
	this.init = function(){
		if(basicFactory.checkIfLoggedInCorrectly() == true){	
			$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
		}
	}
	this.init();
	
	$scope.goBack = function(){
		$window.location.href="#/reporting";
		sessionStorage.setItem("aggregationreport","aggregation");
	}
})
.directive('slearnanalysis1Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLearn-report/sLearn-analysis1.html',
		controller:"sLearn1ReportController"
  };
})
.directive('slearnanalysis2Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLearn-report/sLearn-analysis2.html',
		controller:"sLearn2ReportController"
  };
})
.directive('slearnanalysis3Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLearn-report/sLearn-analysis3.html',
		controller:"sLearn3ReportController"
  };
});
