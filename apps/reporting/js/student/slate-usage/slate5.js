angular.module('sledstudio')
    .controller('Slate5ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, tableOptionService) {
        $scope.tableOption5 = tableOptionService.options();

        $scope.today5 = function () {
            var formdate = sessionStorage.getItem("formdate");
            var todate = sessionStorage.getItem("todate");
            if (formdate == null && todate == null) {
                $scope.fromDate5 = null;
                $scope.toDate5 = null;
            } else {
                $scope.fromDate5 = new Date(formdate);
                $scope.toDate5 = new Date(todate);
            }
        };

        $scope.clear = function () {
            $scope.fromDate5 = null;
            $scope.toDate5 = null;
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

        $scope.getStandardData5 = function () {
            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    $scope.standardanalysis5 = [];

                    for (var stdkey in response.data.standard_subject_map)
                        $scope.standardanalysis5.push(stdkey)

                }, function (error) {
                    console.log("can not get slate json file")
                });
        }
        $scope.getStandardData5();

        $scope.getsubjectdata5 = function () {
            var standard_id = $scope.std_analysis5;

            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    var subjectidlist = response.data.standard_subject_map[standard_id];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectnamelist = response1.data.subject;
                            $scope.subjectdata5 = [];

                            angular.forEach(subjectidlist, function (value, key) {
                                this.push({sub_id: value, sub_name: subjectnamelist[value].name});
                            }, $scope.subjectdata5);

                        }, function (error) {
                            console.log("can not get stndard data dictionary json file")
                        });
                }, function (error) {
                    console.log("can not get stndard data slate json file")
                });
        }

        $scope.getDivisionData5 = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    var divId = response.data.standard_division_map[$scope.std_analysis5];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            $scope.divanalysis5 = [];

                            for (var k in divId)
                                $scope.divanalysis5.push({
                                    divid: divId[k],
                                    divname: response1.data.division[divId[k]].name
                                })
                        }, function (error) {
                            console.log("division data not define dictionary json file")
                        });
                }, function (error) {
                    console.log("standard_division_map data not define school json file")
                });
        }

        $scope.loadslate5report = function () {
            dataModalServices.openMoldal();
            $scope.showslate5table = false;
            $scope.showerrromsg5 = false;
            $scope.errorMsg = JSON.parse(sessionStorage.getItem("uiTextConfig")).grapherrormessage;

            sessionStorage.setItem("formdate", $scope.fromDate5);
            sessionStorage.setItem("todate", $scope.toDate5);

            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate5);
            var totimestamp = FromdateTodateFactory.todate($scope.toDate5);
            var subjectid = $scope.sub_analysis5;
            var standard_id = $scope.std_analysis5;
            var divisionid = $scope.div_analysis5;
            var data = JSON.stringify({"school_id": school_id, "standard_id": standard_id, "division_id": divisionid});

            var filterdata = JSON.stringify({
                "filters_long": {"standardId": standard_id, "divisionId": divisionid, "subjectId": subjectid},
                "filters_string": {"userRole": "student"},
                "aggregation_keys": ["userId"]
            });

            var urlPath = dashboardServices.rolewisefilterusagedata(school_id, fromtimestamp, totimestamp);
            ajaxCallsFactory.postCall(urlPath, filterdata)
                .then(function (response) {
                    var studentusagedataid = response.data.data;

                    var urlPath1 = dashboardServices.getStudentDetails(data);
                    ajaxCallsFactory.getCall(urlPath1)
                        .then(function (response1) {
                            var studentDetailsdata = response1.data.data;

                            $scope.studentusagedata = [];

                            angular.forEach(studentusagedataid, function (value, key) {
                                this.push({
                                    name: studentDetailsdata[key].user_detail.first_name + " " + studentDetailsdata[key].user_detail.last_name,
                                    duration: value.duration
                                });
                            }, $scope.studentusagedata);

                            dataModalServices.closeModal();

                            if ($scope.studentusagedata.length == 0) {
                                $scope.showslate5table = false;
                                $scope.showerrromsg5 = true;
                            } else {
                                $scope.showslate5table = true;
                                $scope.showerrromsg5 = false;
                            }

                        }, function (error) {
                            console.log("can not get student details data api");
                            dataModalServices.closeModal();
                        });

                }, function (error) {
                    console.log("can not get student usage data api");
                    dataModalServices.closeModal();
                });
        }
    });
