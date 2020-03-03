angular.module('sledstudio')
.controller('Slearn3ReportController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
		
	$scope.clear = function() {
		$scope.fromDate3 = null;
		$scope.toDate3 = null;
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
	
	$scope.loadslearn3report = function(){
		dataModalServices.openMoldal();
		$scope.showgraphPanel3 = false;
		
		var productid = 1;
		var school_id = sessionStorage.getItem("schoolid");
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate3);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate3);
	
		$scope.lables3 = [];
		$scope.data3 = [];
		var standardusage_data = [];
		
		$scope.options3 = { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor3 = barchartcolorServices.setdiifBarColor(); 
		
		var urlPath = dashboardServices.standardLevelUsage(productid,school_id,fromtimestamp,totimestamp);
		ajaxCallsFactory.getCall(urlPath)
		.then(function (response){		
			var standardUsageData =  response.data.data;

			ajaxCallsFactory.getCall(school_config)
			.then(function (response1){	
				var standard_division_map = response1.data.standard_division_map;
				
				angular.forEach(standard_division_map, function(value, key) {
					$scope.lables3.push(key);
					if(standardUsageData[key] == undefined){
						standardusage_data.push(0);
					}else{
						var hourconvert = convertHourServices.convertDurationToHour(standardUsageData[key].duration);
						standardusage_data.push(hourconvert);
					}
				});
				
				$scope.data3.push(standardusage_data);
				dataModalServices.closeModal();
				$scope.showgraphPanel3 = true;						
			},function(error) {
				console.log("can not get standard id in standard_division_map object in slearn config");
				dataModalServices.closeModal();
			});
				
		},function(error) {
			console.log("can not get this api data check pass data");
			dataModalServices.closeModal();
		});
	}
});