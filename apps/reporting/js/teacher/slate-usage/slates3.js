angular.module('sledstudio')
.controller('TeacherSlate3ReportController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
	$scope.today3 = function() {
		var formdate = sessionStorage.getItem("formdate");
		var todate = sessionStorage.getItem("todate");
		if(formdate == null && todate == null){
			$scope.fromDate3 = null;
			$scope.toDate3 = null;
		}else{
			$scope.fromDate3 = new Date(formdate);
			$scope.toDate3 = new Date(todate);
		}		
	};
	
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
	
	$scope.loadslate3report = function(){
		dataModalServices.openMoldal();
		$scope.showgraphPanel3 = false;
		
		var school_id = sessionStorage.getItem("schoolid");
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate3);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate3);
		
		sessionStorage.setItem("formdate",$scope.fromDate3);
		sessionStorage.setItem("todate",$scope.toDate3);
		
		$scope.lables3 = [];
		$scope.data3 = [];
		var standardusagedata = [];
		
		$scope.options3 = { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor3 = barchartcolorServices.setdiifBarColor(); 
		
		ajaxCallsFactory.getCall(slate_config)
		.then(function (response){		
			var standardsubjectmapdata = response.data.standard_subject_map;
			var standardidlist = [];
				
			for(var stdkey in standardsubjectmapdata)
			standardidlist.push(stdkey);
				
			function standardwiseusageRecursive(start,end){
				if(start > end-1){
					$scope.data3.push(standardusagedata);
					dataModalServices.closeModal();
					$scope.showgraphPanel3 = true;
					return;
				}
					
				var standard_id = standardidlist[start];
				
				$scope.lables3.push(standard_id)
				
				var filterdata = JSON.stringify({
					"filters_long":{"standardId":standard_id},
					"filters_string":{"userRole":"teacher"},
					"aggregation_keys":["standardId"]
				});
					
				var urlPath = dashboardServices.rolewisefilterusagedata(school_id,fromtimestamp,totimestamp);
				ajaxCallsFactory.postCall(urlPath,filterdata)
				.then(function (response1){	
					var studentstandardusagedata = response1.data.data;
						
					if(studentstandardusagedata[standard_id]){
						var hourconvert = convertHourServices.convertDurationToHour(studentstandardusagedata[standard_id].duration);
						standardusagedata.push(hourconvert);
					}else{
						standardusagedata.push(0);
					}						
					standardwiseusageRecursive(start+1,end);
				},function(error) {
					console.log("can not get subject data in api no 7");
					dataModalServices.closeModal();
				});
					
			}
				
			standardwiseusageRecursive(0,standardidlist.length);		
		},function(error) {
			console.log("can not get this api data check pass data");
			dataModalServices.closeModal();
		});
	}
});