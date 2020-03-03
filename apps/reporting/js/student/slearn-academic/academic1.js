angular.module('sledstudio')
    .controller('Academic1LevelController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, tableOptionService) {
        $scope.tableOption1 = tableOptionService.options();

        $scope.clear = function () {
            $scope.fromDate = null;
            $scope.toDate1 = null;
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

        $scope.getsubjectdata1 = function () {
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var subjectusagelimitation = response.data.subject_usage_limitation;

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectdetails = response1.data.subject;
                            $scope.subjectdata1 = [];

                            for (var key in subjectusagelimitation)
                                $scope.subjectdata1.push({sub_id: key, sub_name: subjectdetails[key].name})

                        }, function (error) {
                            console.log("can not get Dicttonary data school json file")
                        });

                }, function (error) {
                    console.log("can not get stndard data school json file")
                });
        }
        $scope.getsubjectdata1();

        $scope.loadAcademic1Report = function () {
            dataModalServices.openMoldal();
            $scope.showAcademic1Report = false;
            $scope.errorMsg1 = false;
            $scope.showtable1 = false;

            var subjectid = $scope.sub_analysis1;
            var school_id = sessionStorage.getItem("schoolid");
            var urlPath = dashboardServices.getStudenCountSchool(school_id, subjectid);
            $scope.data1 = [];
            $scope.labels1 = [];
            $scope.floorwisestudentdata = [];
            $scope.options1 = {
                scales: {
                    xAxes: [{barThickness: 30}],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true, userCallback: function (label, index, labels) {
                                if (Math.floor(label) === label) {
                                    return label;
                                }
                            }
                        }, scaleLabel: {display: true, labelString: 'No. of Students', fontSize: 15}
                    }]
                }, legend: {display: false}
            };
            $scope.chartcolor1 = barchartcolorServices.coloschart();

            ajaxCallsFactory.getCall(urlPath)
                .then(function (response) {
                    for (var k in response.data.data) {
                        $scope.labels1.push(k);
                        $scope.data1.push(response.data.data[k]);
                    }

                    function recurseiveStudentDetailsFloorWise(startIndex, endIndex) {
                        if (startIndex > endIndex - 1) {
                            dataModalServices.closeModal();
                            $scope.showAcademic1Report = true;
                            if ($scope.floorwisestudentdata.length == 0) {
                                $scope.errorMsg1 = true;
                                $scope.errorMsg = "No data Avaliable for this combination";
                            } else {
                                $scope.showtable1 = true;
                            }
                            return;
                        }

                        var urlPath1 = dashboardServices.getStudentDetailsFloorWise(school_id, subjectid, $scope.labels1[startIndex]);
                        ajaxCallsFactory.getCall(urlPath1)
                            .then(function (response1) {
                                var floorStundentData = response1.data.data;

                                ajaxCallsFactory.getCall(dictionary)
                                    .then(function (response2) {
                                        var divisiondata = response2.data.division;
                                        var studentdata1 = [];

                                        for (var k in floorStundentData) {
                                            var stundentdivisionid = floorStundentData[k].student_detail.division_id
                                            studentdata1.push({
                                                data: floorStundentData[k],
                                                divisonname: divisiondata[stundentdivisionid]
                                            })
                                        }

                                        $scope.floorwisestudentdata.push({
                                            floorid: $scope.labels1[startIndex],
                                            studentdata: studentdata1
                                        });

                                        recurseiveStudentDetailsFloorWise(startIndex + 1, endIndex);
                                    }, function (error) {
                                        console.log("Cannot get division data");
                                        dataModalServices.closeModal();
                                    });

                            }, function (error) {
                                console.log("Cannot get the floor wise student details");
                                dataModalServices.closeModal();
                            });

                    }

                    recurseiveStudentDetailsFloorWise(0, $scope.labels1.length);
                }, function (error) {
                    console.log("Cannot count how many student in the school!!");
                    dataModalServices.closeModal();
                });
        }

    });
