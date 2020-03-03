angular.module('sledstudio')
.controller('Skill3ReportController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices, dataModalServices,barchartcolorServices) {
	
	$scope.getStandardData3 = function(){
		ajaxCallsFactory.getCall(school_config)
		.then(function (response){
			var stddata = response.data.standard_division_map;
			$scope.standardanalysis3 = [];
			for(key in stddata){
				$scope.standardanalysis3.push(key)
				
			}
		},function(error) {
			console.log("can not get slearn_config data")
		});
	}
	$scope.getStandardData3();
	
	
	$scope.subjectnamedata = function(subjectid){
		var subjectname = [];
		ajaxCallsFactory.getCall(dictionary)
		.then(function(response){
			subjectname.push(response.data.subject[subjectid].name.gj); 
			
		},function(error) {
			console.log("can not get dictionary json data");
		});
		
		return subjectname;
	}
	
	$scope.subjectskilusagedata = function(subjectskilldata,subjectkey){
		var sub_skillid = parse_sub_skill.subskill[subjectkey];
		var subjectskillcompletePercentage = [];
		
		ajaxCallsFactory.getCall(skill_config)
		.then(function(response){	
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
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
		
		
		return subjectskillcompletePercentage;
	}
	
	$scope.getskillnamedetails = function(subjectskilldata,subjectkey){
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
	
	$scope.loadskill3report = function(){
		dataModalServices.openMoldal();
		var school_id = sessionStorage.getItem("schoolid");
		var standard_id = $scope.std_analysis3;
		$scope.science3 = $scope.maths3 = $scope.ss3 = $scope.gujarati3 = $scope.english3 = false;
		
		var data = JSON.stringify({"standard_id": standard_id,"school_id": school_id});

		var urlpath = skiilreport_backend_api + "skillcompletionreport/standard";		
		$.ajax({
			type : 'POST',
			url : urlpath,
			contentType:'application/json',
			dataType : 'json',
			data: data,
			success : function(response) {
				
				var subWisedata = response.data;
				$scope.options3 = { scales: {xAxes:[{barThickness:15}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'Skill Completion Percentage',fontSize:15}}]}, legend: { display: false } };
				$scope.chartcolor3 = barchartcolorServices.setdiifBarColor();
				var subject_id = [];
				
				for(key in subWisedata){
					subject_id.push(key);
					
					switch(key){
						case "1":
							$scope.science3 = true;
							$scope.subjectName11 = $scope.subjectnamedata(key);
							$scope.data11 = $scope.subjectskilusagedata(subWisedata[key],key);
							$scope.lables11 = $scope.getskillnamedetails(subWisedata[key],key);
						break;
						
						case "2":
							$scope.maths3 = true;
							$scope.subjectName12 = $scope.subjectnamedata(key);
							$scope.data12 = $scope.subjectskilusagedata(subWisedata[key],key);
							$scope.lables12 = $scope.getskillnamedetails(subWisedata[key],key);
						break;
						
						case "3":
							$scope.ss3 = true;
							$scope.subjectName13 = $scope.subjectnamedata(key);
							$scope.data13 = $scope.subjectskilusagedata(subWisedata[key],key);
							$scope.lables13 = $scope.getskillnamedetails(subWisedata[key],key);
						break;
						
						case "4":
							$scope.gujarati3 = true;
							$scope.subjectName14 = $scope.subjectnamedata(key);
							$scope.data14 = $scope.subjectskilusagedata(subWisedata[key],key);
							$scope.lables14 = $scope.getskillnamedetails(subWisedata[key],key);
						break;
						
						case "6":
							$scope.english3 = true;
							$scope.subjectName16 = $scope.subjectnamedata(key);
							$scope.data16 = $scope.subjectskilusagedata(subWisedata[key],key);
							$scope.lables16 = $scope.getskillnamedetails(subWisedata[key],key);
						break;
					}
				}dataModalServices.closeModal();
				
			},
			error : function(xhr, ajaxOptions, thrownError) {
			console.log("Loading failed");
			console.log(xhr);
			console.log(ajaxOptions);
			console.log(thrownError);
			}
		});
		
	}
	
});