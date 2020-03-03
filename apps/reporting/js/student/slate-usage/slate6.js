angular.module('sledstudio')
    .controller('Slate6ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices) {
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


        $scope.loadslate6report = function () {
            dataModalServices.openMoldal();
            $scope.showgraph6 = false;

            sessionStorage.setItem("formdate", $scope.fromDate6)
            sessionStorage.setItem("todate", $scope.toDate6)

            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate6);
            var totimestamp = FromdateTodateFactory.todate($scope.toDate6);

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

            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    var stdSubMap = response.data.standard_subject_map;
                    var standardIdList = Object.keys(stdSubMap);

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectNameList = response1.data.subject;
                            $scope.sLateStudentStdSubUsage = {};

                            function stdWiseSubUsage(start, end) {
                                if (start > end - 1) {
                                    $scope.showgraph6 = true;
                                    dataModalServices.closeModal();
                                    return;
                                }

                                var stdId = standardIdList[start];
                                var subjectName = [];

                                var filterdata = JSON.stringify({
                                    "filters_long": {"standardId": stdId},
                                    "filters_string": {"userRole": "student"},
                                    "aggregation_keys": ["subjectId"]
                                });

                                var urlPath = dashboardServices.rolewisefilterusagedata(school_id, fromtimestamp, totimestamp);
                                ajaxCallsFactory.postCall(urlPath, filterdata)
                                    .then(function (response2) {
                                        var studentSubUsage = response2.data.data;
                                        var data = [];

                                        for (var value of Object.values(stdSubMap[stdId])) {
                                            subjectName.push(subjectNameList[value].name.gj);
                                            if (studentSubUsage[value]) {
                                                data.push(convertHourServices.convertDurationToHour(studentSubUsage[value].duration));
                                            } else {
                                                data.push(0);
                                            }
                                        }

                                        $scope.sLateStudentStdSubUsage[stdId] = {
                                            labels: subjectName,
                                            data: new Array(data)
                                        }
                                        stdWiseSubUsage(start + 1, end);
                                    }, function (error) {
                                        console.log("Can not get sLate Usage Data");
                                    });
                            }

                            stdWiseSubUsage(0, standardIdList.length);
                        }, function (error) {
                            console.log("Dictionary Json Not Found.");
                        });
                }, function (error) {
                    console.log("sLate Json Not Found.");
                });
        }
    });