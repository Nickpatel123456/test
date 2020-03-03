angular.module('sledstudio')
.controller('TeacherSlate4ReportController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
	$scope.today4 = function() {
		var formdate = sessionStorage.getItem("formdate");
		var todate = sessionStorage.getItem("todate");
		if(formdate == null && todate == null){
			$scope.fromDate4 = null;
			$scope.toDate4 = null;
		}else{
			$scope.fromDate4 = new Date(formdate);
			$scope.toDate4 = new Date(todate);
		}		
	};
	
	$scope.clear = function() {
		$scope.fromDate4 = null;
		$scope.toDate4 = null;
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
	
	
	$scope.loadStandard = function(){
		ajaxCallsFactory.getCall(slate_config)
		.then(function (resStandard){
			$scope.standarddata = [];
			for(var key in resStandard.data.standard_subject_map)
			$scope.standarddata.push(key);	
		
		},function(error) {
			console.log("can not get stndard data slate json file")
		});
	}
	$scope.loadStandard();
	
	$scope.loadslate4report = function(){
		dataModalServices.openMoldal();
		$scope.showgraphPanel4 = false;
		
		var school_id = sessionStorage.getItem("schoolid");
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate4);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate4);
		var standard_id = $scope.standard_data;
		
		sessionStorage.setItem("formdate",$scope.fromDate4);
		sessionStorage.setItem("todate",$scope.toDate4);
		
		$scope.data4 = [];
		var standardusagedata = [];
		$scope.lables4 = [];
	
		$scope.options4 = { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor4 = barchartcolorServices.setdiifBarColor(); 
		
		ajaxCallsFactory.getCall(dictionary)
		.then(function (response){		
			var subjectnamelist = response.data.subject;
			
			ajaxCallsFactory.getCall(slate_config)
			.then(function (response1){
				var subjectidlist = response1.data.standard_subject_map[standard_id];
				
				var filterdata = JSON.stringify({
					"filters_long":{"standardId":standard_id},
					"filters_string":{"userRole":"teacher"},
					"aggregation_keys":["subjectId"]
				});
					
				var urlPath = dashboardServices.rolewisefilterusagedata(school_id,fromtimestamp,totimestamp);
				ajaxCallsFactory.postCall(urlPath,filterdata)
				.then(function (response2){
					var teachersubjectusagedata = response2.data.data;
					
					angular.forEach(subjectidlist, function(value, key) {
						$scope.lables4.push(subjectnamelist[value].name.gj);
						if(teachersubjectusagedata[value] == undefined){
							standardusagedata.push(0);
						}else{
							var hourconvert = convertHourServices.convertDurationToHour(teachersubjectusagedata[value].duration);
							standardusagedata.push(hourconvert);
						}
					});
					
					$scope.data4.push(standardusagedata);
					dataModalServices.closeModal()
					$scope.showgraphPanel4 = true;
				},function(error) {
					console.log("can not get slate standardDetails slate json");
				});
				
			},function(error) {
				console.log("can not get slate standardDetails slate json");
			});
				
		},function(error) {
			console.log("can not get subject data");
			dataModalServices.closeModal()
		});			
	}
});