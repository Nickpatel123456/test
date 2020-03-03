angular.module('sledstudio')
.controller('Skill1ReportController',function ($scope, ajaxCallsFactory, dashboardServices, dataModalServices, barchartcolorServices) {
	
	this.standardDetails1 = function(){
		ajaxCallsFactory.getCall(school_config)
		.then(function(response){
			var standard_division_data = response.data.standard_division_map;
			$scope.standard_details1 = Object.keys(standard_division_data)
				.map(function (value, index) {
                    return { id: value, division: standard_division_data[value] }
                }
			);
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
	}
	this.standardDetails1();
	
	$scope.getdivisionDetails1 = function(){
		var divisiondata = $scope.standarddata1.division;
		ajaxCallsFactory.getCall(dictionary)
		.then(function(response){
			$scope.division_details1 = [];
			angular.forEach(divisiondata, function(value,key){
				this.push({
					id:value,
					name:response.data.division[value].name
				})
			},$scope.division_details1);	
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
	}
	
	
	$scope.loadskill1report = function(){
		dataModalServices.openMoldal();
		$scope.showstudentdetailstable = false;
		var school_id = sessionStorage.getItem("schoolid");
		var standard_id = $scope.standarddata1.id;
		var division_id = $scope.divisiondata1;
				
		var data = JSON.stringify({"school_id":school_id,"standard_id":standard_id,"division_id":division_id});
		var urlPath = dashboardServices.getStudentDetails(data);
		ajaxCallsFactory.getCall(urlPath)
		.then(function (response){
			$scope.stdentdetails = response.data.data;
			$scope.showstudentdetailstable = true;
			dataModalServices.closeModal();
		},function(error) {
			console.log("Cannot get student details");
			dataModalServices.closeModal();
		});	

	}
	
	$scope.subjectnamedata1 = function(subjectid){
		var subjectname = [];
		ajaxCallsFactory.getCall(dictionary)
		.then(function(response){
			subjectname.push(response.data.subject[subjectid].name.gj); 
		},function(error) {
			console.log("can not get dictionary json data");
		});
		
		return subjectname;
	}
	
	$scope.subjectskilusagedata1 = function(subjectskilldata,subjectkey){
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
	
	$scope.getskillnamedetails1 = function(subjectskilldata,subjectkey){
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
	
	$scope.showStudentSkillDetails = function(studentdata){
		var school_id = sessionStorage.getItem("schoolid");
		var standard_id = $scope.standarddata1.id;
		var division_id = $scope.divisiondata1;
		var user_id = studentdata.user_detail.user_id;
		$scope.studentname = studentdata.user_detail.first_name + " " + studentdata.user_detail.middle_name;
		
		$scope.imgurl = baselinkforfiles + "images/source.gif";
		$scope.showloading = true;
		$scope.science1 = $scope.maths1 = $scope.ss1 = $scope.gujarati1 = $scope.english1 = false;
		
		var objdata = JSON.stringify({user_id:user_id,standard_id:standard_id,division_id:division_id,school_id:school_id});
		$.ajax({
			type: "POST",
			url: skiilreport_backend_api + 'skillcompletionreport/individual',
			data:objdata,
			headers: { 
			'Accept': 'application/json',
			'Content-Type': 'application/json' 
			},
			crossDomain: true,
			success:function(data){
				var responsedata = data.data;
				
				$scope.options1 = { scales: {xAxes:[{barThickness:15}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'Skill Completion Percentage',fontSize:15}}]}, legend: { display: false } };
				$scope.chartcolor1 = barchartcolorServices.setdiifBarColor(); 
				
				angular.forEach(responsedata,function(value,key){
					switch(key){
						case "1":
							$scope.science1 = true;
							$scope.subjectName1 = $scope.subjectnamedata1(key);
							$scope.data1 = $scope.subjectskilusagedata1(responsedata[key],key);
							$scope.lables1 = $scope.getskillnamedetails1(responsedata[key],key);
						break;
						
						case "2":
							$scope.maths1 = true;
							$scope.subjectName2 = $scope.subjectnamedata1(key);
							$scope.data2 = $scope.subjectskilusagedata1(responsedata[key],key);
							$scope.lables2 = $scope.getskillnamedetails1(responsedata[key],key);
						break;
						
						case "3":
							$scope.ss1 = true;
							$scope.subjectName3 = $scope.subjectnamedata1(key);
							$scope.data3 = $scope.subjectskilusagedata1(responsedata[key],key);
							$scope.lables3 = $scope.getskillnamedetails1(responsedata[key],key);
						break;
						
						case "4":
							$scope.gujarati1 = true;
							$scope.subjectName4 = $scope.subjectnamedata1(key);
							$scope.data4 = $scope.subjectskilusagedata1(responsedata[key],key);
							$scope.lables4 = $scope.getskillnamedetails1(responsedata[key],key);
						break;
						
						case "6":
							$scope.english1 = true;
							$scope.subjectName5 = $scope.subjectnamedata1(key);
							$scope.data5 = $scope.subjectskilusagedata1(responsedata[key],key);
							$scope.lables5 = $scope.getskillnamedetails1(responsedata[key],key);
						break;
					}
					
				});
				
				$scope.showloading = false;
				dataModalServices.closeModal();
			
			}
		});
	}
});