angular.module('sledstudio')
.controller('TeacherSlate6ReportController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
	$scope.today6 = function() {
		var formdate = sessionStorage.getItem("formdate");
		var todate = sessionStorage.getItem("todate");
		if(formdate == null && todate == null){
			$scope.fromDate6 = null;
			$scope.toDate6 = null;
		}else{
			$scope.fromDate6 = new Date(formdate);
			$scope.toDate6 = new Date(todate);
		}		
	};
	
	$scope.clear = function() {
		$scope.fromDate6 = null;
		$scope.toDate6 = null;
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
	

	$scope.loadslate6report = function(){
		$scope.showgraph6 = false;
		dataModalServices.openMoldal();
		
		var school_id = sessionStorage.getItem("schoolid");
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate6);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate6);
		
		sessionStorage.setItem("formdate",$scope.fromDate6);
		sessionStorage.setItem("todate",$scope.toDate6);
		
		$scope.data6 = [];
		$scope.series6 = [];
		$scope.labels6 = [];
		
		$scope.options6 = { scales: {xAxes:[{barThickness:15}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: true } };
		$scope.chartcolor6 = barchartcolorServices.coloschart(); 

		ajaxCallsFactory.getCall(slate_config)
		.then(function (response){	
			var stnadrdsubjectdata = response.data.standard_subject_map;
			var allsubjectidlist = [];
			var allstandardidlist = [];
			
			angular.forEach(stnadrdsubjectdata, function(value, key) {
				allstandardidlist.push(key);
				$scope.labels6.push(key);
				
				angular.forEach(value, function(value1, key1){
					allsubjectidlist.push(value1)
				});
			});
						
			function onlyUnique(value, index, self) { 
				return self.indexOf(value) === index;
			}
			
			var uniquesubjectidlist = allsubjectidlist.filter(onlyUnique);
			
			uniquesubjectidlist.sort(function(a, b){return a-b});
			
			ajaxCallsFactory.getCall(dictionary)
			.then(function (response2){	
				var subjectnamelistdata = response2.data.subject;
				
				function subjectwiseRecursive(start,end){
					if(start > end-1){
						dataModalServices.closeModal();
						$scope.showgraph6 = true;
						return;
					}
					var subject_id = uniquesubjectidlist[start];
					
					$scope.series6.push(subjectnamelistdata[subject_id].name.gj);	
					
					var tempsubjectdata = [];
					
					function standardwiseRecursive(start1,end1){
						if(start1 > end1-1){
							$scope.data6.push(tempsubjectdata);
							subjectwiseRecursive(start+1,end);
							return;
						}
						
						var filterdata = JSON.stringify({
							"filters_long":{"standardId":allstandardidlist[start1]},
							"filters_string":{"userRole":"teacher"},
							"aggregation_keys":["subjectId"]
						});
						
						var urlPath = dashboardServices.rolewisefilterusagedata(school_id,fromtimestamp,totimestamp);
						ajaxCallsFactory.postCall(urlPath,filterdata)
						.then(function (response3){
							var subjectstandardwiseusagedata = response3.data.data;
						
							if(subjectstandardwiseusagedata[subject_id] == undefined){
									tempsubjectdata.push(0);
							}else{
								var hourconvert = convertHourServices.convertDurationToHour(subjectstandardwiseusagedata[subject_id].duration);
								tempsubjectdata.push(hourconvert);
							}
							
							standardwiseRecursive(start1+1,end1);

						},function(error) {
							console.log("can not get slate standardDetails slate json");
						});
						
					}
					
					standardwiseRecursive(0,allstandardidlist.length);
				}
				
				subjectwiseRecursive(0,uniquesubjectidlist.length);
			},function(error) {
				console.log("can not get subject data dictionary json");
				dataModalServices.closeModal();
			});
			
		},function(error) {
			console.log("can not get stndard data slate json file");
			dataModalServices.closeModal();
		});
	}
});