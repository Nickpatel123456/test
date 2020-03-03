angular.module('sledstudio')
.controller('Skill2ReportController',function ($scope, ajaxCallsFactory, $http, barchartcolorServices, dataModalServices) {
	
	this.standardDetails2 = function(){
		ajaxCallsFactory.getCall(school_config)
		.then(function(response){
			var standard_division_data = response.data.standard_division_map;
			$scope.standard_details2 = Object.keys(standard_division_data)
				.map(function (value, index) {
                    return { id: value, division: standard_division_data[value] }
                }
			);
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
	}
	this.standardDetails2();
	
	$scope.getdivisionDetails2 = function(){
		var divisiondata = $scope.standarddata2.division;
		ajaxCallsFactory.getCall(dictionary)
		.then(function(response){
			$scope.division_details2 = [];
			angular.forEach(divisiondata, function(value,key){
				this.push({
					id:value,
					name:response.data.division[value].name
				})
			},$scope.division_details2);	
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
	}
	
	$scope.subjectnamedata2 = function(subjectid){
		var subjectname = [];
		ajaxCallsFactory.getCall(dictionary)
		.then(function(response){
			subjectname.push(response.data.subject[subjectid].name.gj); 
		},function(error) {
			console.log("can not get dictionary json data");
		});
		
		return subjectname;
	}
	
	$scope.subjectskilusagedata2 = function(subjectskilldata,subjectkey){
		var sub_skillid = parse_sub_skill.subskill[subjectkey];
		var subjectskillcompletePercentage = [];
		
		var subjectskilldataJson = {};
		
		angular.forEach(subjectskilldata,function(value,key){
			subjectskilldataJson[value.skill_id] = value.completion_percentage;
		});
		
		angular.forEach(sub_skillid,function(value,key){
			if(subjectskilldataJson[value]){
				this.push(subjectskilldataJson[value])
			}else{
				this.push(0)
			}
		},subjectskillcompletePercentage);
		
		return subjectskillcompletePercentage;
	}
	
	$scope.getskillnamedetails2 = function(subjectskilldata, subjectkey){
		var subjectskillname = [];
		
		ajaxCallsFactory.getCall(skill_config)
		.then(function(response){
			var skillnamedetails =  response.data;
			var sub_skillid = parse_sub_skill.subskill[subjectkey];
			
			angular.forEach(sub_skillid,function(value,key){
				this.push(skillnamedetails[value].name.guj)
			},subjectskillname);
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
		
		return subjectskillname;
		
	}
	
	$scope.loadskill2report = function(){
		dataModalServices.openMoldal();
		var school_id = sessionStorage.getItem("schoolid");
		var standard_id = $scope.standarddata2.id;
		var division_id = $scope.divisiondata2;
		$scope.science2 = $scope.maths2 = $scope.ss2 = $scope.gujarati2 = $scope.english2 = false;
			
		var dataObj = JSON.stringify({standard_id:standard_id,division_id:division_id,school_id:school_id});
		
		$.ajax({
			type: "POST",
			url: skiilreport_backend_api + 'skillcompletionreport/classroom',
			data:dataObj,
			headers: { 
			'Accept': 'application/json',
			'Content-Type': 'application/json' 
			},
			crossDomain: true,
			success:function(data){
				var responsedata = data.data;
				
				$scope.options2 = { scales: {xAxes:[{barThickness:15}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'Skill Completion Percentage',fontSize:15}}]}, legend: { display: false } };
				$scope.chartcolor2 = barchartcolorServices.setdiifBarColor(); 
				
				angular.forEach(responsedata,function(value,key){
					switch(key){
						case "1":
							$scope.science2 = true;
							$scope.subjectName6 = $scope.subjectnamedata2(key);
							$scope.data6 = $scope.subjectskilusagedata2(responsedata[key],key);
							$scope.lables6 = $scope.getskillnamedetails2(responsedata[key],key);
						break;
						
						case "2":
							$scope.maths2 = true;
							$scope.subjectName7 = $scope.subjectnamedata2(key);
							$scope.data7 = $scope.subjectskilusagedata2(responsedata[key],key);
							$scope.lables7 = $scope.getskillnamedetails2(responsedata[key],key);
						break;
						
						case "3":
							$scope.ss2 = true;
							$scope.subjectName8 = $scope.subjectnamedata2(key);
							$scope.data8 = $scope.subjectskilusagedata2(responsedata[key],key);
							$scope.lables8 = $scope.getskillnamedetails2(responsedata[key],key);
						break;
						
						case "4":
							$scope.gujarati2 = true;
							$scope.subjectName9 = $scope.subjectnamedata2(key);
							$scope.data9 = $scope.subjectskilusagedata2(responsedata[key],key);
							$scope.lables9 = $scope.getskillnamedetails2(responsedata[key],key);
						break;
						
						case "6":
							$scope.english2 = true;
							$scope.subjectName10 = $scope.subjectnamedata2(key);
							$scope.data10 = $scope.subjectskilusagedata2(responsedata[key],key);
							$scope.lables10 = $scope.getskillnamedetails2(responsedata[key],key);
						break;
					}
					
				});
				
				dataModalServices.closeModal();
			}
		});
	}
});






















