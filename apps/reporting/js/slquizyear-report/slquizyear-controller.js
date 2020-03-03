angular.module('sledstudio')
.controller('SlquizYearController',function ($scope, basicFactory, $window, goBackServices) {
	this.init = function(){
		if(basicFactory.checkIfLoggedInCorrectly() == true){	
			sessionStorage.setItem("menuid",4);
			
			$scope.userrole = sessionStorage.getItem("user_role");
			$scope.usermanuladetails = [{"name":"2017","pdfname":"2017.pdf"},{"name":"2018","pdfname":"2018.pdf"},{"name":"2019","pdfname":"2019.pdf"},{"name":"2020","pdfname":"2020.pdf"},{"name":"2021","pdfname":"2021.pdf"}]
			
			sessionStorage.setItem("slquizreport","yes");		
		}
	}
	
	this.init();
	
	$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
	$scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;
		
	$scope.goBack = function(){
		goBackServices.goBackPage($window);
	}
	
	$scope.showusermanual = function(){
		var pdfname = $scope.usermanualdata;
		console.log(pdfname);
		document.getElementById('usermanual').src = baselinkforfiles+"lib/pdf/web/viewer.html?pdfname=" + pdfname;
	}
});