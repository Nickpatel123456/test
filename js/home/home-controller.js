angular.module('sledstudio')
.controller('HomeController',function ($scope, $rootScope, $interval, CommonController, errorFactory, basicFactory, slateFactory, subjectLoggingFactory, logOutFactory, ajaxCallsFactory, dataModalServices) {
	this.init = function () {
        dataModalServices.closeModal();
		if (basicFactory.checkIfLoggedInCorrectly() == true) {
			$interval.cancel($rootScope.Timer);
			subjectLoggingFactory.closeSubjectService();
			$scope.userfullname = sessionStorage.getItem("first_name")+" "+sessionStorage.getItem("last_name") + ", " + JSON.parse(sessionStorage.getItem("uiTextConfig")).usergreeting;
			$('body').removeClass('slearnbackground');
			$('body').removeClass('conceptroombackground');
            $('body').removeClass('slearn_subject_bg_color');
			sessionStorage.setItem("inside_subject","No");
			sessionStorage.setItem("menuid",0);
			this.checkWhichMenuToDisplay();
		}		
	}
	
	this.checkWhichMenuToDisplay = function() {
		if (sessionStorage.getItem("selectedProduct") != null) {
			var str = String(sessionStorage.getItem("selectedProduct"));
			switch(str) {
			case "1":
			$scope.productNo = 1;
			break;
			case "2":
			$scope.productNo = 2;
			break;
			case "3":
			$scope.productNo = 3;
			break;
			case "4":
			$scope.productNo = 4;
			break;
			case "5":
			$scope.productNo = 5;
			break;
			case "6":
			$scope.productNo = 6;
			break;
			case "7":
			$scope.productNo = 7;
			break;
			case "8":
			$scope.productNo = 8;
			break;
			case "9":
			$scope.productNo = 9;
			break;
			}
		} else {
			logOutFactory.logOut();
		}
	}
	
	$scope.go = function ( path ) {
		window.location.href="#"+path;
	};
	
	this.init();
});
