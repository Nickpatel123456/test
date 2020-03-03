angular.module('sledstudio')
.controller('TeacherSlate1ReportController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
	$scope.today1 = function() {
		var formdate = sessionStorage.getItem("formdate");
		var todate = sessionStorage.getItem("todate");
		if(formdate == null && todate == null){
			$scope.fromDate1 = null;
			$scope.toDate1 = null;
		}else{
			$scope.fromDate1 = new Date(formdate);
			$scope.toDate1 = new Date(todate);
		}		
	};
	
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
	
	$scope.loadslate1report = function(){
		dataModalServices.openMoldal();
		$scope.showgraphPanel1 = false;
		
		var school_id = sessionStorage.getItem("schoolid");
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate1);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate1);
		var roletype = "teacher";
		
		sessionStorage.setItem("formdate",$scope.fromDate1);
		sessionStorage.setItem("todate",$scope.toDate1);
		
		var slateproductdata = [];
		$scope.data1 = [];
		$scope.lables1 = ["sLate Usage"];
		
		$scope.options1 = { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor1 = barchartcolorServices.coloschart(); 
						
		var urlPath = dashboardServices.productUsageData(school_id,roletype,fromtimestamp,totimestamp);
		ajaxCallsFactory.getCall(urlPath)
		.then(function (res){
			if(res.data.data[2]){
				var hourconvert = convertHourServices.convertDurationToHour(res.data.data[2].duration);
				slateproductdata.push(hourconvert);
			}else{
				slateproductdata.push(0);
			}	
			
			$scope.data1.push(slateproductdata);
			dataModalServices.closeModal();
			$scope.showgraphPanel1 = true;
		},function(error) {
			console.log("can not get this api data check pass data");
			dataModalServices.closeModal();
		});
	}
});