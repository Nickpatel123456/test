angular.module('sledstudio')
.controller('TeacherReport1Controller',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
	
	$scope.clear = function() {
		$scope.fromDate1 = null;
		$scope.toDate1 = null;
	};

	$scope.inlineOptions = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	$scope.dateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
		var date = data.date,
		mode = data.mode;
		//return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		return mode === 'day' && (date.getDay() === 0);
	}

	$scope.toggleMin = function() {
		$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
		$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	};

	$scope.toggleMin();

	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.open2 = function() {
		$scope.popup2.opened = true;
	};

	$scope.setDate = function(year, month, day) {
		$scope.dt = new Date(year, month, day);
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.altInputFormats = ['M!/d!/yyyy'];

	$scope.popup1 = {
		opened: false
	};

	$scope.popup2 = {
		opened: false
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	 
	$scope.events = [
		{
			date: tomorrow,
			status: 'full'
		},
		{
			date: afterTomorrow,
			status: 'partially'
		}
	];

	function getDayClass(data) {
		var date = data.date,
		mode = data.mode;
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0,0,0,0);

			for (var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}

		return '';
	}
	
	$scope.loadreportusage1report = function(){
		dataModalServices.openMoldal();
		$scope.showreport1table = false;
		$scope.showerrromsg1 = false;
		var school_id = sessionStorage.getItem("schoolid");
		var product_id = 4;
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate1);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate1);
		var objdata = JSON.stringify({school_id:school_id,product_id:product_id,start_timestamp:fromtimestamp,stop_timestamp:totimestamp});
		$scope.usagedata = [];
		
		$.ajax({
			type: "POST",
			url: skiilreport_backend_api_inactivestd + 'teacher/reportusage',
			data:objdata,
			headers: { 
			'Accept': 'application/json',
			'Content-Type': 'application/json' 
			},
			crossDomain: true,
			success:function(response){
				var teacher_data = response.data;
				// console.log(teacher_data)
				$scope.usagedata = teacher_data;
				// console.log($scope.usagedata)
				
				if($scope.usagedata.length == 0){
					$scope.showreport1table = false;
					$scope.showerrromsg1 = true;
				}else{
					$scope.showreport1table = true;
					$scope.showerrromsg1 = false;
				}
				dataModalServices.closeModal();
			}

		});
	}
	
});