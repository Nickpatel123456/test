angular.module('sledstudio')
    .controller('Slearn7ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices, weekyeardataServices, geturlServices, FromteDateFactory, tableOptionService) {
        $scope.clusterTableOpt7 = tableOptionService.options();
        $scope.weekWiseUsageFunction = (function () {
            dataModalServices.openMoldal();
            $scope.showweekusagetable = false;
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
                    var schoolid = sessionStorage.getItem("schoolid");
                    var subjectwiseTotalStudent = data.data[schoolid][0];
                    var productname = "slearn";
                    var roletype = "student";

                    ajaxCallsFactory.getCall(slearn_config)
                        .then(function (response) {
                            var subjectusagelimit = response.data.subject_usage_limitation;

                            ajaxCallsFactory.getCall(dictionary)
                                .then(function (response1) {
                                    var subjectnamelist = response1.data.subject;
                                    $scope.subjectnamedata = [];
                                    $scope.ins = [];
                                    angular.forEach(subjectusagelimit, function (value, key) {
                                        var subweekusagesecond;
                                        angular.forEach(value, function (value1, key1) {
                                            subweekusagesecond = value1.duration_usage_limit;
                                        })
                                        this.push({
                                            subid: key,
                                            subname: subjectnamelist[key].name.gj,
                                            weeksecondusage: subweekusagesecond
                                        });
                                        $scope.ins.push("Actual", "Percentage")
                                    }, $scope.subjectnamedata);

                                    $scope.subjectexpectedusage = {};
                                    $scope.weeksubjectactualusage = [];
                                    angular.forEach($scope.subjectnamedata, function (value, key) {
                                        $scope.subjectexpectedusage[value.subid] = convertHourServices.convertDurationToHourMinSec(subjectwiseTotalStudent[value.subid] * value.weeksecondusage);
                                    });
                                    Date.prototype.addDays = function (days) {
                                        this.setDate(this.getDate() + parseInt(days));
                                        return this;
                                    };

                                    //week number is always start 0
                                    var week_year = weekyeardataServices.weekyeardatafunction();

                                    function weekExpActUsage(start, end) {
                                        if (start > end - 1) {
                                            dataModalServices.closeModal();
                                            $scope.showweekusagetable = true;
                                            return;
                                        }

                                        var weekno = week_year[start].weekno;
                                        var yearno = week_year[start].weekyear;

                                        var start_date = FromteDateFactory.dateFromWeekNumber(yearno, weekno);
                                        var end_date = FromteDateFactory.dateFromWeekNumber(yearno, weekno).addDays(6);

                                        var fromTimestamp = FromdateTodateFactory.fromdate(start_date);
                                        var toTimestamp = FromdateTodateFactory.todate(end_date);

                                        var urlPath = dashboardServices.sLearnSubjctUsage(productname, schoolid, fromTimestamp, toTimestamp, roletype)
                                        ajaxCallsFactory.getCall(urlPath)
                                            .then(function (response) {
                                                var studentsubjectusagedata = response.data.data;
                                                var temp = [];
                                                angular.forEach($scope.subjectnamedata, function (value, key) {
                                                    var act = 0, per = 0;
                                                    if (studentsubjectusagedata[value.subid]) {
                                                        act = convertHourServices.convertDurationToHourMinSec(studentsubjectusagedata[value.subid]);
                                                        per = (studentsubjectusagedata[value.subid] * 100) / (subjectwiseTotalStudent[value.subid] * value.weeksecondusage);
                                                    } else {
                                                        act = convertHourServices.convertDurationToHourMinSec(0);
                                                        per = 0;
                                                    }
                                                    this.push(act, per.toFixed(2));
                                                }, temp);

                                                $scope.weeksubjectactualusage.push({
                                                    weekno: start + 1,
                                                    actual: temp,
                                                    start_end_date: FromteDateFactory.formatDate(start_date) + " To " + FromteDateFactory.formatDate(end_date),
                                                })
                                                weekExpActUsage(start + 1, end);
                                            });
                                    }

                                    weekExpActUsage(0, week_year.length);
                                });
                        });
                }
            });
        }());
    });
