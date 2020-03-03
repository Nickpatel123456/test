angular.module('sledstudio')
    .controller('DashboardReportController', function (errorFactory, $scope, ajaxCallsFactory, $filter, geturlServices, $window, goBackServices, FromdateTodateFactory, convertHourServices, dashboardServices, dataModalServices, weekyeardataServices, FromteDateFactory, $rootScope, $compile, tableOptionService) {
        $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
        $scope.schoolname = JSON.parse(sessionStorage.getItem("schoolsdetails")).school_name;
        $scope.tableOption1 = tableOptionService.options();

        $scope.goBack = function () {
            goBackServices.goBackPage($window);
        }

        $scope.getsubjectwisestudent = (function () {
            $scope.showdashboard = false;
            dataModalServices.openMoldal();

            //this ajax get subject id list using subject_usage_limitation object value
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var subjectusagelimit = response.data.subject_usage_limitation;
                    var subidlist = [];
                    for (var subkey in subjectusagelimit) {
                        subidlist.push(eval(subkey));
                    }
                    subidlist.sort(function (a, b) {
                        return a - b
                    });

                    //this ajax get the subject name
                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectnamelist = response1.data.subject;

                            Date.prototype.addDays = function (days) {
                                this.setDate(this.getDate() + parseInt(days));
                                return this;
                            };

                            //this below code declare variable is get current week fromtimestamp & toTimeStamp
                            var mydate = new Date();
                            var currentweekNum = FromteDateFactory.getWeekNumber(mydate);
                            var currentWeekFromTimeStamp = FromdateTodateFactory.fromdate(FromteDateFactory.dateFromWeekNumber(currentweekNum[0], currentweekNum[1]));
                            var currentWeekToTimeStamp = FromdateTodateFactory.todate(FromteDateFactory.dateFromWeekNumber(currentweekNum[0], currentweekNum[1]).addDays(6));
                            var currentWeekTotalWeekNo = 1;

                            //this below code is get the currentmonth start fromtimestamp & totimestamp
                            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                            var firstDay = new Date(y, m, 1);
                            var lastDay = new Date(y, m + 1, 0);
                            var currentMonthFromTimeStamp = FromdateTodateFactory.fromdate(firstDay);
                            var currentMonthToTimeStamp = FromdateTodateFactory.todate(lastDay);
                            var currentMonthTotalWeekNo = FromteDateFactory.weekCount(currentweekNum[0], m + 1);

                            //this below code is get the currentAcademicYear fromtimestamp & totimestamp
                            var currentYearTotalWeekNo = weekyeardataServices.weekyeardatafunction().length;
                            var getacademicyearData = weekyeardataServices.weekyeardatafunction();
                            var currentYearFromTimestamp = FromdateTodateFactory.fromdate(FromteDateFactory.dateFromWeekNumber(getacademicyearData[0].weekyear, getacademicyearData[0].weekno));
                            var currentYearToTimestamp = FromdateTodateFactory.todate(FromteDateFactory.dateFromWeekNumber(getacademicyearData[currentYearTotalWeekNo - 1].weekyear, getacademicyearData[currentYearTotalWeekNo - 1].weekno).addDays(6));

                            //this ajax get the school wise subject total stundent
                            $.ajax({
                                type: "POST",
                                url: skiilreport_backend_api + 'student/schoolwisecount',
                                data: JSON.stringify({"name": "subject"}),
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: true,
                                success: function (data) {
                                    var schoolsubjectwiseTotalStudent = data.data[sessionStorage.getItem("schoolid")][0];

                                    $scope.subjectExpActUsage = [];
                                    $scope.subjectnamedata = [];
                                    angular.forEach(subidlist, function (value, key) {
                                        var subweekusagesecond;
                                        angular.forEach(subjectusagelimit[value], function (value1, key1) {
                                            subweekusagesecond = value1.duration_usage_limit;
                                        })
                                        this.push({
                                            subid: value,
                                            subname: subjectnamelist[value].name.gj,
                                            weeksecondusage: subweekusagesecond
                                        });
                                    }, $scope.subjectnamedata);

                                    var schoolid = sessionStorage.getItem("schoolid");
                                    var expectedusage = 0;
                                    var actualusage = 0;
                                    $scope.flooridlist = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                                    $scope.subjectfloorStundetdetails = {};

                                    function schoolWeekMonthYearUsage(start, end) {
                                        if (start > end - 1) {
                                            dataModalServices.closeModal();
                                            $scope.showdashboard = true;
                                            return;
                                        }
                                        var subid = $scope.subjectnamedata[start].subid;
                                        var weekusagelimit = $scope.subjectnamedata[start].weeksecondusage;
                                        var schoolsubjectTotalStudent = schoolsubjectwiseTotalStudent[subid];
                                        var temp = [];

                                        //this ajax send Current Week From and To Timestamp
                                        var currentweekUrlPath = dashboardServices.sLearnSubjctUsage('slearn', schoolid, currentWeekFromTimeStamp, currentWeekToTimeStamp, 'student');
                                        ajaxCallsFactory.getCall(currentweekUrlPath)
                                            .then(function (response2) {
                                                var weekwisedata = response2.data.data;
                                                expectedusage = schoolsubjectTotalStudent * weekusagelimit * currentWeekTotalWeekNo;
                                                actualusage = 0;
                                                if (weekwisedata[subid]) {
                                                    actualusage = weekwisedata[subid];
                                                }
                                                temp.push(expectedusage, actualusage);

                                                //this ajax send Current Month From and To Timestamp
                                                var currentMonthUrlPath = dashboardServices.sLearnSubjctUsage('slearn', schoolid, currentMonthFromTimeStamp, currentMonthToTimeStamp, 'student');
                                                ajaxCallsFactory.getCall(currentMonthUrlPath)
                                                    .then(function (response3) {
                                                        var monthwisedata = response3.data.data;
                                                        expectedusage = schoolsubjectTotalStudent * weekusagelimit * currentMonthTotalWeekNo;
                                                        actualusage = 0;
                                                        if (monthwisedata[subid]) {
                                                            actualusage = monthwisedata[subid];
                                                        }
                                                        temp.push(expectedusage, actualusage);

                                                        //this ajax send Current Year From and To Timestamp
                                                        var currentYearUrlPath = dashboardServices.sLearnSubjctUsage('slearn', schoolid, currentYearFromTimestamp, currentYearToTimestamp, 'student');
                                                        ajaxCallsFactory.getCall(currentYearUrlPath)
                                                            .then(function (response4) {
                                                                var yearwisedata = response4.data.data;
                                                                expectedusage = schoolsubjectTotalStudent * weekusagelimit * currentYearTotalWeekNo;
                                                                actualusage = 0;
                                                                if (yearwisedata[subid]) {
                                                                    actualusage = yearwisedata[subid];
                                                                }
                                                                temp.push(expectedusage, actualusage);

                                                                $scope.subjectExpActUsage.push({
                                                                    subname: $scope.subjectnamedata[start].subname,
                                                                    data: temp
                                                                })

                                                                //this ajax get subject wise floor total stundent
                                                                var subjectfloortUrlPath = dashboardServices.getStudenCountSchool(schoolid, subid);
                                                                ajaxCallsFactory.getCall(subjectfloortUrlPath)
                                                                    .then(function (response5) {
                                                                        var subjectfloowisestudentdata = response5.data.data;
                                                                        var totalstudentfloorwise = 0;
                                                                        angular.forEach(subjectfloowisestudentdata, function (value, index) {
                                                                            totalstudentfloorwise += value;
                                                                        });

                                                                        var difftotalstudent = schoolsubjectTotalStudent - totalstudentfloorwise;
                                                                        var floorstudentdata = [schoolsubjectTotalStudent];

                                                                        angular.forEach($scope.flooridlist, function (value, index) {
                                                                            if (value == 0) {
                                                                                floorstudentdata.push(difftotalstudent);
                                                                            } else if (subjectfloowisestudentdata[value]) {
                                                                                floorstudentdata.push(subjectfloowisestudentdata[value]);
                                                                            } else {
                                                                                floorstudentdata.push(0);
                                                                            }
                                                                        });

                                                                        var floorstudent_data = {
                                                                            subname: $scope.subjectnamedata[start].subname,
                                                                            totalstudent: floorstudentdata,
                                                                            floordata: subjectfloowisestudentdata
                                                                        };

                                                                        $scope.subjectfloorStundetdetails[subid] = floorstudent_data;

                                                                        schoolWeekMonthYearUsage(start + 1, end);

                                                                    }, function (error) {
                                                                        console.log("Cannot count how many student in the school!!");
                                                                        dataModalServices.closeModal();
                                                                    });
                                                            });
                                                    });

                                            });
                                    }

                                    schoolWeekMonthYearUsage(0, $scope.subjectnamedata.length);
                                }
                            });
                        });
                });
        }());

        $('#accordion').on('shown.bs.collapse', function (e) {
            var id = $(e.target).prev().find("[id]")[0].id;
            navigateToElement(id);
        })

        $compile('#accordion')($scope);

        function navigateToElement(id) {
            $('#floordetailsModal').animate({
                scrollTop: $("#floordetailsModal").offset().top
            }, 1000);
        }

        $scope.getsubjectfloorwisedetails = function (subid, data) {
            $("#floordetailsModal").modal('show');
            $scope.imgurl = baselinkforfiles + "images/source.gif";
            $scope.showloading1 = true;
            $scope.errorMsg1 = false;
            $scope.showtable1 = false;
            $scope.floorwisestudentdata = [];

            var floorid = [];
            var schoolId = sessionStorage.getItem("schoolid");
            $scope.selectsubjectname = data.subname;

            for (var key in data.floordata) {
                floorid.push(key);
            }

            function recurseiveStudentDetailsFloorWise(start, end) {
                if (start > end - 1) {
                    $scope.showloading1 = false;

                    if ($scope.floorwisestudentdata.length == 0) {
                        $scope.errorMsg1 = true;
                        $scope.errorMsg = "No data Avaliable for this combination";
                    } else {
                        $scope.showtable1 = true;
                    }
                    return;
                }

                var urlPath1 = dashboardServices.getStudentDetailsFloorWise(schoolId, subid, floorid[start]);
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

                                $scope.floorwisestudentdata.push({floorid: floorid[start], studentdata: studentdata1});

                                recurseiveStudentDetailsFloorWise(start + 1, end);
                            }, function (error) {
                                console.log("Cannot get division data");
                                dataModalServices.closeModal();
                            });

                    }, function (error) {
                        console.log("Cannot get the floor wise student details");
                        dataModalServices.closeModal();
                    });

            }

            recurseiveStudentDetailsFloorWise(0, floorid.length);
        }
    });
