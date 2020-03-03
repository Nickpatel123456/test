angular.module('sledstudio')
    .controller('Slate7ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, tableOptionService) {
        $scope.tableOption7 = tableOptionService.options();

        $scope.today7 = function () {
            var formdate = sessionStorage.getItem("formdate");
            var todate = sessionStorage.getItem("todate");
            if (formdate == null && todate == null) {
                $scope.fromDate7 = null;
                $scope.toDate7 = null;
            } else {
                $scope.fromDate7 = new Date(formdate);
                $scope.toDate7 = new Date(todate);
            }
        };

        $scope.clear = function () {
            $scope.fromDate7 = null;
            $scope.toDate7 = null;
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

        $scope.getStandardData7 = function () {
            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    $scope.standardanalysis7 = [];

                    for (var stdkey in response.data.standard_subject_map)
                        $scope.standardanalysis7.push(stdkey)

                }, function (error) {
                    console.log("can not get slate json file")
                });
        }
        $scope.getStandardData7();

        $scope.getsubjectdata7 = function () {
            var standard_id = $scope.std_analysis7;

            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    var subjectidlist = response.data.standard_subject_map[standard_id];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectnamelist = response1.data.subject;
                            $scope.subjectdata7 = [];

                            angular.forEach(subjectidlist, function (value, key) {
                                this.push({sub_id: value, sub_name: subjectnamelist[value].name});
                            }, $scope.subjectdata7);

                        }, function (error) {
                            console.log("can not get stndard data dictionary json file")
                        });
                }, function (error) {
                    console.log("can not get stndard data slate json file")
                });
        }

        $scope.getDivisionData7 = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    var divId = response.data.standard_division_map[$scope.std_analysis7];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            $scope.divanalysis7 = [];

                            for (var k in divId)
                                $scope.divanalysis7.push({
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

        $scope.loadslate7report = function () {
            $scope.showtable7 = false;
            dataModalServices.openMoldal();

            sessionStorage.setItem("formdate", $scope.fromDate7)
            sessionStorage.setItem("todate", $scope.toDate7)

            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = FromdateTodateFactory.fromdate($scope.fromDate7);
            var totimestamp = FromdateTodateFactory.todate($scope.toDate7);
            var subjectid = $scope.sub_analysis7;
            var standard_id = $scope.std_analysis7;
            var divisionid = $scope.div_analysis7;
            var roleType = "student";
            var data = JSON.stringify({"school_id": school_id, "standard_id": standard_id, "division_id": divisionid});

            $scope.studentsLateChapterUsageData = [];
            $scope.errorMsg = JSON.parse(sessionStorage.getItem("uiTextConfig")).grapherrormessage;

            var urlPath = dashboardServices.getStudentDetails(data);
            ajaxCallsFactory.getCall(urlPath)
                .then(function (response) {
                    var studentDetailsData = response.data.data;

                    var urlPath1 = dashboardServices.rolewisesLateChapterUsage(subjectid, school_id, fromtimestamp, totimestamp, roleType, data);
                    ajaxCallsFactory.getCall(urlPath1)
                        .then(function (response1) {
                            var studentChapterUsageData = response1.data.data;

                            ajaxCallsFactory.getCall(slateTextBookChapter_config)
                                .then(function (response3) {
                                    var textbookchapternamelist = response3.data;

                                    angular.forEach(studentChapterUsageData, function (value, key) {
                                        var studentname = studentDetailsData[key].user_detail.first_name + " " + studentDetailsData[key].user_detail.last_name;
                                        var sem1Chapter = [];
                                        var sem2Chapter = [];

                                        angular.forEach(value, function (value1, key1) {
                                            var semid = key1.charAt(1);
                                            if (semid == 1) {
                                                sem1Chapter.push({
                                                    duration: value1.duration,
                                                    chaptername: textbookchapternamelist[key1].name.guj
                                                });
                                            } else if (semid == 2) {
                                                sem2Chapter.push({
                                                    duration: value1.duration,
                                                    chaptername: textbookchapternamelist[key1].name.guj
                                                });
                                            }
                                        });

                                        $scope.studentsLateChapterUsageData.push({
                                            name: studentname,
                                            sem1: sem1Chapter,
                                            sem2: sem2Chapter,
                                        })
                                    });

                                    $scope.showtable7 = true;
                                    dataModalServices.closeModal();

                                }, function (error) {
                                    console.log("can not get student chapter usage data in backend api");
                                    dataModalServices.closeModal();
                                });

                        }, function (error) {
                            console.log("can not get student chapter usage data in backend api");
                            dataModalServices.closeModal();
                        });

                }, function (error) {
                    console.log("can not get teacherDetails data in backend api");
                    dataModalServices.closeModal();
                });

        }
    });
