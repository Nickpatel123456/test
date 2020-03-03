angular.module('sledstudio')
    .controller('sLate3ReportController', function ($scope, FromdateTodateFactory, ajaxCallsFactory, dashboardServices, barchartcolorServices, dataModalServices, convertHourServices) {
        $scope.roletypename3 = dashboardServices.roleTypeName();

        $scope.today3 = function () {
            var formdate = sessionStorage.getItem("formdate");
            var todate = sessionStorage.getItem("todate");
            if (formdate == null && todate == null) {
                $scope.fromDate3 = null;
                $scope.toDate3 = null;
            } else {
                $scope.fromDate3 = new Date(formdate);
                $scope.toDate3 = new Date(todate);
            }
        };

        $scope.clear = function () {
            $scope.fromDate3 = null;
            $scope.toDate3 = null;
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

        $scope.getstandard = function () {
            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    var slatestandard = response.data.standard_subject_map;
                    $scope.standardidlist = [];

                    for (var stdkey in slatestandard)
                        $scope.standardidlist.push(stdkey);

                }, function (error) {
                    console.log("can not get subject_usage_limitation in slean json file");
                });
        }
        $scope.getstandard();


        $scope.loadsLateReport3 = function () {
            dataModalServices.openMoldal();
            $scope.showreport3 = false;
            var selectedrole = $scope.roletype3;

			sessionStorage.setItem("formdate", $scope.fromDate3);
			sessionStorage.setItem("todate", $scope.toDate3);

            var fromTimestamp = FromdateTodateFactory.fromdate($scope.fromDate3);
            var toTimestamp = FromdateTodateFactory.fromdate($scope.toDate3);
            var standardid = $scope.standardanalysis3;
            $scope.data3 = [];
            var prodctname = "slate";
            $scope.lables3 = ["Standard Usage"];

            $scope.options3 = {
                scales: {
                    xAxes: [{barThickness: 20}],
                    yAxes: [{
                        ticks: {beginAtZero: true},
                        scaleLabel: {display: true, labelString: 'No. of Hours of Usage', fontSize: 15}
                    }]
                }, legend: {display: true}
            };
            $scope.chartcolor3 = barchartcolorServices.coloschart();

            ajaxCallsFactory.getCall(schoolgroup_config)
                .then(function (response) {
                    var schgroup = response.data.schoolgroup[2].school_id_list;
                    var schooldetails = response.data.school_detail;
                    var schoolidlist = [];
                    $scope.schoolnamelist3 = [];

                    angular.forEach(schgroup, function (value, key) {
                        schoolidlist.push(value);
                        $scope.schoolnamelist3.push(schooldetails[value].school_name);
                    });

                    function schooldataRecursive3(start, end) {
                        if (start > end - 1) {
                            dataModalServices.closeModal();
                            $scope.showreport3 = true;
                            return;
                        }
                        var schoolId = schoolidlist[start];

                        var filterdata = JSON.stringify({
                            "filters_long": {"standardId": standardid},
                            "filters_string": {"userRole": selectedrole},
                            "aggregation_keys": ["standardId"]
                        });
                        var urlPath = dashboardServices.rolewisefilterusagedata(schoolId, fromTimestamp, toTimestamp);
                        ajaxCallsFactory.postCall(urlPath, filterdata)
                            .then(function (response1) {
                                var schoolstandrdsubjectdata = response1.data.data;
                                var standardusagedata = [];
                                if (schoolstandrdsubjectdata[standardid]) {
                                    $scope.data3.push({
                                        schoolid: schoolId,
                                        schoolname: schooldetails[schoolId].school_name,
                                        usage: convertHourServices.convertDurationToHour(schoolstandrdsubjectdata[standardid].duration)
                                    });

                                    /*ar hourconvert = convertHourServices.convertDurationToHour(schoolstandrdsubjectdata[standardid].duration);
                                    standardusagedata.push(hourconvert);*/
                                } else {
                                    $scope.data3.push({
                                        schoolid: schoolId,
                                        schoolname: schooldetails[schoolId].school_name,
                                        usage: 0
                                    });
                                   /* standardusagedata.push(0);*/
                                }
                                /*$scope.data3.push(standardusagedata);*/

                                schooldataRecursive3(start + 1, end);
                            }, function (error) {
                                console.log("can not get stanard subject data");
                                dataModalServices.closeModal()
                            });

                    }

                    schooldataRecursive3(0, schoolidlist.length);
                }, function (error) {
                    console.log("can not get school details check dictonary json");
                    dataModalServices.closeModal();
                });
        }
    });
