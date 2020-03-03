angular.module('sledstudio')
    .controller('ReportingController', function ($scope, errorFactory, basicFactory, $timeout, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, $window, FromdateTodateFactory, convertHourServices, dashboardServices, dataModalServices, $rootScope, weekyeardataServices, FromteDateFactory, tableOptionService) {
        //this below ajax call is auto loaded run this file
		$scope.tableOption1 = tableOptionService.options();
        ajaxCallsFactory.getCall(schoolgroup_config)
            .then(function (response) {
                var schoolgroupdata = response.data;

                ajaxCallsFactory.getCall(sledstudio_menu)
                    .then(function (response1) {
                        $rootScope.productmode = response1.data.product_mode;

                        //this if condition check click back button to check which ui show CLOUD_REPORTING or SCHOOL LEVEL
                        if (sessionStorage.getItem("severtype") == "SCHOOL") {
                            $scope.btnshow = true;
                            $scope.reportserver_type = "SCHOOL";
                            $scope.schoolname = schoolgroupdata.school_detail[sessionStorage.getItem("schoolid")].school_name;
                            sessionStorage.removeItem("severtype");
                        } else {
                            $scope.btnshow = false;
                            $scope.reportserver_type = response1.data.product_mode;

                            //this if condition is set the school id if servertype is server then get the school id is local storage
                            if ($scope.reportserver_type == "SCHOOL") {
                                var teacherschoolid = JSON.parse(localStorage.getItem("loginresponse")).user_detail.school_id;
                                sessionStorage.setItem("schoolid", teacherschoolid);
                                $scope.schoolname = schoolgroupdata.school_detail[sessionStorage.getItem("schoolid")].school_name;
                                $scope.getSchoolNameIndividualOrSchoolwise(teacherschoolid);
                            }
                        }
                        $scope.schoolwiseExpActUsage = [];
                        $scope.individualschoolreport = function () {
                            var data = JSON.parse(sessionStorage.getItem("schoolisolated"));
                            $scope.showExpActTable = false;

                            if ($scope.schoolwiseExpActUsage.length != 0) {
                                console.log("data is allready added");
                                $scope.showExpActTable = true;
                                $timeout($scope.getPerformance, 1000);
                            } else {
                                console.log("data is blank");
                                $scope.loadSchoolWiseExpActUsage('year');
                            }
                        };

                        if (sessionStorage.getItem("aggregationreport") == "aggregation") {
                            $scope.reportserver_type = "";
                            $scope.schoolreport = "aggregation";
                            sessionStorage.removeItem("aggregationreport");
                        }
                    }, function (error) {
                        console.log("can not get sledstudio json");
                    });

            }, function (error) {
                console.log("can not get schoolgroup report json");
            });

        var columnIdName = [];

        $scope.getPerformance = function () {
            console.log('performance function call success');
            columnIdName = [];
            $('table thead #tr th').each(function (i) {
                columnIdName.push({id: i, name: $(this).text().trim()});
            });

            var calculateColumnTotal = (function () {
                //loop for number of clumns
                var count = -1;
                for (var i = 2; i <= columnIdName.length + 1; i++) {
                    var value, theTotal = 0;
                    count++;
                    // nth child selector iterate table body td's
                    $("#tableSchoolData tbody td:nth-child(" + i + ")").each(function () {
                        value = $(this).html();
                        theTotal += parseFloat(value.replace(",", ""));
                        if (columnIdName[count].name == undefined) {
                            var per = theTotal / $scope.schoolwiseExpActUsage.length;
                            $("#tableSchoolData tfoot td:nth-child(" + i + ")").text(per.toFixed(2));
                        } else if (columnIdName[count].name === '%') {
                            var per = theTotal / $scope.schoolwiseExpActUsage.length;
                            $("#tableSchoolData tfoot th:nth-child(" + i + ")").text(per.toFixed(2));
                        } else {
                            // nth child selector iterate table footer td's
                            $("#tableSchoolData tfoot th:nth-child(" + i + ")").text(theTotal.toFixed(2));
                        }
                    });
                }
            });
            calculateColumnTotal();
        };

        $scope.loadSchoolWiseExpActUsage = function (showWeekMonthYear) {
            dataModalServices.openMoldal();
            $scope.showExpActTable = false;
            ajaxCallsFactory.getCall(schoolgroup_config)
                .then(function (response) {
                    $scope.schoolGroupJsonData = response.data;
                    $scope.schoolNameDetails = [];
                    for (var val of $scope.schoolGroupJsonData.schoolgroup[1].school_id_list) {
                        $scope.schoolNameDetails.push({
                            schoolid: val,
                            schoolname: $scope.schoolGroupJsonData.school_detail[val].school_name
                        })
                    }
                    dataModalServices.closeModal();
                    $scope.showExpActTable = true;
                });

            /*dataModalServices.openMoldal();
            $scope.showExpActTable = false;
            $scope.schoolwiseExpActUsage = [];
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response1) {
                    var subjectusagelimit = response1.data.subject_usage_limitation;
                    var subidlist = [];
                    for (var subkey in subjectusagelimit) {
                        subidlist.push(eval(subkey))
                    }

                    subidlist.sort(function (a, b) {
                        return a - b
                    });

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response2) {
                            var subjectnamelist = response2.data.subject;
                            $scope.subjectnamedata = [];
                            $scope.insrow = [];
                            angular.forEach(subidlist, function (value, key) {
                                var subweekusagesecond;
                                angular.forEach(subjectusagelimit[value], function (value1, key1) {
                                    subweekusagesecond = value1.duration_usage_limit;
                                });
                                this.push({
                                    subid: value,
                                    subname: subjectnamelist[value].name.gj,
                                    weeksecondusage: subweekusagesecond
                                });
                                $scope.insrow.push('Expected', 'Actual', ' % ')
                            }, $scope.subjectnamedata);
                            $scope.insrow.push('Expected', 'Actual', ' % ')
                            //this API get the school wise --> subject wise total student count
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
                                    var totalweek = 1;
                                    var schoolwisesubjectdata = data.data;

                                    Date.prototype.addDays = function (days) {
                                        this.setDate(this.getDate() + parseInt(days));
                                        return this;
                                    };

                                    var mydate = new Date();
                                    var currentweekNum = FromteDateFactory.getWeekNumber(mydate);

                                    if (showWeekMonthYear == 'year') {
                                        //this below code declare variable is get current week fromtimestamp & toTimeStamp
                                        totalweek = weekyeardataServices.weekyeardatafunction().length;
                                        var getacademicyearData = weekyeardataServices.weekyeardatafunction();
                                        var fromTimestamp = FromdateTodateFactory.fromdate(FromteDateFactory.dateFromWeekNumber(getacademicyearData[0].weekyear, getacademicyearData[0].weekno));
                                        var toTimestamp = FromdateTodateFactory.todate(FromteDateFactory.dateFromWeekNumber(getacademicyearData[totalweek - 1].weekyear, getacademicyearData[totalweek - 1].weekno).addDays(6));
                                        $scope.currentname = showWeekMonthYear;
                                    } else if (showWeekMonthYear == 'month') {
                                        //this below code is get the currentmonth start fromtimestamp & totimestamp
                                        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                                        var firstDay = new Date(y, m, 1);
                                        var lastDay = new Date(y, m + 1, 0);
                                        var fromTimestamp = FromdateTodateFactory.fromdate(firstDay);
                                        var toTimestamp = FromdateTodateFactory.todate(lastDay);
                                        totalweek = FromteDateFactory.weekCount(currentweekNum[0], m + 1);
                                        $scope.currentname = showWeekMonthYear;
                                    } else if (showWeekMonthYear == 'week') {
                                        //this below code declare variable is get current week fromtimestamp & toTimeStamp
                                        var fromTimestamp = FromdateTodateFactory.fromdate(FromteDateFactory.dateFromWeekNumber(currentweekNum[0], currentweekNum[1] - 1));
                                        var toTimestamp = FromdateTodateFactory.todate(FromteDateFactory.dateFromWeekNumber(currentweekNum[0], currentweekNum[1] - 1).addDays(6));
                                        $scope.currentname = showWeekMonthYear;
                                    }

                                    var schoolidlist = [];
                                    for (var key in schoolwisesubjectdata) {
                                        schoolidlist.push(key)
                                    }

                                    ajaxCallsFactory.getCall(schoolgroup_config)
                                        .then(function (response) {
                                            var schooldata = response.data;

                                            function schoolwisesubjectusageRecursive(start, end) {
                                                if (start > end - 1) {
                                                    dataModalServices.closeModal();
                                                    $scope.showExpActTable = true;
                                                    $timeout($scope.getPerformance, 1000);
                                                    return;
                                                }
                                                var schoolid = schoolidlist[start];
                                                var schoolSubUsgData = schoolwisesubjectdata[schoolid][0];

                                                var urlPath = dashboardServices.sLearnSubjctUsage('slearn', schoolid, fromTimestamp, toTimestamp, 'student');
                                                ajaxCallsFactory.getCall(urlPath)
                                                    .then(function (response2) {
                                                        var studentsubjectusagedata = response2.data.data;
                                                        var sumOfExpectedUsgae = 0;
                                                        var sumOfActualUsage = 0;

                                                        var temp = [];
                                                        angular.forEach($scope.subjectnamedata, function (value, key) {
                                                            var expectedusage = schoolSubUsgData[value.subid] * value.weeksecondusage * totalweek;
                                                            sumOfExpectedUsgae += expectedusage;
                                                            var actualusage = 0;

                                                            if (studentsubjectusagedata[value.subid]) {
                                                                actualusage = studentsubjectusagedata[value.subid];
                                                            }

                                                            sumOfActualUsage += actualusage;
                                                            var percentage = (actualusage * 100) / expectedusage;
                                                            this.push(convertHourServices.convertDurationToHourMin(eval(expectedusage)), convertHourServices.convertDurationToHourMin(eval(actualusage)), percentage);
                                                        }, temp);
                                                        var percentageTotal = (eval(sumOfActualUsage) * 100) / eval(sumOfExpectedUsgae);
                                                        temp.push(convertHourServices.convertDurationToHourMin(eval(sumOfExpectedUsgae)), convertHourServices.convertDurationToHourMin(eval(sumOfActualUsage)), percentageTotal);

                                                        $scope.schoolwiseExpActUsage.push({
                                                            schoolname: schooldata.school_detail[schoolid].school_name,
                                                            schoolid: schoolid,
                                                            subdata: temp
                                                        });
                                                        schoolwisesubjectusageRecursive(start + 1, end);
                                                    });
                                            }

                                            schoolwisesubjectusageRecursive(0, schoolidlist.length);
                                        });
                                }
                            });
                        });
                });*/
        }

        this.init = function () {
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
                sessionStorage.setItem("menuid", 4);
                $scope.btnshow = false;

                $scope.userrole = sessionStorage.getItem("user_role");
                $.ajax({
                    url: school_config,
                    type: 'get',
                    dataType: 'json',
                    error: function (data) {
                        alert("Error Loading JSON");
                    },
                    success: function (data1) {
                        $scope.serverrole = data1.server_detail.server_type;
                    }
                });

                $scope.imageurlpath = baselinkforfiles + "images/analytics.png";
                $scope.individualschoolimagepath = baselinkforfiles + "images/school.png";

                $scope.aggregationschoolimagepathsLearn = baselinkforfiles + "images/product1.png";
                $scope.aggregationschoolimagepathsLate = baselinkforfiles + "images/product2.png";

            }
        }

        this.init();

        //this function use redirect url
        $scope.reportshowPage = function (urlpath) {
            $window.location.href = "#" + urlpath;
        }

        //this function use show individual or aggregation ui for cloud
        $scope.showschoolreport = function (reportname) {
            $scope.reportserver_type = "";
            switch (reportname) {
                case "individual":
                    $scope.schoolreport = "individual";
                    $scope.individualschoolreport();
                    break;

                case "aggregation":
                    $scope.schoolreport = "aggregation";
                    break;
            }
        }

        $scope.goBack = function (directivename) {
            switch (directivename) {
                case "individual":
                    $scope.schoolreport = "individual";
                    $scope.reportserver_type = "";
                    $scope.individualschoolreport();
                    break;

                case "CLOUD_REPORTING":
                    $scope.reportserver_type = "CLOUD_REPORTING";
                    $scope.schoolreport = "";
                    break;
            }
        }

        //this function use cloud report set schoolid in sessionStorage
        $scope.showallreport = function (schooldata) {
            $scope.schoolreport = "";
            sessionStorage.setItem("schoolid", schooldata.schoolid);
            $scope.schoolname = schooldata.schoolname;
            $scope.btnshow = true;
            $scope.reportserver_type = "SCHOOL";
            console.log("admin school type")
            $scope.getSchoolNameIndividualOrSchoolwise(schooldata.schoolid);
        }

        $scope.getSchoolNameIndividualOrSchoolwise = function (school_id) {
            ajaxCallsFactory.getCall(schoolgroup_config)
                .then(function (response) {
                    var scholldetailsdata = response.data.school_detail[school_id];
                    sessionStorage.setItem("schoolsdetails", JSON.stringify(scholldetailsdata));
                }, function (error) {
                    console.log("can not get schoolgroup json");
                });
        }

        $scope.aggregatioSchoolReport = function (productname) {
            switch (productname) {
                case "sLearn":
                    $window.location.href = "#/sLearn-report";
                    break;

                case "sLate":
                    $window.location.href = "#/sLate-report";
                    break;
            }
        }
    })
    .directive('cloudReport', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/school-report/cloud-report.html'
        };
    })
    .directive('serverReport', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/school-report/server-report.html'
        };
    })
    .directive('individualschoolReport', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/school-report/individualschool-report.html'
        };
    })
    .directive('aggregationschoolReport', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/reporting/html/school-report/aggregationschool-report.html'
        };
    })
    .config(function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            responsive: true,
            events: false,
            tooltips: {
                enabled: false
            },
            hover: {
                animationDuration: 0
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = "black";
                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y + 6);
                        });
                    });
                }
            }
        });
    })
    .service("customeChartOptionsServices", function () {
        this.customeChartOptions = function (XstringName, YstringName, legendValue) {
            var dataarray = {
                scales: {
                    xAxes: [{
                        barThickness: 20,
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: XstringName,
                            fontSize: 15
                        }
                    }],
                    yAxes: [{
                        barThickness: 20,
                        scaleLabel: {
                            display: true,
                            labelString: YstringName,
                            fontSize: 15
                        },
                        ticks: {
                            callback: function (value, index, values) {
                                return parseFloat(value).toFixed(2);
                            },
                            autoSkip: true,
                            maxTicksLimit: 10,
                            stepSize: 2
                        }
                    }]
                },
                legend: {
                    display: legendValue
                }
            };
            return dataarray;
        }
    })
    .service("barchartcolorServices", function () {
        var colors = [
            {backgroundColor: 'rgba(78, 180, 189, 1)', borderColor: 'rgba(78, 180, 189, 1)'},
            {backgroundColor: 'rgb(255, 80, 80)', borderColor: 'rgb(255, 80, 80)'},
            {backgroundColor: 'rgb(38, 153, 0)', borderColor: 'rgb(38, 153, 0)'},
            {backgroundColor: 'rgb(204, 153, 0)', borderColor: 'rgb(204, 153, 0)'},
            {backgroundColor: 'rgb(140, 140, 140)', borderColor: 'rgb(140, 140, 140)'},
            {backgroundColor: 'rgb(255, 102, 0)', borderColor: 'rgb(255, 102, 0)'},
            {backgroundColor: 'rgb(51, 51, 204)', borderColor: 'rgb(51, 51, 204)'},
            {backgroundColor: 'rgb(204, 255, 153)', borderColor: 'rgb(204, 255, 153)'},
            {backgroundColor: 'rgb(51, 153, 102)', borderColor: 'rgb(51, 153, 102)'},
            {backgroundColor: 'rgb(255, 153, 0)', borderColor: 'rgb(255, 153, 0)'},
            {backgroundColor: 'rgb(77, 0, 153)', borderColor: 'rgb(77, 0, 153)'},
            {backgroundColor: 'rgb(204, 204, 255)', borderColor: 'rgb(204, 204, 255)'},
            {backgroundColor: 'rgb(204, 0, 255)', borderColor: 'rgb(204, 0, 255)'}
        ];

        this.coloschart = function () {
            return colors;
        };

        this.setdiifBarColor = function () {
            var barcolors = [{backgroundColor: [], borderColor: []}]
            barcolors[0].backgroundColor = ["#4eb4bd", "#ff5050", "#269900", "#cc9900", "#8c8c8c", "#ff6600", "#3333cc", "#ccff99", "#339966", "#ff9900", "#4d0099", "#ccccff", "#cc00ff"];
            barcolors[0].borderColor = ["#4eb4bd", "#ff5050", "#269900", "#cc9900", "#8c8c8c", "#ff6600", "#3333cc", "#ccff99", "#339966", "#ff9900", "#4d0099", "#ccccff", "#cc00ff"];
            return barcolors;
        };
    })
    .service("goBackServices", function (ajaxCallsFactory) {
        this.goBackPage = function ($window) {
            $window.location.href = "#/reporting";
            ajaxCallsFactory.getCall(sledstudio_menu)
                .then(function (response) {
                    var reportserver_type = response.data.product_mode;
                    if (reportserver_type == "CLOUD_REPORTING") {
                        sessionStorage.setItem("severtype", "SCHOOL");
                    }
                }, function (error) {
                    console.log("can not get schoolgroup report json");
                });
        }
    })
    .service("dashboardServices", function () {
        this.productUsageData = function (schoolId, roletype, fromTimestamp, toTimestamp) {
            var urlPath = backend_api_base + "um/report/productusage/role/" + roletype + "/school/" + schoolId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp;
            return urlPath;
        };

        this.rolewisefilterusagedata = function (schoolId, fromTimestamp, toTimestamp) {
            var urlPath = backend_api_base + "slate/dashboard/local/usage/subject/customaggregation/school/" + schoolId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp;
            return urlPath;
        }

        this.rolewisesLateChapterUsage = function (subjectId, schoolId, fromTimestamp, toTimestamp, roleType, data) {
            var urlPath = backend_api_base + "slate/dashboard/local/usage/peruser/perchapter/schoolclassroom/subject/" + subjectId + "/userRole/" + roleType + "/lin/" + fromTimestamp + "/lout/" + toTimestamp + "?payload=" + data;
            return urlPath;
        }

        this.standardSchoolUsage = function (productname, schoolId, standardId, fromTimestamp, toTimestamp) {
            var urlPath = backend_api_base + productname + "/dashboard/local/usage/persubject/school/" + schoolId + "/standard/" + standardId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp;
            return urlPath;
        };

        this.sLearnSubjctUsage = function (productname, schoolId, fromTimestamp, toTimestamp, roletype) {
            var urlPath = backend_api_base + productname + "/dashboard/local/usage/persubject/school/" + schoolId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp;
            return urlPath;
        };

        this.completeSleanSchoolLevelStudent = function (subjectId, schoolId) {
            var urlPath = backend_api_base + "slearn/dashboard/local/completionstatus/current/subject/" + subjectId + "/school/" + schoolId;
            return urlPath;
        };

        this.standardLevelUsage = function (productId, schoolId, fromTimestamp, toTimestamp) {
            var urlPath = backend_api_base + "um/report/productusage/schoolsstandard/product/" + productId + "/school/" + schoolId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp;
            return urlPath;
        };

        this.sLarnSubjectUsage = function (subjectId, fromTimestamp, toTimestamp, data) {
            var urlPath = backend_api_base + "slearn/dashboard/local/usage/peruser/schoolclassroom/subject/" + subjectId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp + "?payload=" + data;
            return urlPath;
        };

        this.sLarnSubjectCompletionUsage = function (subjectId, data) {
            var urlPath = backend_api_base + "slearn/dashboard/local/completionstatus/current/subject/" + subjectId + "/classroomusers?payload=" + data;
            return urlPath;
        };

        this.getStudentDetails = function (data) {
            var urlPath = backend_api_base + "um/insights/studentdetail?payload=" + data;
            return urlPath;
        };

        this.getStudenCountSchool = function (schoolId, subjectId) {
            var urlPath = backend_api_base + "slearn/dashboard/local/flooroccupants/summary/current/school/" + schoolId + "/subject/" + subjectId;
            return urlPath;
        }

        this.getStudentDetailsFloorWise = function (schoolId, subjectId, floorId) {
            var urlPath = backend_api_base + "slearn/dashboard/local/flooroccupants/details/current/school/" + schoolId + "/subject/" + subjectId + "/floor/" + floorId;
            return urlPath;
        }

        this.attemptActivity = function (subjectId, fromTimestamp, toTimestamp, data) {
            var urlPath = backend_api_base + "slearn/dashboard/local/attemptsummary/classroomusers/subject/" + subjectId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp + "?payload=" + data;
            return urlPath;
        }

        this.getConceptroomJson = function (subjectId, floorid) {
            var urlPath = slearn_activities_metadata + subjectId + "/" + floorid + "_conceptroom.json";
            return urlPath;
        }

        this.floorAnalysisConceptroomlevel = function (subjectId, data) {
            var urlPath = backend_api_base + "slearn/dashboard/local/completionstatus/current/conceptroomsummary/classroom/subject/" + subjectId + "?payload=" + data;
            return urlPath;
        }

        this.diffrentConceptlevel = function (subjectid, fromtimestamp, totimestamp, data) {
            var urlPath = backend_api_base + "slearn/dashboard/local/difficultconcept/classroom/subject/" + subjectid + "/lin/" + fromtimestamp + "/lout/" + totimestamp + "?payload=" + data;
            return urlPath;
        }

        this.checkStrongOrWeakConcept = function (subjectId, fromTimestamp, toTimestamp, data) {
            var urlPath = backend_api_base + "slearn/dashboard/local/difficultconcept/classroomusers/subject/" + subjectId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp + "?payload=" + data;
            return urlPath;
        }

        this.teacherUsagedata = function (subjectId, schoolId, fromTimestamp, toTimestamp, standard_id, division_id) {
            var urlPath = backend_api_base + "slate/dashboard/local/usage/schoolteachers/subject/" + subjectId + "/school/" + schoolId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp + "?standardId=" + standard_id + "&divisionId=" + division_id;
            return urlPath;
        };

        this.skillwiseStudentDetail = function (subjectId, fromTimestamp, toTimestamp, data) {
            var urlPath = backend_api_base + "slearn/dashboard/local/attemptsummary/classroomusers/subject/" + subjectId + "/lin/" + fromTimestamp + "/lout/" + toTimestamp + "?payload=" + data;
            return urlPath;
        };

        this.weeklySubjectUsage = function () {
            var urlPath = backend_api_base + "slate/requestor/persubjectusage/weeklysummary";
            return urlPath;
        };

        this.teacherDetails = function (schoolId) {
            var urlPath = backend_api_base + "um/insights/teacherdetail?school_id=" + schoolId;
            return urlPath;
        };

        this.roleTypeName = function () {
            var rolename = ["student","teacher"];
            return rolename;
        }
    })
    .filter('secondsToDateTime', [function () {
        return function (seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    }])
    .service("convertHourServices", function () {
        this.convertDurationToHour = function (duration) {
            var time = duration;
            var hours = Math.floor(time / 3600);
            time -= hours * 3600;

            var minutes = Math.floor(time / 60);
            time -= minutes * 60;

            var seconds = parseInt(time % 60, 10);

            return hours + "." + (minutes < 10 ? '0' + minutes : minutes);
        }

        this.convertDurationToHourMinSec = function (duration) {
            var time = duration;
            var hours = Math.floor(time / 3600);
            time -= hours * 3600;

            var minutes = Math.floor(time / 60);
            time -= minutes * 60;

            var seconds = parseInt(time % 60, 10);

            return hours + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
        }

        this.convertDurationToHourMin = function (duration) {
            var time = duration;
            var hours = Math.floor(time / 3600);
            time -= hours * 3600;

            var minutes = Math.floor(time / 60);
            time -= minutes * 60;

            var seconds = parseInt(time % 60, 10);

            return hours + "." + (minutes < 10 ? '0' + minutes : minutes);
        }
    })
    .filter('formatTimer', function () {
        return function (input) {
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            var seconds = input % 60;
            var minutes = Math.floor(input % 3600 / 60);
            var hours = Math.floor(input / 3600);
            return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
        };
    })
    .factory('FromdateTodateFactory', function () {
        var dataFactory = {};

        dataFactory.fromdate = function (time) {
            var testfromdate = new Date(time);
            testfromdate = testfromdate.setHours(0, 0, 0, 0);
            var fromtimestamp = Math.round(Number(testfromdate) / 1000.0);
            return fromtimestamp;
        }

        dataFactory.todate = function (time) {
            var testtodate = new Date(time);
            testtodate = testtodate.setHours(23, 59, 59, 0);
            var totimestamp = Math.round(Number(testtodate) / 1000.0);
            return totimestamp;
        }

        return dataFactory;
    })
    .service("weekyeardataServices", function () {
        this.weekyeardatafunction = function (duration) {
            var weekyeardata = [{weekno: 24, weekyear: 2019}, {weekno: 25, weekyear: 2019}, {
                weekno: 26,
                weekyear: 2019
            }, {weekno: 27, weekyear: 2019}, {weekno: 28, weekyear: 2019}, {weekno: 29, weekyear: 2019}, {
                weekno: 30,
                weekyear: 2019
            }, {weekno: 31, weekyear: 2019}, {weekno: 32, weekyear: 2019}, {weekno: 33, weekyear: 2019}, {
                weekno: 34,
                weekyear: 2019
            }, {weekno: 35, weekyear: 2019}, {weekno: 36, weekyear: 2019}, {weekno: 37, weekyear: 2019}, {
                weekno: 38,
                weekyear: 2019
            }, {weekno: 39, weekyear: 2019}, {weekno: 40, weekyear: 2019}, {weekno: 41, weekyear: 2019}, {
                weekno: 42,
                weekyear: 2019
            }, {weekno: 43, weekyear: 2019}, {weekno: 44, weekyear: 2019}, {weekno: 45, weekyear: 2019}, {
                weekno: 46,
                weekyear: 2019
            }, {weekno: 47, weekyear: 2019}, {weekno: 48, weekyear: 2019}, {weekno: 49, weekyear: 2019}, {
                weekno: 50,
                weekyear: 2019
            }, {weekno: 51, weekyear: 2019}, {weekno: 52, weekyear: 2019}, {weekno: 1, weekyear: 2020}, {
                weekno: 2,
                weekyear: 2020
            }, {weekno: 3, weekyear: 2020}, {weekno: 4, weekyear: 2020}, {weekno: 5, weekyear: 2020}, {
                weekno: 6,
                weekyear: 2020
            }, {weekno: 7, weekyear: 2020}, {weekno: 8, weekyear: 2020}, {weekno: 9, weekyear: 2020}, {
                weekno: 10,
                weekyear: 2020
            }, {weekno: 11, weekyear: 2020}, {weekno: 12, weekyear: 2020}, {weekno: 13, weekyear: 2020}];

            return weekyeardata;
        }
    })
    .factory('FromteDateFactory', function () {
        var dataFactory = {};

        dataFactory.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('-');
        }

        dataFactory.dateFromWeekNumber = function (year, week) {
            var d = new Date(year, 0, 1);
            var dayNum = d.getDay();
            var diff = --week * 7;

            // If 1 Jan is Friday to Sunday, go to next week
            if (!dayNum || dayNum > 4) {
                diff += 7;
            }

            // Add required number of days
            d.setDate(d.getDate() - d.getDay() + ++diff);
            return d;
        }

        dataFactory.getWeekNumber = function (d) {
            // Copy date so don't modify original
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            // Get first day of year
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            // Calculate full weeks to nearest Thursday
            var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            // Return array of year and week number
            return [d.getUTCFullYear(), weekNo];
        }

        dataFactory.weekCount = function (year, month_number) {
            // month_number is in the range 1..12

            var firstOfMonth = new Date(year, month_number - 1, 1);
            var lastOfMonth = new Date(year, month_number, 0);

            var used = firstOfMonth.getDay() + lastOfMonth.getDate();

            return Math.ceil(used / 7);

            // var firstOfMonth = new Date(year, month_number - 1, 1);
            // var day = firstOfMonth.getDay() || 6;
            // day = day === 1 ? 0 : day;
            // if (day) { day-- }
            // var diff = 7 - day;
            // var lastOfMonth = new Date(year, month_number, 0);
            // var lastDate = lastOfMonth.getDate();
            // if (lastOfMonth.getDay() === 1) {
            //     diff--;
            // }
            // var result = Math.ceil((lastDate - diff) / 7);
            // return result + 1;
        }

        return dataFactory;
    })
    .filter('total', ['$parse', function ($parse) {
        return function (input, property) {
            var i = input instanceof Array ? input.length : 0,
                p = $parse(property);

            if (typeof property === 'undefined' || i === 0) {
                return i;
            } else if (isNaN(p(input[0]))) {
                throw 'filter total can count only numeric values';
            } else {
                var total = 0;
                while (i--)
                    total += p(input[i]);
                return total;
            }
        };
    }])
    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })
    .service("tableOptionService", function () {
        this.options = function () {
            return {
                aLengthMenu: [[-1, 10, 20], ['All', 10, 20]],
                dom: '<"row"<"col-sm-6"l><"col-sm-6 d-button"B>><"row"<"col-sm-12"tr>><"row"<"col-sm-5"i><"col-sm-7"p>>',
                responsive: false,
                buttons: ['copy', 'excel']
            };
        }
    });
