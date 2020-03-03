angular.module('sledstudio')
.controller('UserManualReportController',function ($scope, $window, ajaxCallsFactory, $sce, basicFactory) {
	this.init = function(){
		if(basicFactory.checkIfLoggedInCorrectly() == true){	
			sessionStorage.setItem("menuid",5);			
			$scope.userrole = sessionStorage.getItem("user_role");
			$scope.usermanuladetails = [{"name":"sLate Manual","pdfname":"slate_manual.pdf"},{"name":"sLearn Manual","pdfname":"slearn_manual.pdf"}]
		}
        $scope.show = false;
	}
	
	this.init();

	$scope.showusermanual = function(){
	    $scope.showPdfBox = true;
	    $scope.showPdfUrl = $sce.trustAsResourceUrl(baselinkforfiles+"lib/pdf/web/viewer.html?pdfname=" + $scope.usermanualdata)
	}
});