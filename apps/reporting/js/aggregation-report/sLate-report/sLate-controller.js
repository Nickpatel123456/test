angular.module('sledstudio')
.controller('AggreationSlateController',function ($scope, $window, basicFactory) {
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
.directive('slateanalysis1Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLate-report/sLate-analysis1.html',
		controller:"sLate1ReportController"
  };
})
.directive('slateanalysis2Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLate-report/sLate-analysis2.html',
		controller:"sLate2ReportController"
  };
})
.directive('slateanalysis3Report', function() {
    return {
		restrict:'E',
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLate-report/sLate-analysis3.html',
		controller:"sLate3ReportController"
  };
});
