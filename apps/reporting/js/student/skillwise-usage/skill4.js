angular.module('sledstudio')
.controller('Skill4ReportController',function ($scope, ajaxCallsFactory, dataModalServices, dashboardServices) {
	
	this.getSubjectDetails = function(){
		ajaxCallsFactory.getCall(slearn_config)
		.then(function(response){
			var subject_usage_limitation = response.data.subject_usage_limitation;
			
			ajaxCallsFactory.getCall(dictionary)
			.then(function(response1){
				var subjectname_data = response1.data.subject;
				
				$scope.subject_details_data4 = Object.keys(subject_usage_limitation)
					.map(function (value, index) {
						return { sub_id: value, standard:Object.keys(subject_usage_limitation[value]).map(function (value1, index1) {return value1;}),sub_name:subjectname_data[value].name}
					}
				);
			},function(error) {
				console.log("can not get schooljson standard division data");
			});
			
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
	}
	this.getSubjectDetails();
	
	$scope.getstandard_data4 = function(){
		var standard_idlist = $scope.subject_data4.standard;

		ajaxCallsFactory.getCall(school_config)
		.then(function(response){
			var standard_data = response.data.standard_division_map;
			$scope.standard_details_data4 = [];
			
			angular.forEach(standard_idlist,function(value,key){
				if(value > 2){this.push(value)}
			},$scope.standard_details_data4);
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
	}
	
	$scope.getdivision_data4 = function(){
		var standard_id = $scope.standard_data4;
		
		ajaxCallsFactory.getCall(school_config)
		.then(function(response){
			var standard_division_data = response.data.standard_division_map[standard_id];
			
			ajaxCallsFactory.getCall(dictionary)
			.then(function(response1){
				var division_data = response1.data.division;
				$scope.division_details_data4 = [];
				
				angular.forEach(standard_division_data,function(value,ley){
					this.push({
						div_id:value,
						div_name:division_data[value].name
					})
				},$scope.division_details_data4);
				
			},function(error) {
				console.log("can not get schooljson standard division data");
			});
			
		},function(error) {
			console.log("can not get schooljson standard division data");
		});
	}
	
	
	$scope.studentwiseSkillreport = function(){
		dataModalServices.openMoldal();
		$scope.showskillreporttable =  false;
		$scope.erorrmsg =  false;
		
		var school_id = sessionStorage.getItem("schoolid");
		var subject_id = $scope.subject_data4.sub_id;
		var standard_id = $scope.standard_data4;
		var division_id = $scope.division_data4;
		
		ajaxCallsFactory.getCall(skill_config)
		.then(function(response){
			var skills_data = response.data;
		
			var objdata = JSON.stringify({standard_id:standard_id,division_id:division_id,subject_id:subject_id,school_id:school_id});
			$.ajax({
				type: "POST",
				url: skiilreport_backend_api + 'skillcompletionreport/overallperformance',
				data:objdata,
				headers: { 
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
				},
				crossDomain: true,
				success:function(data){
					var studentskillwiseusage_data = data.data;
					console.log(studentskillwiseusage_data);
					
					var data = JSON.stringify({"school_id":school_id,"standard_id":standard_id,"division_id":division_id});
					var urlPath = dashboardServices.getStudentDetails(data);
					ajaxCallsFactory.getCall(urlPath)
					.then(function (response1){
						var stdentdetails = response1.data.data;
						
						if(studentskillwiseusage_data[0]){
							var aggregareskilldata = studentskillwiseusage_data[0];
							
							aggregareskilldata.sort(function(a, b){return a.skill_id - b.skill_id});
							
							$scope.aggregateSkillReport = [];
							var sub_skill_id = parse_sub_skill.subskill[subject_id];
							sub_skill_id.sort(function(a, b){return a.skill_id - b.skill_id});
							var aggregateReportData = {};
							
							angular.forEach(aggregareskilldata, function(value,key){
								var data = [];
								data.push({completion_percentage:value.completion_percentage,available_activities:value.available_activities,completed_activities:value.completed_activities});
								aggregateReportData[value.skill_id] = data;
							});
							
							console.log(aggregateReportData)
							
							angular.forEach(sub_skill_id,function(value,index){
								if(aggregateReportData[value]){
									this.push({skill_name:skills_data[value].name,aggregate:aggregateReportData[value][0].completion_percentage,total_act:aggregateReportData[value][0].available_activities,completed_act:aggregateReportData[value][0].completed_activities})
								}else{
									this.push({skill_name:skills_data[value].name,aggregate:0,total_act:0,completed_act:0})
								}
							},$scope.aggregateSkillReport);
							
							// angular.forEach(aggregareskilldata, function(value,key){
								// this.push({skill_name:skills_data[value.skill_id].name,aggregate:value.completion_percentage,total_act:value.available_activities,completed_act:value.completed_activities})
							// },$scope.aggregateSkillReport);
							// console.log($scope.aggregateSkillReport)
								
							var userid_list = [];
							angular.forEach(studentskillwiseusage_data, function(value,key){
								if(key > 0){this.push(key)}
							},userid_list);
								
							$scope.studentskillReport = [];
								
							function stundetSkillRecursive(start,end){
								if(start > end-1){
									dataModalServices.closeModal();
									$scope.showskillreporttable =  true;
									return;
								}
									
								var user_id = userid_list[start];
								var skillreportdata = [];
								
								var stundetskillJsonData = {};
								angular.forEach(studentskillwiseusage_data[user_id],function(value,key){
									var tempData = [];
									tempData.push({completion_percentage:value.completion_percentage,available_activities:value.available_activities,completed_activities:value.completed_activities})
									stundetskillJsonData[value.skill_id] = tempData;
								});
								
								console.log(stundetskillJsonData);
								
								angular.forEach(sub_skill_id,function(value,index){
									if(stundetskillJsonData[value]){
										this.push(stundetskillJsonData[value][0].completion_percentage)
									}else{
										this.push(0)
									}
								},skillreportdata);
								
								console.log(skillreportdata);
								
								// angular.forEach(aggregareskilldata,function(value,key){
									// var matchSkilid = "";
									// angular.forEach(studentskillwiseusage_data[user_id],function(value1,key1){
										// if(value.skill_id == value1.skill_id){
											// matchSkilid = value1.completion_percentage;
										// }	
									// });
									// this.push(matchSkilid)
								// },skillreportdata);
							
								$scope.studentskillReport.push({srno:start+1,stundet_data:stdentdetails[user_id],skill_data:skillreportdata})
									
								stundetSkillRecursive(start+1,end);
							}
							stundetSkillRecursive(0,userid_list.length);
						}else{
							dataModalServices.closeModal();
							$scope.erorrmsg =  true;
						}
						
							
					},function(error) {
						console.log("Cannot get student details");
						dataModalServices.closeModal();
					});	
				}
			});
			
		},function(error) {
			console.log("can not get Skill Json Data");
		});
	}

});