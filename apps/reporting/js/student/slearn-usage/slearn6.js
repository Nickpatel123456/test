angular.module('sledstudio')
    .controller('Slearn6ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
        $scope.today6 = function () {
            var formdate = sessionStorage.getItem("formdate");
            var todate = sessionStorage.getItem("todate");
            if (formdate == null && todate == null) {
                $scope.fromDate6 = null;
                $scope.toDate6 = null;
            } else {
                $scope.fromDate6 = new Date(formdate);
                $scope.toDate6 = new Date(todate);
            }
        };

        $scope.clear = function () {
            $scope.fromDate6 = null;
            $scope.toDate6 = null;
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

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function (year, month, day) {
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

        $scope.events = [{
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
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }


        $scope.loadslearn6report = function () {
            dataModalServices.openMoldal();
            $scope.showgraph6 = false;

            sessionStorage.setItem("formdate", $scope.fromDate6)
            sessionStorage.setItem("todate", $scope.toDate6)

            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate6);
            var totimestamp = FromdateTodateFactory.todate($scope.toDate6);
            var prodctname = "slearn";

            $scope.options6 = {
                scales: {
                    xAxes: [{barThickness: 15}],
                    yAxes: [{
                        ticks: {beginAtZero: true},
                        scaleLabel: {display: true, labelString: 'No. of Hours of Usage', fontSize: 15}
                    }]
                }, legend: {display: false}
            };
            $scope.chartcolor6 = barchartcolorServices.coloschart();

            ajaxCallsFactory.getCall(school_config)
                .then(function (respone) {
                    var standardId_list = Object.keys(respone.data.standard_division_map);

                    ajaxCallsFactory.getCall(slearn_config)
                        .then(function (respone1) {
                            var subject_usage = respone1.data.subject_usage_limitation;

                            ajaxCallsFactory.getCall(dictionary)
                                .then(function (respone2) {
                                    var subjectName = respone2.data.subject;
                                    $scope.prouctStdWiseSubjectData = {};

                                    function stdWiseSubRecursive(start, end) {
                                        if (start > end - 1) {
                                            dataModalServices.closeModal();
                                            $scope.showgraph6 = true;
                                            return;
                                        }

                                        var stdId = standardId_list[start];
                                        var subid = [];
                                        var data = [];
                                        var stdwisesubjectname = [];

                                        angular.forEach(subject_usage, function (value, key) {
                                            angular.forEach(value, function (value1, key1) {
                                                if (stdId == key1) {
                                                    subid.push(key);
                                                    stdwisesubjectname.push(subjectName[key].name.gj)
                                                }
                                            });
                                        });

                                        var urlPath = dashboardServices.standardSchoolUsage(prodctname, school_id, stdId, fromtimestamp, totimestamp);
                                        ajaxCallsFactory.getCall(urlPath)
                                            .then(function (response3) {
                                                var productSubjectUsage = response3.data.data;

                                                for (var value of subid) {
                                                    if (productSubjectUsage[value]) {
                                                        data.push(convertHourServices.convertDurationToHour(productSubjectUsage[value]));
                                                    } else {
                                                        data.push(0);
                                                    }
                                                }

                                                $scope.prouctStdWiseSubjectData[stdId] = {
                                                    sudid: subid,
                                                    labels: stdwisesubjectname,
                                                    data: new Array(data)
                                                };
                                                stdWiseSubRecursive(start + 1, end);
                                            }, function (error) {
                                                console.log("can not get subject data");
                                            });
                                    }

                                    stdWiseSubRecursive(0, standardId_list.length);
                                }, function (error) {
                                    console.log("Dictionary Json Not Found.");
                                });
                        }, function (error) {
                            console.log("sLearn Json Not Found.");
                        });
                }, function (error) {
                    console.log("Schools Json Not Found.");
                });

            /*$scope.showgraph6 = false;
            dataModalServices.openMoldal();

            sessionStorage.setItem("formdate",$scope.fromDate6)
            sessionStorage.setItem("todate",$scope.toDate6)

            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate6);
            var totimestamp = FromdateTodateFactory.todate($scope.toDate6);
            var prodctname = "slearn";
            $scope.data6 = [];

            $scope.options6 = { scales: {xAxes:[{barThickness:15}],yAxes: [{ticks: {beginAtZero: true},scaleLabel: {display: true,labelString: 'No. of Hours of Usage',fontSize:15}}]}, legend: { display: true } };
            $scope.chartcolor6 = barchartcolorServices.coloschart();

            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response){

                    var subjectusagelimitation =  response.data.subject_usage_limitation;
                    var subjectidlist = [];
                    $scope.series6 = [];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1){
                            var subjectdetails = response1.data.subject;
                            var standardDetails = response1.data.standard;
                            var standardidlist = [];
                            $scope.labels6 = [];

                            angular.forEach(subjectusagelimitation, function(value, key) {
                                subjectidlist.push(key)
                                $scope.series6.push(subjectdetails[key].name.gj); //this is labelname
                            });

                            ajaxCallsFactory.getCall(school_config)
                                .then(function (response2){
                                    var standard_division_map = response2.data.standard_division_map;

                                    angular.forEach(standard_division_map, function(value, key) {
                                        standardidlist.push(key);
                                        $scope.labels6.push(key)
                                    });

                                    function subjectrecursive(start,end){
                                        if(start > end-1){
                                            dataModalServices.closeModal();
                                            $scope.showgraph6 = true;
                                            return;
                                        }

                                        var subjectid = subjectidlist[start];
                                        var subjectdata = [];

                                        function standarddatarecursive(start1,end1){
                                            if(start1 > end1-1){
                                                subjectrecursive(start+1,end);
                                                return;
                                            }

                                            var standardid = standardidlist[start1];

                                            var urlPath = dashboardServices.standardSchoolUsage(prodctname,school_id,standardid,fromtimestamp,totimestamp);
                                            ajaxCallsFactory.getCall(urlPath)
                                                .then(function (response3){
                                                    var slearnsubjectusagedata = response3.data.data;
                                                    if(slearnsubjectusagedata[subjectid] == undefined){
                                                        subjectdata.push(0)
                                                    }else{
                                                        var hourconvert = convertHourServices.convertDurationToHour(slearnsubjectusagedata[subjectid]);
                                                        subjectdata.push(hourconvert)
                                                    }

                                                    standarddatarecursive(start1+1,end1)
                                                },function(error) {
                                                    console.log("can not get subject data");
                                                });
                                        }

                                        standarddatarecursive(0,standardidlist.length)

                                        $scope.data6.push(subjectdata)
                                    }

                                    subjectrecursive(0,subjectidlist.length);
                                },function(error) {
                                    console.log("can not get subject data");
                                });

                        },function(error) {
                            console.log("can not get subject data");
                        });

                },function(error) {
                    console.log("can not get subject data");
                });*/
        }
    });