angular.module('sledstudio')
    .controller('sLearn3ReportController', function ($scope, $window, FromdateTodateFactory, dashboardServices, barchartcolorServices, ajaxCallsFactory, convertHourServices, dataModalServices) {
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

        ajaxCallsFactory.getCall(school_config)
            .then(function (response) {
                var standard_division_map = response.data.standard_division_map;
                $scope.standard_data3 = [];
                for (var std_key in standard_division_map) {
                    $scope.standard_data3.push(std_key);
                }
            }, function (error) {
                console.log("can not get subject usage limitation subject key in slearn config json");
            });

        $scope.loadsLearn3Report = function () {
            dataModalServices.openMoldal();
            $scope.showsLearnreport3 = false;

            sessionStorage.setItem("formdate", $scope.fromDate3);
            sessionStorage.setItem("todate", $scope.toDate3);

            var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate3);
            var totimestamp = FromdateTodateFactory.fromdate($scope.toDate3);
            var standardid = $scope.standarddata3;
            var productid = 1;

            $scope.data3 = [];
            $scope.labels3 = ["Standard Usage"];
            $scope.series3 = [];

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
                    var schoolidlist = [];
                    var schooldata = response.data.schoolgroup[2].school_id_list;
                    var schooldetails = response.data.school_detail;

                    angular.forEach(schooldata, function (value, key) {
                        schoolidlist.push(value);
                        $scope.series3.push(schooldetails[value].school_name);
                    });

                    function allschoolstandardusageRecursive(start, end) {
                        if (start > end - 1) {
                            dataModalServices.closeModal();
                            $scope.showsLearnreport3 = true;
                            return;
                        }

                        var school_id = schoolidlist[start];

                        var urlPath = dashboardServices.standardLevelUsage(productid, school_id, fromtimestamp, totimestamp);
                        ajaxCallsFactory.getCall(urlPath)
                            .then(function (response1) {
                                var schoolstandardusagedata = response1.data.data;
                                console.log(school_id);
                                console.log(schoolstandardusagedata);
                                var standardusagedata = [];

                                if (schoolstandardusagedata[standardid]) {
                                    $scope.data3.push({
                                        schoolid: school_id,
                                        schoolname: schooldetails[school_id].school_name,
                                        usage: convertHourServices.convertDurationToHour(schoolstandardusagedata[standardid].duration)
                                    });

                                } else {
                                    $scope.data3.push({
                                        schoolid: school_id,
                                        schoolname: schooldetails[school_id].school_name,
                                        usage: 0
                                    });
                                    /*standardusagedata.push(0);*/
                                }

                                /*$scope.data3.push(standardusagedata);*/

                                allschoolstandardusageRecursive(start + 1, end);
                            });
                    }

                    allschoolstandardusageRecursive(0, schoolidlist.length);
                }, function (error) {
                    console.log("can not get product usage data backend");
                    dataModalServices.closeModal();
                });

        }
    });
