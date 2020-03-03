angular.module('sledstudio')
.controller('Slearn2ReportController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
		
	$scope.clear = function() {
		$scope.fromDate2 = null;
		$scope.toDate2 = null;
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
	
	$scope.loadslearn2report = function(){
		dataModalServices.openMoldal();
		$scope.showslearn2table = false;
		
		var schoolId = sessionStorage.getItem("schoolid");
		var fromTimestamp = FromdateTodateFactory.fromdate($scope.fromDate2);
		var toTimestamp = FromdateTodateFactory.todate($scope.toDate2);
		var productname = "slearn";
		var roletype = "student";
		
		$scope.data2 = [];
		var subjectusagedata = [];
		$scope.labels2 = [];
		
		$scope.options2 = { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor2 = barchartcolorServices.setdiifBarColor(); 
		
		ajaxCallsFactory.getCall(slearn_config)
		.then(function (response){	
			var stnadrdsubjectdata = response.data.subject_usage_limitation;
			var allsubjectidlist = [];
			
			angular.forEach(stnadrdsubjectdata, function(value, key) {
				this.push(key);
			},allsubjectidlist);

			var urlPath = dashboardServices.sLearnSubjctUsage(productname,schoolId,fromTimestamp,toTimestamp,roletype)
			ajaxCallsFactory.getCall(urlPath)
			.then(function (response1){	
				var studentsubjectusagedata = response1.data.data;
				
				ajaxCallsFactory.getCall(dictionary)
				.then(function (response2){	
					var subjectnamelistdata = response2.data.subject;
					
					angular.forEach(allsubjectidlist, function(value, key) {
						if(studentsubjectusagedata[value]){
							var hourconvert = convertHourServices.convertDurationToHour(studentsubjectusagedata[value]);
							subjectusagedata.push(hourconvert);
						}else{
							subjectusagedata.push(0);
						}
						$scope.labels2.push(subjectnamelistdata[value].name.gj)
					});
										
					$scope.data2.push(subjectusagedata);
					dataModalServices.closeModal();
					$scope.showslearn2table = true;
				},function(error) {
					console.log("can not get subject data dictionary json");
					dataModalServices.closeModal();
				});
				
			},function(error) {
				console.log("can not get subject data in api");
				dataModalServices.closeModal();
			});
		
		},function(error) {
			console.log("can not get stndard data slate json file");
			dataModalServices.closeModal();
		});
	}
});