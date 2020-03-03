angular.module('sledstudio')
    .controller('Academic6LevelController', function ($scope, ajaxCallsFactory, dataModalServices, dashboardServices, tableOptionService) {
        $scope.tableOption6 = tableOptionService.options();

        this.getSubjectDetails = function () {
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var subject_usage_limitation = response.data.subject_usage_limitation;

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectname_data = response1.data.subject;

                            $scope.subject_details_data6 = Object.keys(subject_usage_limitation)
                                .map(function (value, index) {
                                        return {
                                            sub_id: value,
                                            standard: Object.keys(subject_usage_limitation[value]).map(function (value1, index1) {
                                                return value1;
                                            }),
                                            sub_name: subjectname_data[value].name
                                        }
                                    }
                                );
                        }, function (error) {
                            console.log("can not get schooljson standard division data");
                        });

                }, function (error) {
                    console.log("can not get schooljson standard division data");
                });
        }
        this.getSubjectDetails();

        $scope.getstandard_data6 = function () {
            var standard_idlist = $scope.subject_data6.standard;

            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    var standard_data = response.data.standard_division_map;
                    $scope.standard_details_data6 = [];

                    angular.forEach(standard_idlist, function (value, key) {
                        if (value > 2) {
                            this.push(value)
                        }
                    }, $scope.standard_details_data6);
                }, function (error) {
                    console.log("can not get schooljson standard division data");
                });
        }

        $scope.getdivision_data6 = function () {
            var standard_id = $scope.standard_data6;

            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    var standard_division_data = response.data.standard_division_map[standard_id];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var division_data = response1.data.division;
                            $scope.division_details_data6 = [];

                            angular.forEach(standard_division_data, function (value, ley) {
                                this.push({
                                    div_id: value,
                                    div_name: division_data[value].name
                                })
                            }, $scope.division_details_data6);

                        }, function (error) {
                            console.log("can not get schooljson standard division data");
                        });

                }, function (error) {
                    console.log("can not get schooljson standard division data");
                });
        }


        $scope.studentwiseSkillreport = function () {
            dataModalServices.openMoldal();
            $scope.showskillreporttable = false;
            $scope.erorrmsg = false;

            var school_id = sessionStorage.getItem("schoolid");
            var subject_id = $scope.subject_data6.sub_id;
            var standard_id = $scope.standard_data6;
            var division_id = $scope.division_data6;

            ajaxCallsFactory.getCall(skill_config)
                .then(function (response) {
                    var skills_data = response.data;

                    var objdata = JSON.stringify({
                        standard_id: standard_id,
                        division_id: division_id,
                        subject_id: subject_id,
                        school_id: school_id
                    });
                    $.ajax({
                        type: "POST",
                        url: skiilreport_backend_api + 'skillcompletionreport/overallperformance',
                        data: objdata,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success: function (data) {
                            var studentskillwiseusage_data = data.data;
                            // console.log(studentskillwiseusage_data);

                            var data = JSON.stringify({
                                "school_id": school_id,
                                "standard_id": standard_id,
                                "division_id": division_id
                            });
                            var urlPath = dashboardServices.getStudentDetails(data);
                            ajaxCallsFactory.getCall(urlPath)
                                .then(function (response1) {
                                    var stdentdetails = response1.data.data;

                                    if (studentskillwiseusage_data[0]) {
                                        var aggregareskilldata = studentskillwiseusage_data[0];

                                        aggregareskilldata.sort(function (a, b) {
                                            return a.skill_id - b.skill_id
                                        });

                                        $scope.aggregateSkillReport = [];
                                        var sub_skill_id = parse_sub_skill.subskill[subject_id];
                                        sub_skill_id.sort(function (a, b) {
                                            return a.skill_id - b.skill_id
                                        });
                                        var aggregateReportData = {};

                                        angular.forEach(aggregareskilldata, function (value, key) {
                                            var data = [];
                                            data.push({
                                                completion_percentage: value.completion_percentage,
                                                available_activities: value.available_activities,
                                                completed_activities: value.completed_activities
                                            });
                                            aggregateReportData[value.skill_id] = data;
                                        });

                                        angular.forEach(sub_skill_id, function (value, index) {
                                            if (aggregateReportData[value]) {
                                                this.push({
                                                    skill_name: skills_data[value].name,
                                                    aggregate: aggregateReportData[value][0].completion_percentage,
                                                    total_act: aggregateReportData[value][0].available_activities,
                                                    completed_act: aggregateReportData[value][0].completed_activities
                                                })
                                            } else {
                                                this.push({
                                                    skill_name: skills_data[value].name,
                                                    aggregate: 0,
                                                    total_act: 0,
                                                    completed_act: 0
                                                })
                                            }
                                        }, $scope.aggregateSkillReport);

                                        var userid_list = [];
                                        angular.forEach(studentskillwiseusage_data, function (value, key) {
                                            if (key > 0) {
                                                this.push(key)
                                            }
                                        }, userid_list);

                                        $scope.studentskillReport = [];

                                        function stundetSkillRecursive(start, end) {
                                            if (start > end - 1) {
                                                dataModalServices.closeModal();
                                                $scope.showskillreporttable = true;
                                                return;
                                            }

                                            var user_id = userid_list[start];
                                            var skillreportdata = [];

                                            var stundetskillJsonData = {};
                                            angular.forEach(studentskillwiseusage_data[user_id], function (value, key) {
                                                var tempData = [];
                                                tempData.push({
                                                    completion_percentage: value.completion_percentage,
                                                    available_activities: value.available_activities,
                                                    completed_activities: value.completed_activities,
                                                    floorid: value.floor_id
                                                })
                                                stundetskillJsonData[value.skill_id] = tempData;
                                                // console.log(tempData)
                                            });

                                            angular.forEach(sub_skill_id, function (value, index) {

                                                if (stundetskillJsonData[value]) {
                                                    this.push({
                                                        per: stundetskillJsonData[value][0].completion_percentage,
                                                        floorid: stundetskillJsonData[value][0].floorid
                                                    })
                                                } else {
                                                    this.push({per: 0, floorid: 'NA'})
                                                }
                                            }, skillreportdata);

                                            $scope.studentskillReport.push({
                                                srno: start + 1,
                                                stundet_data: stdentdetails[user_id],
                                                skill_data: skillreportdata
                                            })
                                            // console.log($scope.studentskillReport)
                                            stundetSkillRecursive(start + 1, end);
                                        }

                                        stundetSkillRecursive(0, userid_list.length);
                                    } else {
                                        dataModalServices.closeModal();
                                        $scope.erorrmsg = true;
                                    }

                                }, function (error) {
                                    console.log("Cannot get student details");
                                    dataModalServices.closeModal();
                                });
                        }
                    });

                }, function (error) {
                    console.log("can not get Skill Json Data");
                });
        }

    });
