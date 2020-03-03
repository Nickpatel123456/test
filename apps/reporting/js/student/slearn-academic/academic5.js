angular.module('sledstudio')
    .controller('Academic5LevelController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, tableOptionService) {
        $scope.tableOption5 = tableOptionService.options();

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
                            $scope.divanalysis6 = [];

                            for (var k in divId)
                                $scope.divanalysis6.push({
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

        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.loadAcademic5Report = function () {
            dataModalServices.openMoldal();

            $scope.showAcademic5Report = false;
            $scope.percentage_arrow = "";
            $scope.status_arrow = "";

            $scope.errorMsg5 = false;
            $scope.showtable5 = false;

            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = 1510684200;
            var totimestamp = FromdateTodateFactory.todate(new Date());
            var subjectid = $scope.sub_analysis5;
            var standard_id = $scope.std_analysis5;
            var divisionid = $scope.div_analysis5;
            $scope.conceptStats = [];

            var objdata = JSON.stringify({
                "school_id": school_id,
                "standard_id": standard_id,
                "division_id": divisionid
            });
            urlPath = dashboardServices.checkStrongOrWeakConcept(subjectid, fromtimestamp, totimestamp, objdata);
            ajaxCallsFactory.getCall(urlPath)
                .then(function (response) {
                    var studentconceptStatus = response.data.data;

                    urlPath1 = dashboardServices.getStudentDetails(objdata);
                    ajaxCallsFactory.getCall(urlPath1)
                        .then(function (response1) {
                            var studentdetails = response1.data.data;

                            var conceptdata = [];
                            for (var k in studentconceptStatus) {
                                conceptdata.push(studentconceptStatus[k]);
                            }

                            var dataObj = JSON.stringify({
                                "start_time": fromtimestamp,
                                "stop_time": totimestamp,
                                "subject_id": subjectid,
                                "standard_id": standard_id,
                                "division_id": divisionid,
                                "school_id": school_id
                            });
                            $.ajax({
                                type: "POST",
                                url: skiilreport_backend_api + 'concept/accuracy',
                                data: dataObj,
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: true,
                                success: function (response4) {
                                    var studentaccuracydata = response4.data;

                                    function conceptCheckStrongWeak(start, end) {
                                        if (start > end - 1) {
                                            for (var i = 0; i < $scope.conceptStats.length; i++) {
                                                $scope.conceptStats[i].percentage =
                                                    parseFloat($scope.conceptStats[i].percentage);
                                            }

                                            dataModalServices.closeModal();
                                            $scope.showAcademic5Report = true;
                                            if ($scope.conceptStats.length == 0) {
                                                $scope.errorMsg5 = true;
                                                $scope.errorMsg = "No data Avaliable for this combination";
                                            } else {
                                                $scope.showtable5 = true;
                                                $scope.percentage_arrow = true;
                                                $scope.status_arrow = true;
                                            }
                                            return;
                                        }

                                        var studentconceptdata = conceptdata[start];
                                        var userid = studentconceptdata.user_id;
                                        var studentname = studentdetails[userid].user_detail.first_name + " " + studentdetails[userid].user_detail.last_name;
                                        var floorid = studentconceptdata.floor_id;
                                        var conceptroomid = studentconceptdata.conceptroom_id;
                                        var conceptid = studentconceptdata.concept_id;
                                        var percentage = parseFloat(studentconceptdata.avg_concept_accuracy_percent).toFixed(0);
                                        var attempt_time = "";
                                        var attempts = "";

                                        var floorwisedata = JSON.stringify({
                                            "floorid": floorid,
                                            "conceptroomid": conceptroomid,
                                            "conceptid": conceptid
                                        });

                                        var singlestundeaccuracydata = studentaccuracydata[userid];
                                        angular.forEach(singlestundeaccuracydata, function (value, key) {
                                            if ((floorid === value.floor_id) && (conceptroomid === value.conceptroom_id) && (conceptid === value.concept_id)) {
                                                attempt_time = value.attempt_time;
                                                attempts = value.attempts;
                                            }
                                        });

                                        var urlPath2 = dashboardServices.getConceptroomJson(subjectid, floorid);
                                        ajaxCallsFactory.getCall(urlPath2)
                                            .then(function (response2) {
                                                var conceptroomJsondata = response2.data;

                                                var conceptroomname = conceptroomJsondata.conceptroom[conceptroomid].conceptroom_name;
                                                var conceptname = conceptroomJsondata.conceptroom[conceptroomid].concept[conceptid].concept_name;

                                                ajaxCallsFactory.getCall(slearn_config)
                                                    .then(function (response3) {

                                                        var concept_category_qualifier = response3.data.ui_config.concept_category_qualifier;
                                                        var weak = concept_category_qualifier.weak;
                                                        var strong = concept_category_qualifier.strong;
                                                        var message = null;

                                                        if (percentage >= strong) {
                                                            message = "Strong";
                                                        } else if (percentage <= weak) {
                                                            message = "Weak";
                                                        } else {
                                                            message = "Average";
                                                        }

                                                        $scope.conceptStats.push({
                                                            userid: userid,
                                                            stundetname: studentname,
                                                            floorid: floorid,
                                                            conceptroomname: conceptroomname,
                                                            conceptname: conceptname,
                                                            statusdata: message,
                                                            percentage: percentage,
                                                            attempt_time: attempt_time,
                                                            attempts: attempts,
                                                            floorwisedata: floorwisedata
                                                        })

                                                        conceptCheckStrongWeak(start + 1, end)

                                                    }, function (error) {
                                                        console.log("can not get slearn_config data");
                                                        dataModalServices.closeModal();
                                                    })

                                            }, function (error) {
                                                console.log("can not get slearn_config data");
                                                dataModalServices.closeModal();
                                            })

                                    }

                                    conceptCheckStrongWeak(0, conceptdata.length);
                                }
                            });

                        }, function (error) {
                            console.log("can not get slearn_config data");
                            dataModalServices.closeModal();
                        })
                }, function (error) {
                    console.log("can not get slearn_config data");
                    dataModalServices.closeModal();
                });
        }

        $scope.getactivitydetails = function (userid, username, floordata) {
            $("#studentactivitydetialsmodal").modal("toggle");
            $scope.imgurl = baselinkforfiles + "images/source.gif";
            var school_id = sessionStorage.getItem("schoolid");
            var fromtimestamp = 1510684200;
            var totimestamp = FromdateTodateFactory.todate(new Date());
            var subjectid = $scope.sub_analysis5;
            var floorData = JSON.parse(floordata);
            var floor_id = floorData.floorid;
            var conceptroom_id = floorData.conceptroomid;
            var concept_id = floorData.conceptid;
            $scope.userid = userid;
            $scope.username = username;
            $scope.floorid = floor_id;
            $scope.errorMsg1 = false;
            $scope.showtable1 = false;
            $scope.showloading1 = true;

            var floorjsonpath = dashboardServices.getConceptroomJson(subjectid, floor_id);
            ajaxCallsFactory.getCall(floorjsonpath)
                .then(function (response) {
                    var conceptroomJsondata = response.data;

                    $scope.conceptroom_name = conceptroomJsondata.conceptroom[conceptroom_id].conceptroom_name;

                    $scope.concept_name = conceptroomJsondata.conceptroom[conceptroom_id].concept[concept_id].concept_name;

                    var activitydetails = conceptroomJsondata.conceptroom[conceptroom_id].concept[concept_id].activity;

                    var dataObj = JSON.stringify({
                        "user_id": userid,
                        "start_time": fromtimestamp,
                        "stop_time": totimestamp,
                        "subject_id": subjectid,
                        "floor_id": floor_id,
                        "conceptroom_id": conceptroom_id,
                        "concept_id": concept_id,
                        "school_id": school_id
                    });
                    $.ajax({
                        type: "POST",
                        url: skiilreport_backend_api + 'concept/activityattempt',
                        data: dataObj,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success: function (response1) {
                            var studentActivityAttemptDetails = response1.data;
                            console.log(studentActivityAttemptDetails);

                            $scope.studentActivityData = [];

                            angular.forEach(activitydetails, function (value, key) {
                                var activityId = value.activity_id;
                                if (studentActivityAttemptDetails[activityId]) {
                                    this.push({
                                        activity_id: activityId,
                                        activity_name: value.activity_name,
                                        attempts: studentActivityAttemptDetails[activityId].attempts,
                                        attempt_time: studentActivityAttemptDetails[activityId].attempt_time,
                                        status: studentActivityAttemptDetails[activityId].status
                                    });
                                } else {
                                    this.push({
                                        activity_id: activityId,
                                        activity_name: value.activity_name,
                                        attempts: 0,
                                        attempt_time: "00:00:00",
                                        status: "NA"
                                    });
                                }
                            }, $scope.studentActivityData);

                            console.log($scope.studentActivityData.length)

                            if ($scope.studentActivityData.length == 0) {
                                $scope.errorMsg1 = true;
                                $scope.showtable1 = false;
                            } else {
                                $scope.errorMsg = "Record Not Found."
                                $scope.errorMsg1 = false;
                                $scope.showtable1 = true;
                            }

                            $scope.showloading1 = false;
                        }
                    });
                }, function (error) {
                    console.log("can not get conceptroom json data");
                    dataModalServices.closeModal();
                })
        }
    });

