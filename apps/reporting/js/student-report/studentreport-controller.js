angular.module('sledstudio')
.controller('StudentReportController',function (errorFactory, basicFactory, $scope, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, barchartcolorServices, FromdateTodateFactory) {
	this.init = function(){
		// CommonController.backgroundTabCheckService();
		if(basicFactory.checkIfLoggedInCorrectly() == true){	
			sessionStorage.setItem("menuid",4);
		}
	}
	
	this.init();
	
	$scope.clear = function() {
		$scope.fromDate = null;
		$scope.toDate = null;
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
		
	/* Start subject module*/
	//this ajax call is use to get the slean config json data
	
	ajaxCallsFactory.getCall(slearn_config)
	.then(function(resSleanConfig){
		$scope.subject_usage_limitation = resSleanConfig.data.subject_usage_limitation;
		$scope.studentstandardid = JSON.parse(localStorage.getItem('loginresponse')).student_detail.standard_id;
		$scope.subjectKey = [];
			
		//this function is get the subject key belong to standard id and store subject id 
		for(var key in $scope.subject_usage_limitation){
			if($scope.subject_usage_limitation[key][$scope.studentstandardid] != undefined){
				$scope.subjectKey.push(key); //this array store sub id key
			}
		}	
			
		//this ajax call get the dictionary json data
		ajaxCallsFactory.getCall(dictionary)
		.then(function(resdictionary){
			$scope.subjectdata = resdictionary.data.subject;
			$scope.subjectname = [];

			//this for loop is store the subject name depend on subjectKey array
			for(arrayIndex in $scope.subjectKey){
				$scope.subjectname.push($scope.subjectdata[$scope.subjectKey[arrayIndex]].name.gj); // this array store subject name
			}	
		});	
	});
	/* End of subject module*/
	
	
	$scope.tillDatesLearnComplete = function(){
		$scope.slearn_data1 = [];
		var subjectKey1 = [];
		$scope.options5 = { scales: {xAxes:[{barThickness:60}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'Usage in Percentage',fontSize:15}}]}, legend: { display: true } };
		 $scope.chartcolor = barchartcolorServices.coloschart();
		
		ajaxCallsFactory.getCall(slearn_config)
		.then(function(resSleanConfig){
			var subject_usage_limitation1 = resSleanConfig.data.subject_usage_limitation;
			var studentstandardid1 = JSON.parse(localStorage.getItem('loginresponse')).student_detail.standard_id;
			
				
			//this function is get the subject key belong to standard id and store subject id 
			for(var key in subject_usage_limitation1){
				if(subject_usage_limitation1[key][studentstandardid1] != undefined){
					subjectKey1.push(key); //this array store sub id key	
				}
			}		
			
			function recursiveFun(start,end){
				if(start > end-1 )return;
		
				var subject_api = slearn_backend_api+"getstudents/currentconceptoom/subject/"+subjectKey1[start]
				
				ajaxCallsFactory.getCall(subject_api)
				 .then(function(resSleansub){	
					var subject_data = resSleansub.data.data.subject_completion_percentage;
					var slearn_data = [];
					slearn_data[0] = subject_data;
					$scope.slearn_data1.push(slearn_data)
				 });
				recursiveFun(start+1,end);
				
			}
			recursiveFun(0,subjectKey1.length);
			
		});			
	}
	
	$scope.tillDatesLearnComplete();	
	
	$scope.loadGraph = function(){
		/* Start product usage */
		var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate);
		var totimestamp = FromdateTodateFactory.todate($scope.toDate);
		var product_api = backend_api_base+"um/report/productusage/lin/"+fromtimestamp+"/lout/"+totimestamp
		$scope.storedata = [];
		var productId = [1,2];
		
		$scope.options1 = { scales: {xAxes:[{barThickness:60}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Minutes of Usage',fontSize:15}}]}, legend: { display: true } };
		$scope.chartcolor = barchartcolorServices.coloschart();
		
		ajaxCallsFactory.getCall(sledstudio_menu)
		.then(function(ressledstudiomenu){
			$scope.product_value = ressledstudiomenu.data.product_index;
			$scope.product_name = [];
			for(i=0; i<productId.length; i++){
				$scope.product_name.push($scope.product_value[productId[i]].name.en);
			}
		});
		
		ajaxCallsFactory.getCall(product_api)
		.then(function(resproduct){
			$scope.productdata = resproduct.data.data;
			console.log($scope.productdata)
			$scope.data = [];
			if($scope.productdata[1] == undefined){
				$scope.storedata.push(0)
			}else{
				$scope.storedata.push((Number($scope.productdata[1])/60).toFixed(2));
			}
			
			if($scope.productdata[2] == undefined){
				$scope.storedata.push(0)
			}else{
				$scope.storedata.push((Number($scope.productdata[2])/60).toFixed(2));
			}

			$scope.data[0] = [$scope.storedata[0]];
			$scope.data[1] = [$scope.storedata[1]];
			
		});	
		
		/* End of product usage */
	}

	$scope.slearnmonthGraph = function(){
		var date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var fromtimestamp = FromdateTodateFactory.fromdate(firstDay);
		var totimestamp = FromdateTodateFactory.todate(lastDay);
		var slearnmonth_api = slearn_backend_api+"dashboard/local/usage/persubject/lin/"+fromtimestamp+"/lout/"+totimestamp
		$scope.slearnmonth_data = [];
		$scope.options3 = { scales: {xAxes:[{barThickness:60}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Minutes of Usage',fontSize:15}}]}, legend: { display: true } };
		$scope.chartcolor = barchartcolorServices.coloschart();
		
		ajaxCallsFactory.getCall(slearnmonth_api)
		.then(function(resslearnmonth){
			$scope.sleanmonthdata = resslearnmonth.data.data;
			for(var k in $scope.sleanmonthdata){
				$scope.slearnmonth_data.push([($scope.sleanmonthdata[k]/60).toFixed(2)]);
			}
		});		
	}

	$scope.slatemonthGraph = function(){
		var date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var fromtimestamp = FromdateTodateFactory.fromdate(firstDay);
		var totimestamp = FromdateTodateFactory.todate(lastDay);
		var slatemonth_api = backend_api_base+"slate/dashboard/local/usage/persubject/lin/"+fromtimestamp+"/lout/"+totimestamp
		$scope.slatemonth_data = [];
		$scope.options4 = { scales: {xAxes:[{barThickness:60}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Minutes of Usage',fontSize:15}}]}, legend: { display: true } };
		$scope.chartcolor = barchartcolorServices.coloschart();
		
		ajaxCallsFactory.getCall(slatemonth_api)
		.then(function(resslatemonth){
			$scope.slatemonthdata = resslatemonth.data.data;
			for(var k in $scope.slatemonthdata){
				$scope.slatemonth_data.push([$scope.slatemonthdata[k]/60]);
			}
		});		
	}	
});
