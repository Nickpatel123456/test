angular.module('sledstudio')
    .controller('Slearn8ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices, weekyeardataServices, geturlServices, FromteDateFactory, tableOptionService) {
        $scope.tableOption8 = tableOptionService.options();
        $scope.getSubjectDetails = (function () {
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var subject_usage_limitation = response.data.subject_usage_limitation;

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectname_data = response1.data.subject;
                            $scope.subject_details_data8 = [];

                            angular.forEach(subject_usage_limitation, function (value, key) {
                                var substdidlist = [];
                                angular.forEach(value, function (value1, key1) {
                                    if (key1 > 2)
                                        this.push({stdid: key1, usagelimit: value1.duration_usage_limit});
                                }, substdidlist);
                                this.push({
                                    subid: key,
                                    subname: subjectname_data[key].name.gj,
                                    stdidlist: substdidlist.sort(function (a, b) {
                                        return a.stdid - b.stdid
                                    })
                                });
                            }, $scope.subject_details_data8);
                        }, function (error) {
                            console.log("can not get schooljson standard division data");
                        });

                }, function (error) {
                    console.log("can not get schooljson standard division data");
                });
        }());

        $scope.getstandardwiseExpActUsage = function () {
            dataModalServices.openMoldal();
            $scope.showstandardTable = false;
            var schoolid = sessionStorage.getItem("schoolid");
            var subid = JSON.parse($scope.subject_data8).subid;
            var substdidlist = JSON.parse($scope.subject_data8).stdidlist;
            var prodctname = "slearn";
            $scope.actualStandardusage = [];

            $.ajax({
                type: "POST",
                url: skiilreport_backend_api + 'student/schoolwisecount',
                data: JSON.stringify({"name": "standard"}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    var schoolstandardTotalStudent = data.data[schoolid];
                    var standardStudentKeyPair = {};
                    angular.forEach(schoolstandardTotalStudent, function (value, key) {
                        standardStudentKeyPair[value.standard_id] = value.student_count;
                    });

                    $scope.standardExpUsg = {};
                    $scope.instruction = [];
                    angular.forEach(substdidlist, function (value, key) {
                        $scope.standardExpUsg[value.stdid] = convertHourServices.convertDurationToHourMinSec(standardStudentKeyPair[value.stdid] * value.usagelimit);
                        $scope.instruction.push("Actual", "Percentage")
                    });

                    Date.prototype.addDays = function (days) {
                        this.setDate(this.getDate() + parseInt(days));
                        return this;
                    };

                    var weekyeardata = weekyeardataServices.weekyeardatafunction();

                    function actualweekstandardusage(start, end) {
                        if (start > end - 1) {
                            dataModalServices.closeModal();
                            $scope.showstandardTable = true;
                            return;
                        }

                        var weeknumber = weekyeardata[start].weekno;
                        var weekyear = weekyeardata[start].weekyear;

                        var start_date = FromteDateFactory.dateFromWeekNumber(weekyear, weeknumber);
                        var end_date = FromteDateFactory.dateFromWeekNumber(weekyear, weeknumber).addDays(6);

                        var fromtimestamp = FromdateTodateFactory.fromdate(start_date);
                        var totimestamp = FromdateTodateFactory.todate(end_date);

                        var actual_subject_standard_usage = [];

                        function standardrecursive(start1, end1) {
                            if (start1 > end1 - 1) {
                                $scope.actualStandardusage.push({
                                    weekno: start + 1,
                                    start_end_date: FromteDateFactory.formatDate(start_date) + " To " + FromteDateFactory.formatDate(end_date),
                                    actualusage: actual_subject_standard_usage
                                });

                                actual_subject_standard_usage = [];
                                actualweekstandardusage(start + 1, end);
                                return;
                            }

                            var standard_id = substdidlist[start1].stdid;
                            var usagelimit = substdidlist[start1].usagelimit;
                            var urlPath = dashboardServices.standardSchoolUsage(prodctname, schoolid, standard_id, fromtimestamp, totimestamp);
                            ajaxCallsFactory.getCall(urlPath)
                                .then(function (response) {
                                    var standardUsageData = response.data.data;
                                    var act = 0, per = 0;
                                    if (standardUsageData[subid]) {
                                        act = convertHourServices.convertDurationToHourMinSec(standardUsageData[subid]);
                                        per = (standardUsageData[subid] * 100) / (standardStudentKeyPair[standard_id] * usagelimit);
                                    } else {
                                        act = convertHourServices.convertDurationToHourMinSec(0);
                                    }
                                    actual_subject_standard_usage.push(act, per.toFixed(2));
                                    standardrecursive(start1 + 1, end1);
                                }, function (error) {
                                    console.log("can not get this api data check pass data");
                                });
                        }

                        standardrecursive(0, substdidlist.length);
                    }

                    actualweekstandardusage(0, weekyeardata.length);
                }
            });
        }
    });
