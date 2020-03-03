angular.module('sledstudio')
.controller('sLearn2ReportController',function ($scope, $window, FromdateTodateFactory, dashboardServices, barchartcolorServices, ajaxCallsFactory, convertHourServices, dataModalServices) {
	$scope.today2 = function () {
		var formdate = sessionStorage.getItem("formdate");
		var todate = sessionStorage.getItem("todate");
		if (formdate == null && todate == null) {
			$scope.fromDate2 = null;
			$scope.toDate2 = null;
		} else {
			$scope.fromDate2 = new Date(formdate);
			$scope.toDate2 = new Date(todate);
		}
	};

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
	
	ajaxCallsFactory.getCall(slearn_config)
	.then(function (response){
		var subject_usage_limitation = response.data.subject_usage_limitation;
		
		ajaxCallsFactory.getCall(dictionary)
		.then(function (response1){
			var subjectdata = response1.data.subject;
			$scope.subjectnamedata = [];
			
			for(sub_key in subject_usage_limitation){
				$scope.subjectnamedata.push({
					id:sub_key,
					name:subjectdata[sub_key].name
				})
			}
			
		},function(error) {
			console.log("can not get subject usage limitation subject key in slearn config json");
		});	
	},function(error) {
		console.log("can not get subject usage limitation subject key in slearn config json");
	});
	
	$scope.loadsLearn2Report = function(){
		dataModalServices.openMoldal();
		$scope.showsLearnreport2 = false;

		sessionStorage.setItem("formdate", $scope.fromDate2);
		sessionStorage.setItem("todate", $scope.toDate2);

		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate2);
		var totimestamp = FromdateTodateFactory.fromdate($scope.toDate2);
		var subjectid = $scope.subjectdata2;
		var productname = "slearn";
		
		$scope.data2 = [];
		$scope.labels2 = ["Subject Usage"];
		$scope.series2 = [];
		
		$scope.options2 =  { scales: {xAxes:[{barThickness:20}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: true } };
		$scope.chartcolor2 = barchartcolorServices.coloschart();  
	
		ajaxCallsFactory.getCall(schoolgroup_config)
		.then(function (response){
			var schoolidlist = [];
			var schooldata = response.data.schoolgroup[2].school_id_list;
			var schooldetails = response.data.school_detail;
			
			angular.forEach(schooldata,function(value,key){
				schoolidlist.push(value);
				$scope.series2.push(schooldetails[value].school_name);
			});
			
			function allschoolsubjectusageRecursive(start,end){
				if(start > end-1){
					dataModalServices.closeModal();
					$scope.showsLearnreport2 = true;
					return;
				}
				
				var school_id = schoolidlist[start];
				
				var urlPath = dashboardServices.sLearnSubjctUsage(productname,school_id,fromtimestamp,totimestamp);
				ajaxCallsFactory.getCall(urlPath)
				.then(function(response1){
					var schoolsubjectusagedata = response1.data.data;
					var subjectusagedata = [];
					
					if(schoolsubjectusagedata[subjectid]){
						$scope.data2.push({
							schoolid: school_id,
							schoolname: schooldetails[school_id].school_name,
							usage: convertHourServices.convertDurationToHour(schoolsubjectusagedata[subjectid])
						});
					}else{
						$scope.data2.push({
							schoolid: school_id,
							schoolname: schooldetails[school_id].school_name,
							usage: 0
						});
					}
					
					/*$scope.data2.push(subjectusagedata);*/
					
					allschoolsubjectusageRecursive(start+1,end);
				});
			}
			
			allschoolsubjectusageRecursive(0,schoolidlist.length);
		},function(error) {
			console.log("can not get product usage data backend");
			dataModalServices.closeModal();
		});
		
	}
});
