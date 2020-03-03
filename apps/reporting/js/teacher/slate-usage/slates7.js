angular.module('sledstudio')
.controller('TeacherSlate7ReportController',function ($scope, ajaxCallsFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
	
	$scope.loadslate7report = function(){
		var school_id = sessionStorage.getItem("schoolid");
		
		$scope.data7 = [];
		$scope.lables7 = [];
		
		$scope.options7 = { scales: {xAxes:[{barThickness:30}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: false } };
		$scope.chartcolor7 = barchartcolorServices.setdiifBarColor(); 
		
		ajaxCallsFactory.getCall(dictionary)
		.then(function (response){	
			var subjectnamelist = response.data.subject;
		
			var urlPath = dashboardServices.weeklySubjectUsage();
			ajaxCallsFactory.getCall(urlPath)
			.then(function(response1){		
				var weeklyDetail = response1.data.data;
					
				ajaxCallsFactory.getCall(slate_config)
				.then(function (response2){
					var stnadrdsubjectdata = response2.data.standard_subject_map;
					var allsubjectidlist = [];
			
					angular.forEach(stnadrdsubjectdata, function(value, key) {
						angular.forEach(value, function(value1, key1) {
							this.push(value1);
						},allsubjectidlist);
					});
					
					function onlyUnique(value, index, self) { 
						return self.indexOf(value) === index;
					}
					
					var uniquesubjectidlist = allsubjectidlist.filter(onlyUnique);
					
					uniquesubjectidlist.sort(function(a, b){return a-b});
					
					var tempsubjectdata = [];
					
					angular.forEach(uniquesubjectidlist, function(value, key) {
						if(weeklyDetail[value]){
							var hourconvert = convertHourServices.convertDurationToHour(weeklyDetail[value].duration);
							this.push(hourconvert);
						}else{
							this.push(0);
						}
						$scope.lables7.push(subjectnamelist[value].name.gj);
					},tempsubjectdata);
					
					$scope.data7.push(tempsubjectdata);
					dataModalServices.closeModal()
				},function(error) {
					console.log("can not get subject data");
					dataModalServices.closeModal();
				});					
			},function(error){
				console.log("can not get Weekely Ugase Data beckend api");	
				dataModalServices.closeModal();
			});
		},function(error) {
			console.log("can not get subject data in dictionary json file");
			dataModalServices.closeModal();
		});
		
	}
	
	$scope.loadslate7report();
});