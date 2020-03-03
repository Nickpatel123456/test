angular.module('sledstudio')
    .controller('sLate2ReportController', function ($scope, FromdateTodateFactory, ajaxCallsFactory, dashboardServices, barchartcolorServices, dataModalServices, convertHourServices) {
        $scope.roletypename2 = dashboardServices.roleTypeName();
        $scope.today2 = function () {
            var formdate = sessionStorage.getItem("formdate");
            var todate = sessionStorage.getItem("todate");
            if (formdate == null && todate == null) {
                $scope.fromDate2 = null;
                $scope.toDate2 = null;
            } else {
                $scope.fromDate2 = new Date(formdate);
                $scope.toDate2 = new Date(todate);
            }
        };

        $scope.clear = function () {
            $scope.fromDate2 = null;
            $scope.toDate2 = null;
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

        $scope.getsubjectdata = function () {
            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    var subjectusagelimitation = response.data.standard_subject_map;
                    var subjectidlist1 = [];

                    angular.forEach(subjectusagelimitation, function (value, key) {
                        angular.forEach(value, function (value1, key1) {
                            this.push(value1);
                        }, subjectidlist1);
                    });

                    function onlyUnique(value, index, self) {
                        return self.indexOf(value) === index;
                    }

                    var subjectidlist = subjectidlist1.filter(onlyUnique);

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectnamedata = response1.data.subject;
                            $scope.subjectnamelist = [];

                            for (var i = 0; i < subjectidlist.length; i++) {
                                $scope.subjectnamelist.push({
                                    id: subjectidlist[i],
                                    name: subjectnamedata[subjectidlist[i]].name
                                })
                            }
                        }, function (error) {
                            console.log("can not get subject_usage_limitation in slean json file");
                        });

                }, function (error) {
                    console.log("can not get subject_usage_limitation in slean json file");
                });
        }
        $scope.getsubjectdata();

        $scope.loadsLateReport2 = function () {
            dataModalServices.openMoldal();
            $scope.showreport2 = false;
            var selectedrole = $scope.roletype2;

			sessionStorage.setItem("formdate", $scope.fromDate2);
			sessionStorage.setItem("todate", $scope.toDate2);

            var fromTimestamp = FromdateTodateFactory.fromdate($scope.fromDate2);
            var toTimestamp = FromdateTodateFactory.fromdate($scope.toDate2);
            var subject_id = $scope.subjectanalysis2;
            $scope.data2 = [];
            var productname = "slate";
            $scope.lables2 = ["Subject Usage"];

            $scope.options2 = {
                scales: {
                    xAxes: [{barThickness: 20}],
                    yAxes: [{
                        ticks: {beginAtZero: true},
                        scaleLabel: {display: true, labelString: 'No. of Hours of Usage', fontSize: 15}
                    }]
                }, legend: {display: true}
            };
            $scope.chartcolor2 = barchartcolorServices.coloschart();

            ajaxCallsFactory.getCall(schoolgroup_config)
                .then(function (response) {
                    var schgroup = response.data.schoolgroup[2].school_id_list;
                    var schooldetails = response.data.school_detail;
                    var schoolidlist = [];
                    $scope.schoolnamelist2 = [];

                    angular.forEach(schgroup, function (value, key) {
                        schoolidlist.push(value);
                        $scope.schoolnamelist2.push(schooldetails[value].school_name);
                    });

                    function schooldataRecursive2(start, end) {
                        if (start > end - 1) {
                            dataModalServices.closeModal();
                            $scope.showreport2 = true;
                            return;
                        }
                        var schoolId = schoolidlist[start];
                        var filterdata = JSON.stringify({
                            "filters_long": {"subjectId": subject_id},
                            "filters_string": {"userRole": selectedrole},
                            "aggregation_keys": ["subjectId"]
                        });
                        var urlPath = dashboardServices.rolewisefilterusagedata(schoolId, fromTimestamp, toTimestamp);
                        ajaxCallsFactory.postCall(urlPath, filterdata)
                            .then(function (response1) {
                                var schoolsubjectdata = response1.data.data;
                                var subjectusagedata = [];

                                if (schoolsubjectdata[subject_id]) {
                                    $scope.data2.push({
                                        schoolid: schoolId,
                                        schoolname: schooldetails[schoolId].school_name,
                                        usage: convertHourServices.convertDurationToHour(schoolsubjectdata[subject_id].duration)
                                    });

                                    /*var hourconvert = convertHourServices.convertDurationToHour(schoolsubjectdata[subject_id].duration);
                                    subjectusagedata.push(hourconvert);*/
                                } else {
                                    $scope.data2.push({
                                        schoolid: schoolId,
                                        schoolname: schooldetails[schoolId].school_name,
                                        usage: 0
                                    });
                                    /*subjectusagedata.push(0);*/
                                }
                              /*  $scope.data2.push(subjectusagedata);*/
                                schooldataRecursive2(start + 1, end);
                            }, function (error) {
                                dataModalServices.closeModal();
                                console.log("can not get product usage data check api path");
                            });

                    }

                    schooldataRecursive2(0, schoolidlist.length);
                }, function (error) {
                    console.log("can not get school details check dictonary json");
                    dataModalServices.closeModal();
                });
        }
    });
