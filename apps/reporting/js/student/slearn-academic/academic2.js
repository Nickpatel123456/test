angular.module('sledstudio')
.controller('Academic2LevelController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices) {
	
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
	
	$scope.getsubjectdata2 = function(){
		ajaxCallsFactory.getCall(slearn_config)
		.then(function (response){	
			var subjectusagelimitation = response.data.subject_usage_limitation;
			
			ajaxCallsFactory.getCall(dictionary)
			.then(function (response1){				
				var subjectdetails = response1.data.subject;
				$scope.subjectdata2 = [];
				
				for(var key in subjectusagelimitation)
				$scope.subjectdata2.push({sub_id:key,sub_name:subjectdetails[key].name})
				
			},function(error) {
				console.log("can not get Dicttonary data school json file")
			});
		
		},function(error) {
			console.log("can not get stndard data school json file")
		});
	}
	$scope.getsubjectdata2();
	
	$scope.getStandardData2 = function(){
		ajaxCallsFactory.getCall(slearn_config)
		.then(function (response){
			var stddata = response.data.subject_usage_limitation[$scope.sub_analysis2];
			
			$scope.standardanalysis2 = [];
			for(var key in stddata){
				if(key > 2){
					$scope.standardanalysis2.push(key);
				}
			}
			
		},function(error) {
			console.log("can not get slearn_config data")
		});
	}
	
	$scope.getDivisionData2 = function(){
		ajaxCallsFactory.getCall(school_config)
		.then(function (response){
			var divId = response.data.standard_division_map[$scope.std_analysis2];
			
			ajaxCallsFactory.getCall(dictionary)
			.then(function (response1){
				$scope.divanalysis2 = [];
				
				for(var k in divId)
				$scope.divanalysis2.push({
					divid:divId[k],
					divname:response1.data.division[divId[k]].name
				})
			},function(error) {
				console.log("can not get Dicttonary data school json file")
			});
		},function(error) {
			console.log("can not get slearn_config data")
		});
	}

	$scope.loadAcademic2Report = function(){
		$scope.showAcademic2Report = false;
		$scope.activity_arrow = "";
		
		$scope.errorMsg2 = false;
		$scope.showtable2 = false;
		dataModalServices.openMoldal();
		
		var school_id = sessionStorage.getItem("schoolid");
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate2);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate2);
		var subjectid =  $scope.sub_analysis2;
		var standard_id = $scope.std_analysis2;
		var divisionid = $scope.div_analysis2;
		var data = JSON.stringify({"school_id":school_id,"standard_id":standard_id,"division_id":divisionid});
		$scope.studentAttemptActivityTableData = [];
		
		//this ajax get the studentAttemptActivity 
		var urlPath  = dashboardServices.attemptActivity(subjectid,fromtimestamp,totimestamp,data);
		ajaxCallsFactory.getCall(urlPath)
		.then(function (response){
			var studentAttemptActivity = response.data.data;

			//this ajax get the student details
			var urlPath1 = dashboardServices.getStudentDetails(data);
			ajaxCallsFactory.getCall(urlPath1)
			.then(function (response1){
				var stdentdetails = response1.data.data;

				function studentAttemptActivityTableRecrsive(startIndex,endIndex){		
					if(startIndex > endIndex-1){
						dataModalServices.closeModal();
						$scope.showAcademic2Report = true;
						if($scope.studentAttemptActivityTableData.length == 0){
							$scope.errorMsg2 = true;
							$scope.errorMsg = "No data Avaliable for this combination";
						}else{
							$scope.showtable2 = true;
							$scope.activity_arrow = true;
						}
						return;
					} 
									
					var floorno = studentAttemptActivity[startIndex].floor_id;
					var conceptroomid = studentAttemptActivity[startIndex].conceptroom_id;
					var conceptid = studentAttemptActivity[startIndex].concept_id;
					var activityid = studentAttemptActivity[startIndex].activity_id;
					var attempactivity = studentAttemptActivity[startIndex].frequency;
					
					//this ajax get the floor wise concept data
					var urlPath2 = dashboardServices.getConceptroomJson(subjectid,floorno);
					ajaxCallsFactory.getCall(urlPath2)
					.then(function (response2){
						var floordata = response2.data;
						var userId = studentAttemptActivity[startIndex].user_id;
						var studentname = stdentdetails[userId].user_detail.first_name + " " + stdentdetails[userId].user_detail.last_name;
						var conceptroomname = floordata.conceptroom[conceptroomid].conceptroom_name;
						var conceptname = floordata.conceptroom[conceptroomid].concept[conceptid].concept_name;
						var activityname = floordata.conceptroom[conceptroomid].concept[conceptid].activity[activityid].activity_name;
						
						$scope.studentAttemptActivityTableData.push({
							studentName:studentname,
							floorNo:floorno,
							conceptroomName:conceptroomname,
							conceptName:conceptname,
							activityName:activityname,
							attemptActivity:attempactivity
						});
						studentAttemptActivityTableRecrsive(startIndex+1,endIndex)
						
					},function(error) {
						console.log("can not get attemptActivity data")
					});
					
				}
				
				studentAttemptActivityTableRecrsive(0,studentAttemptActivity.length)
	
			},function(error) {
				console.log("can not get attemptActivity data")
			});
			
		},function(error) {
			console.log("can not get attemptActivity data")
		});
	}
	
	// column to sort
	// $scope.column = 'sno';
	 
	// sort ordering (Ascending or Descending). Set true for desending
	// $scope.reverse = false; 
	
	// called on header click
	// $scope.sortColumn = function(col){
		// $scope.column = col;
		// if($scope.reverse){
			// $scope.reverse = false;
			// $scope.reverseclass = 'arrow-up';
		// }else{
			// $scope.reverse = true;
			// $scope.reverseclass = 'arrow-down';
		// }
	 // };
	 
	 // remove and change class
	// $scope.sortClass = function(col){
		// if($scope.column == col ){
		// if($scope.reverse){
		// return 'arrow-down'; 
		// }else{
		// return 'arrow-up';
		// }
		// }else{
		// return 'arrow-down'; 
		// }
	// } 
	
});