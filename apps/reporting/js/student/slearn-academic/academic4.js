angular.module('sledstudio')
.controller('Academic4LevelController',function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices) {

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

	$scope.getsubjectdata4 = function(){
		ajaxCallsFactory.getCall(slearn_config)
		.then(function (response){
			var subjectusagelimitation = response.data.subject_usage_limitation;

			ajaxCallsFactory.getCall(dictionary)
			.then(function (response1){
				var subjectdetails = response1.data.subject;
				$scope.subjectdata4 = [];

				for(var key in subjectusagelimitation)
				$scope.subjectdata4.push({sub_id:key,sub_name:subjectdetails[key].name})

			},function(error) {
				console.log("can not get Dicttonary data school json file")
			});

		},function(error) {
			console.log("can not get stndard data school json file")
		});
	}
	$scope.getsubjectdata4();

	$scope.getStandardData4 = function(){
		ajaxCallsFactory.getCall(slearn_config)
		.then(function (response){
			var stddata = response.data.subject_usage_limitation[$scope.sub_analysis4];

			$scope.standardanalysis4 = [];
			for(var key in stddata){
				if(key>2){
					$scope.standardanalysis4.push(key);
				}
			}
		
		},function(error) {
			console.log("can not get slearn_config data")
		});
	}

	$scope.getDivisionData4 = function(){
		ajaxCallsFactory.getCall(school_config)
		.then(function (response){
			var divId = response.data.standard_division_map[$scope.std_analysis4];

			ajaxCallsFactory.getCall(dictionary)
			.then(function (response1){
				$scope.divanalysis4 = [];

				for(var k in divId)
				$scope.divanalysis4.push({
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

	$scope.loadAcademic4Report = function(){
		$scope.showAcademic4Report = false;
		$scope.errorMsg4 = false;
		$scope.showtable4 = false;
		dataModalServices.openMoldal();

		var school_id = sessionStorage.getItem("schoolid");
		var subjectid =  $scope.sub_analysis4;
		var standard_id = $scope.std_analysis4;
		var divisionid = $scope.div_analysis4;
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate4);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate4);
		var data = JSON.stringify({"school_id":school_id,"standard_id":standard_id,"division_id":divisionid});
		$scope.conceptname =[];

		var urlPath = dashboardServices.diffrentConceptlevel(subjectid,fromtimestamp,totimestamp,data);
		ajaxCallsFactory.getCall(urlPath)
		.then(function (response){
			console.log(response.data.data)
			var concept_detail = response.data.data;
			var concept_data = [];

			for(var k in concept_detail)
			concept_data.push(concept_detail[k])

			function conceptidlevelrecursive(start,end){
				if(start > end-1 ){
					dataModalServices.closeModal();
					$scope.showAcademic4Report = true;
					if($scope.conceptname.length == 0){
						$scope.errorMsg4 = true;
						$scope.errorMsg = "No data Avaliable for this combination";
					}else{
						$scope.showtable4 = true;
					}
					return;
				}

				var floorid = concept_data[start].floor_id;

				var urlPath2 = dashboardServices.getConceptroomJson(subjectid,floorid);
				ajaxCallsFactory.getCall(urlPath2)
				.then(function (response2){
					var conceptid = concept_data[start].concept_id;
					var conceptroomid = concept_data[start].conceptroom_id;
					$scope.conceptname.push({
						conceptroom_name:response2.data.conceptroom[conceptroomid].conceptroom_name,
						concept_name:response2.data.conceptroom[conceptroomid].concept[conceptid].concept_name,
						data:concept_data[start]
					})
					
					conceptidlevelrecursive(start+1,end);
				},function(error) {
					console.log("Cannot get data");
					dataModalServices.closeModal();
				});
		
			}
			conceptidlevelrecursive(0,concept_data.length);
		},function(error) {
			console.log("Cannot get data");
			dataModalServices.closeModal();
		});

	}

});
