angular.module('sledstudio')
.controller('Slearn1ReportController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
		
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
	
	$scope.loadslearn1report = function(){
		dataModalServices.openMoldal();
		
		var school_id = sessionStorage.getItem("schoolid");
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate1);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate1);
		var roletype = "student";
		
		var slearnusagedata = [];
		$scope.data1 = [];
		$scope.lables1 = ["sLearn Usage"];
		
		$scope.options1 =  { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor1 = barchartcolorServices.setdiifBarColor(); 
						
		var urlPath = dashboardServices.productUsageData(school_id,roletype,fromtimestamp,totimestamp);
		ajaxCallsFactory.getCall(urlPath)
		.then(function(res){
			if(res.data.data[1]){
				var hourconvert = convertHourServices.convertDurationToHour(res.data.data[1].duration);
				slearnusagedata.push(hourconvert);
			}else{
				slearnusagedata.push(hourconvert);
			}	
			$scope.data1.push(slearnusagedata);
			dataModalServices.closeModal();
		},function(error) {
			console.log("can not get this api data check pass data");
			dataModalServices.closeModal();
		});
	}
	
	$scope.currentCompletionSlearn = function(){
		
		var school_id = sessionStorage.getItem("schoolid");
		$scope.showCompletionGraph = false;
		
		var subjectkey = [];
		$scope.data11 = [];
		$scope.lables11 = [];
		
		$scope.options11 = { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'Subject Usage Percentage(%)',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor11 = barchartcolorServices.setdiifBarColor(); 
		
		ajaxCallsFactory.getCall(slearn_config)
		.then(function(response){					
			for(var key in response.data.subject_usage_limitation){
				subjectkey.push(key);
			}
			
			ajaxCallsFactory.getCall(dictionary)
			.then(function (resSubject){					
				var subjectdetails = resSubject.data.subject;
				
				for(var key in subjectkey)
				$scope.lables11.push(subjectdetails[subjectkey[key]].name.gj);
			},function(error) {
				console.log("can not get subject data")
			});
			
			$scope.slearnComplePercantage = [];	
			
			function recursiveSleanCompletiondata(startIndex,endIndex){
				if(startIndex > endIndex-1) {
					$scope.showCompletionGraph = true;
					return;
				}
				
				var urlPath1 =  dashboardServices.completeSleanSchoolLevelStudent(subjectkey[startIndex],school_id);
				ajaxCallsFactory.getCall(urlPath1)
				.then(function(response1){				
					var subject_completion_percentage = response1.data.data.subject_completion_percentage;
					
					$scope.data11.push(parseFloat(subject_completion_percentage).toFixed(0));
					recursiveSleanCompletiondata(startIndex+1,endIndex);
				},function(error) {
					console.log("can not %sLearn Completion data")
				});					
			}
			
			recursiveSleanCompletiondata(0,subjectkey.length)
			
		},function(error) {
			console.log("can not get slearn config file data")
		});
	}
	$scope.currentCompletionSlearn();
});