angular.module('sledstudio')
.controller('YearDashboardController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, goBackServices, FromdateTodateFactory, convertHourServices, dashboardServices, dataModalServices) {
	
	this.init = function(){
		if(basicFactory.checkIfLoggedInCorrectly() == true){	
			$scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
		}
	}
	this.init();
	
	$scope.goBack = function(){
		$window.location.href="#/reporting";
		sessionStorage.setItem("aggregationreport","aggregation");
	}
	// $scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;

	
	Date.prototype.getWeek = function(){
		var today = new Date();
		var day = today.getDay();
		var date = today.getDate() - day;


		// Grabbing Start/End Dates
		var StartDate = new Date();
		var EndDate = new Date();
		StartDate.setHours(0,0,0,0); EndDate.setHours(0,0,0,0);
		StartDate.setDate(today.getDate()-day);
		EndDate.setDate(today.getDate()-day+6);
		return {
			startDate:StartDate,
			endDate: EndDate
		};
	} 
	var thisWeekDates=new Date().getWeek();
	var fromDateweek = thisWeekDates.startDate;
	var toDateweek = thisWeekDates.endDate;
	
	var year = (new Date()).getFullYear();
	var month = ((new Date()).getMonth()) + 1;
	
	function getWeeksInMonth(month, year){
		   var weeks=[],
			   firstDate=new Date(year, month, 1),
			   lastDate=new Date(year, month+1, 0), 
			   numDays= lastDate.getDate();
		   
		   var start=1;
		   var end=7-firstDate.getDay();
		   while(start<=numDays){
			   weeks.push({start:start,end:end});
			   start = end + 1;
			   end = end + 7;
			   if(end>numDays)
				   end=numDays;    
		   }        
			return weeks;
	}
	
	var weekcount = getWeeksInMonth(month,year).length;

	$scope.weekwisesubjectusagetable = function(subjectstudent_total){
		var studenttotal_subject = subjectstudent_total;
		// console.log(subjectstudent_total)
		$scope.subjectName = [];
		var productname = "slearn";
		var roletype = "student";
		$scope.showtable = false;
		ajaxCallsFactory.getCall(dictionary)
		.then(function (response){	
			var subject_name_list = response.data.subject;
			
			//Start yearly usage
			ajaxCallsFactory.getCall(schoolgroup_config)
			.then(function (response){
				var schoolidlist2 = [];
				var schooldata2 = response.data.schoolgroup[2].school_id_list;
				var schooldetails2 = response.data.school_detail;
				
				angular.forEach(schooldata2,function(value,key){
					schoolidlist2.push(value);
				});
				var subjectName2 = [];
				
				$scope.actualSubjectusage2 = {};
				
				$scope.schoonamelist = [];
				
				var actual = [];
				var actual1 = 0;
				
				var expect = [];
				var expect1 = 0;
				
				var aggregate_actualarray = [];
				var aggregate_expectedarray = [];
				$scope.aggregate_actual = 0;
				$scope.aggregate_expected = 0;
				$scope.aggregate_percentage = 0;
				var sci_actual = 0;
				var sci_expected = 0;
				var mat_actual = 0;
				var mat_expected = 0;
				var ss_actual = 0;
				var ss_expected = 0;
				var guj_actual = 0;
				var guj_expected = 0;
				var eng_actual = 0;
				var eng_expected = 0;
				
				function schoolrecusionfunction(start2,end2){
					if(start2 > end2-1){
						
						ajaxCallsFactory.getCall(slearn_config)
						.then(function (response){	
							$scope.allschoolUsageData = [{subname:{gj:"Total"},actual:$scope.aggregate_actual,expected:$scope.aggregate_expected,percentage:$scope.aggregate_percentage}];
							var subject_usage = response.data.subject_usage_limitation;
							var subkeyidlist = [];
							
							for(var subkey in subject_usage){
								subkeyidlist.push(subkey)
							}
						
							angular.forEach(subkeyidlist,function(value,key){
								if(eval(value) === 1){
									this.push({subname:subject_name_list[value].name,actual:convertHourServices.convertDurationToHour(sci_actual),expected:convertHourServices.convertDurationToHour(sci_expected),percentage:convertHourServices.convertDurationToHour(sci_actual) * 100 / convertHourServices.convertDurationToHour(sci_expected)});
								}else if(eval(value) === 2){
									this.push({subname:subject_name_list[value].name,actual:convertHourServices.convertDurationToHour(mat_actual),expected:convertHourServices.convertDurationToHour(mat_expected),percentage:convertHourServices.convertDurationToHour(mat_actual) * 100 / convertHourServices.convertDurationToHour(mat_expected)});
								}else if(eval(value) === 3){
									this.push({subname:subject_name_list[value].name,actual:convertHourServices.convertDurationToHour(ss_actual),expected:convertHourServices.convertDurationToHour(ss_expected),percentage:convertHourServices.convertDurationToHour(ss_actual) * 100 / convertHourServices.convertDurationToHour(ss_expected)});
								}else if(eval(value) === 4){
									this.push({subname:subject_name_list[value].name,actual:convertHourServices.convertDurationToHour(guj_actual),expected:convertHourServices.convertDurationToHour(guj_expected),percentage:convertHourServices.convertDurationToHour(guj_actual) * 100 / convertHourServices.convertDurationToHour(guj_expected)});
								}else if(eval(value) === 6){
									this.push({subname:subject_name_list[value].name,actual:convertHourServices.convertDurationToHour(eng_actual),expected:convertHourServices.convertDurationToHour(eng_expected),percentage:convertHourServices.convertDurationToHour(eng_actual) * 100 / convertHourServices.convertDurationToHour(eng_expected)});
								}
							},$scope.allschoolUsageData);
							
						},function(error) {
							console.log("can not get school json");
						});
						
						
						
						for(i=0; i<schoolidlist2.length; i++){
							$scope.aggregate_actual += eval(aggregate_actualarray[i]);
							$scope.aggregate_expected += eval(aggregate_expectedarray[i]);
						}
						$scope.aggregate_percentage = $scope.aggregate_actual * 100 / $scope.aggregate_expected;
					
						$scope.showtable = true;
						dataModalServices.closeModal();
						return;
					}
					
					var school__id2 = schoolidlist2[start2];
					$scope.schoonamelist.push(schooldetails2[school__id2].school_name)
					
					angular.forEach(studenttotal_subject,function(value,key){
						var expectdusage = convertHourServices.convertDurationToHour(eval(value.duration) * eval(value.studenttotal)*22);
						this.push({subname:subject_name_list[value.subjectkey].name,expected:expectdusage})
					},$scope.subjectName);
					
					var yearstartdate = new Date(new Date().getFullYear(), 0, 1);
					var yearenddate = new Date(new Date().getFullYear(), 11, 31);
					// var fromTimestamp2 = FromdateTodateFactory.fromdate(yearstartdate);
					var fromTimestamp2 = 1510684200;
					// var toTimestamp2 = FromdateTodateFactory.todate(yearenddate);
					var toTimestamp2 = 1523816999;
						
					var urlPath2 = dashboardServices.sLearnSubjctUsage(productname,school__id2,fromTimestamp2,toTimestamp2,roletype)

					ajaxCallsFactory.getCall(urlPath2)
					.then(function (response2){	
						var studentsubjectusagedata2 = response2.data.data;

						var sub_actualuse2 = {};

						var data = [];
					
						angular.forEach(studenttotal_subject,function(value2,key2){

							
							if(school__id2 == value2.schoolid){

								if(studentsubjectusagedata2[value2.subjectkey]){
									// console.log(value2.subjectkey)
									if(eval(value2.subjectkey) === 1){
										// console.log("subject science")
										sci_actual += studentsubjectusagedata2[value2.subjectkey];
										sci_expected += eval(value2.duration) * eval(value2.studenttotal)*22;
									}else if(eval(value2.subjectkey) === 2){
										mat_actual += studentsubjectusagedata2[value2.subjectkey];
										mat_expected += eval(value2.duration) * eval(value2.studenttotal)*22;
									}else if(eval(value2.subjectkey) === 3){
										ss_actual += studentsubjectusagedata2[value2.subjectkey];
										ss_expected += eval(value2.duration) * eval(value2.studenttotal)*22;
									}else if(eval(value2.subjectkey) === 4){
										guj_actual += studentsubjectusagedata2[value2.subjectkey];
										guj_expected += eval(value2.duration) * eval(value2.studenttotal)*22;
									}else if(eval(value2.subjectkey) === 6){
										eng_actual += studentsubjectusagedata2[value2.subjectkey];
										eng_expected += eval(value2.duration) * eval(value2.studenttotal)*22;
									}
									
									var expectdusage2 = convertHourServices.convertDurationToHour(eval(value2.duration) * eval(value2.studenttotal)*22);
									expect.push(eval(value2.duration) * eval(value2.studenttotal)*22);
									
									actual.push(studentsubjectusagedata2[value2.subjectkey]);
									
									data.push({actualuse:convertHourServices.convertDurationToHour(studentsubjectusagedata2[value2.subjectkey]),subid:value2.subjectkey,subname:subject_name_list[value2.subjectkey].name,expected:expectdusage2,percentage:(convertHourServices.convertDurationToHour(studentsubjectusagedata2[value2.subjectkey]) * 100)/ $scope.subjectName[key2].expected})
								}else{
									data.push({actualuse:-1,subid:value2.subjectkey,expected:0,percentage:0});
								}
								
							}
							
						});
					
						for(i=0; i<expect.length; i++){
							actual1 += actual[i];
							expect1 += expect[i];
						}

						var totalsubjectusage = [{actualuse:convertHourServices.convertDurationToHour(actual1),subid:0,subname:{gj:"Total"},expected:convertHourServices.convertDurationToHour(expect1),percentage:actual1 * 100/expect1}];

						
						aggregate_actualarray.push(convertHourServices.convertDurationToHour(actual1))
						aggregate_expectedarray.push(convertHourServices.convertDurationToHour(expect1))
						$scope.actualSubjectusage2[school__id2] = totalsubjectusage.concat(data);
					
						
						
						schoolrecusionfunction(start2+1,end2);
						
					},function(error) {
						console.log("can not get subject data in api");
						dataModalServices.closeModal();
					});
					
				}
				schoolrecusionfunction(0,schoolidlist2.length)	
					
			},function(error) {
			console.log("can not get school json");
			});
			//End yearly usage
		},function(error) {
			console.log("can not get dictionary json");
		});
	};

	
	$scope.subjectstudentcount = function(data){
		var studentcountdata = data;
		// console.log(studentcountdata)
		ajaxCallsFactory.getCall(slearn_config)
		.then(function (response){	
			var subject_usage = response.data.subject_usage_limitation;
			var subjectkeyvalue = [];
			var subjectstudenttotal = [];
			
			angular.forEach(subject_usage,function(value,key){
		
				var stdkey = [];
				var duration_usagelimit;
				angular.forEach(value,function(value1,key1){
					if(key1>2){
						this.push(key1);
						duration_usagelimit = value1.duration_usage_limit;
					}
				},stdkey);
				
				this.push({subjectkey:key,standardkey:stdkey,duration:duration_usagelimit})
			},subjectkeyvalue);
			// console.log(subjectkeyvalue)
			var sum = 0;
			var schid;
			ajaxCallsFactory.getCall(schoolgroup_config)
			.then(function (response){
				var schoolidlist1 = [];
				var schooldata1 = response.data.schoolgroup[2].school_id_list;
				var schooldetails1 = response.data.school_detail;
				
				angular.forEach(schooldata1,function(value,key){
					schoolidlist1.push(value);
				});
				
				function schoolfunction(start2,end2){
					if(start2 > end2-1){
						$scope.weekwisesubjectusagetable(subjectstudenttotal);
						return;
					}
					
					var school__id = schoolidlist1[start2];
					
					function subjectrecursivefun(start,end){
						if(start > end-1){
							
							schoolfunction(start2+1,end2);
							return;
						}
						
						var sub_key = subjectkeyvalue[start].subjectkey;
						var std_key = subjectkeyvalue[start].standardkey;
						var usage_duration = subjectkeyvalue[start].duration;
						
						angular.forEach(studentcountdata,function(value,key){
							
							if(school__id == value.schoolid){
								schid = school__id;
								// console.log(schid)
								angular.forEach(std_key,function(value1,key1){
									if(value.std == value1){
										sum = sum + eval(value.totalstudent);
									}
								});
							}else{
								// console.log("do nothing")
							}
						});
						
						subjectstudenttotal.push({
							schoolid:schid,
							subjectkey:sub_key,
							studenttotal:sum,
							duration:usage_duration
						});
						
						sum = 0;
						
						subjectrecursivefun(start+1,end);
					}
					subjectrecursivefun(0,subjectkeyvalue.length);
				}
				 // schoolfunction(0,2)	
				schoolfunction(0,schoolidlist1.length)	
					// console.log(subjectstudenttotal)	
			},function(error) {
			console.log("can not get school json");
			});
		},function(error) {
			console.log("can not get school json");
		});
	}
	
	$scope.weekWiseUsageFunctioncloud = function(){
		var schoolId = 514;
		
		$scope.showdashboardTable =  false;
		dataModalServices.openMoldal();
		
		ajaxCallsFactory.getCall(slearn_config)
		.then(function (response){	
			var subject_usage = response.data.subject_usage_limitation;
			var subjectstandardkey = [];
			
			angular.forEach(subject_usage,function(value,key){
				var stdkey = [];
				angular.forEach(value,function(value1,key1){
					if(key1>2)this.push(key1);
				},stdkey);
				
				this.push({subjectkey:key,standardkey:stdkey})
			},subjectstandardkey);
			
			ajaxCallsFactory.getCall(school_config)
			.then(function (response1){	
				var standard_division = response1.data.standard_division_map;
				var sub_std_div = [];
				var std_div = [];
				var std_key = [];
				
				angular.forEach(standard_division,function(value,key){
					this.push(key);
				},std_key);
				
				ajaxCallsFactory.getCall(schoolgroup_config)
				.then(function (response){
					var schoolidlist = [];
					var schooldata = response.data.schoolgroup[2].school_id_list;
					var schooldetails = response.data.school_detail;
					
					angular.forEach(schooldata,function(value,key){
						schoolidlist.push(value);
					});
					var standardstudentcount = [];
					function schoolrecursivefunction(start2,end2){
						if(start2 > end2-1){
							$scope.subjectstudentcount(standardstudentcount);
							return;
						}
						
						var SchoolID = schoolidlist[start2]
						var studentlength = [];
						
						
						function standardfunction(start,end){
							if(start > end-1){
								
								schoolrecursivefunction(start2+1,end2);
								return;
							}
							
							var stdkeyval = std_key[start];
							var divid = standard_division[stdkeyval];
							
							
							function divisionfunction(start1,end1){
								if(start1 > end1-1){
									standardstudentcount.push({
										schoolid:SchoolID,
										std:stdkeyval,
										totalstudent:studentlength.length
									})
									
									studentlength = [];
									standardfunction(start+1,end);
									return;
								}
								
								var divKey = divid[start1];
							
								var data = JSON.stringify({"school_id":SchoolID,"standard_id":stdkeyval,"division_id":divKey});
								
								var urlPath1 = dashboardServices.getStudentDetails(data);
								ajaxCallsFactory.getCall(urlPath1)
								.then(function (response){
									var studentdata = response.data.data;
									
									angular.forEach(studentdata,function(value,key){
										this.push(key);
									},studentlength);
									
									divisionfunction(start1+1,end1);
								},function(error) {
									console.log("can not get sLate Subject Usage Data");
									dataModalServices.closeModal();
								});
								
							}
							divisionfunction(0,divid.length);
						}
						standardfunction(0,std_key.length)
					}
					schoolrecursivefunction(0,schoolidlist.length)	
						
				},function(error) {
				console.log("can not get school json");
				});	
			},function(error) {
				console.log("can not get school json");
			});
			
		},function(error) {
			console.log("can not get stndard data slate json file");
		});
	}
	$scope.weekWiseUsageFunctioncloud();
})