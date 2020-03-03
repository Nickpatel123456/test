angular.module('sledstudio')
    .controller('Slearn5ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, tableOptionService) {
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


        $scope.getsubjectdata5 = function () {
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var subjectusagelimitation = response.data.subject_usage_limitation;

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectdetails = response1.data.subject;
                            $scope.subjectdata5 = [];

                            for (var key in subjectusagelimitation)
                                $scope.subjectdata5.push({sub_id: key, sub_name: subjectdetails[key].name})

                        }, function (error) {
                            console.log("can not get Dicttonary data school json file")
                        });

                }, function (error) {
                    console.log("can not get stndard data school json file")
                });
        }
        $scope.getsubjectdata5();

        $scope.getStandardData5 = function () {
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var stddata = response.data.subject_usage_limitation[$scope.sub_analysis5];

                    $scope.standardanalysis5 = [];
                    for (var key in stddata) {
                        if (key > 2) {
                            $scope.standardanalysis5.push(key);
                        }
                    }

                }, function (error) {
                    console.log("can not get slearn_config data")
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
                            console.log("can not get Dicttonary data school json file")
                        });
                }, function (error) {
                    console.log("can not get slearn_config data")
                });
        }

        $scope.loadslearn5report = function () {
            dataModalServices.openMoldal();
            $scope.showslearn5table = false;
            $scope.showerrromsg5 = false;
            $scope.errorMsg = JSON.parse(sessionStorage.getItem("uiTextConfig")).grapherrormessage;

            sessionStorage.setItem("formdate", $scope.fromDate5)
            sessionStorage.setItem("todate", $scope.toDate5)

            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate5);
            var totimestamp = FromdateTodateFactory.todate($scope.toDate5);
            var subjectid = $scope.sub_analysis5;
            var standard_id = $scope.std_analysis5;
            var divisionid = $scope.div_analysis5;
            var data = JSON.stringify({"school_id": school_id, "standard_id": standard_id, "division_id": divisionid});
            var urlPath = dashboardServices.sLarnSubjectUsage(subjectid, fromtimestamp, totimestamp, data);

            ajaxCallsFactory.getCall(urlPath)
                .then(function (response) {
                    var studentUsageData = response.data.data;

                    var urlPath1 = dashboardServices.getStudentDetails(data);
                    ajaxCallsFactory.getCall(urlPath1)
                        .then(function (response1) {
                            var studentDetails = response1.data.data;
                            $scope.sLarnSubjectUsgData = [];

                            var urlPath2 = dashboardServices.sLarnSubjectCompletionUsage(subjectid, data);
                            ajaxCallsFactory.getCall(urlPath2)
                                .then(function (response2) {
                                    var subjectCompletedPercantage = response2.data.data;

                                    for (var studentKeyId in studentUsageData) {
                                        if (studentKeyId) {
                                            $scope.sLarnSubjectUsgData.push({
                                                studentdata: studentDetails[studentKeyId],
                                                duration: studentUsageData[studentKeyId].duration,
                                                completePercantage: subjectCompletedPercantage[studentKeyId]
                                            })
                                        }
                                    }

                                    if ($scope.sLarnSubjectUsgData.length == 0) {
                                        $scope.showslearn5table = false;
                                        $scope.showerrromsg5 = true;
                                    } else {
                                        $scope.showslearn5table = true;
                                        $scope.showerrromsg5 = false;
                                    }
                                    dataModalServices.closeModal();
                                }, function (error) {
                                    console.log("can not get sLate Subject Usage Data");
                                    dataModalServices.closeModal();
                                });
                        }, function (error) {
                            console.log("can not get sLate Subject Usage Data");
                            dataModalServices.closeModal();
                        });

                }, function (error) {
                    console.log("can not get sLate Subject Usage Data");
                    dataModalServices.closeModal();
                });
        }
    });
