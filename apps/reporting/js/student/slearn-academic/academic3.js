angular.module('sledstudio')
    .controller('Academic3LevelController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, tableOptionService) {
        $scope.tableOption3 = tableOptionService.options();

        $scope.clear = function () {
            $scope.fromDate3 = null;
            $scope.toDate3 = null;
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

        $scope.getsubjectdata3 = function () {
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var subjectusagelimitation = response.data.subject_usage_limitation;

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            var subjectdetails = response1.data.subject;
                            $scope.subjectdata3 = [];

                            for (var key in subjectusagelimitation)
                                $scope.subjectdata3.push({sub_id: key, sub_name: subjectdetails[key].name})

                        }, function (error) {
                            console.log("can not get Dicttonary data school json file")
                        });

                }, function (error) {
                    console.log("can not get stndard data school json file")
                });
        }
        $scope.getsubjectdata3();

        $scope.getStandardData3 = function () {
            ajaxCallsFactory.getCall(slearn_config)
                .then(function (response) {
                    var stddata = response.data.subject_usage_limitation[$scope.sub_analysis3];

                    $scope.standardanalysis3 = [];
                    for (var key in stddata) {
                        if (key > 2) {
                            $scope.standardanalysis3.push(key);
                        }
                    }
                }, function (error) {
                    console.log("can not get slearn_config data")
                });
        }

        $scope.getDivisionData3 = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    var divId = response.data.standard_division_map[$scope.std_analysis3];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            $scope.divanalysis3 = [];

                            for (var k in divId)
                                $scope.divanalysis3.push({
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

        $scope.loadAcademic3Report = function () {
            $scope.showAcademic3Report = false;
            $scope.errorMsg3 = false;
            $scope.showtable3 = false;
            dataModalServices.openMoldal();

            var school_id = sessionStorage.getItem("schoolid");
            var subjectid = $scope.sub_analysis3;
            var standard_id = $scope.std_analysis3;
            var divisionid = $scope.div_analysis3;
            var data = JSON.stringify({"school_id": school_id, "standard_id": standard_id, "division_id": divisionid});
            $scope.dataarray1 = [];

            var urlPath = dashboardServices.getStudentDetails(data);
            ajaxCallsFactory.getCall(urlPath)
                .then(function (response) {
                    var stdentdetails = response.data.data;

                    var urlPath1 = dashboardServices.floorAnalysisConceptroomlevel(subjectid, data);
                    ajaxCallsFactory.getCall(urlPath1)
                        .then(function (response1) {
                            var studentConceptLevel = response1.data.data;
                            var stundetconceptarray = [];

                            for (var k in studentConceptLevel) {
                                var userid = k;
                                var temp = [];
                                for (var j in studentConceptLevel[k]) {
                                    var floorid = studentConceptLevel[k][j].floor_id;
                                    var conceproomtid = studentConceptLevel[k][j].conceptroom_id;
                                    var conceptid = studentConceptLevel[k][j].concept_id;
                                    var percantage = studentConceptLevel[k][j].concept_completion_percentage;

                                    temp.push({
                                        stundetname: stdentdetails[userid].user_detail.first_name + " " + stdentdetails[userid].user_detail.last_name,
                                        conceproomtid: conceproomtid,
                                        conceptid: conceptid,
                                        percantage: percantage,
                                        data: studentConceptLevel[k][j]
                                    })
                                }
                                stundetconceptarray.push(temp)
                            }

                            function recursiveStundeconcept(start, end) {
                                if (start > end - 1) {
                                    if ($scope.dataarray1.length == 0) {
                                        $scope.errorMsg3 = true;
                                        $scope.errorMsg = "No data Avaliable for this combination";
                                    } else {
                                        $scope.showtable3 = true;
                                    }
                                    dataModalServices.closeModal();
                                    $scope.showAcademic3Report = true;
                                    return;
                                }

                                var stundetconceptdata = stundetconceptarray[start];
                                var temp2 = [];
                                var username = stundetconceptdata[0].stundetname;
                                var floorid1 = stundetconceptdata[0].data.floor_id;
                                var conceptroom_id1 = stundetconceptdata[0].conceproomtid;
                                var temp3 = [];

                                var urlPath3 = dashboardServices.getConceptroomJson(subjectid, floorid1);
                                ajaxCallsFactory.getCall(urlPath3)
                                    .then(function (response3) {

                                        var conceptroomname = response3.data.conceptroom[conceptroom_id1].conceptroom_name;
                                        temp3.push(conceptroomname);

                                    }, function (error) {
                                        console.log("Cannot get data")
                                    });

                                var conceptroom_id;

                                function recursive2(start1, end1) {
                                    if (start1 > end1 - 1) {
                                        $scope.dataarray1.push({
                                            username: username,
                                            floorid1: floorid1,
                                            conceproomtid: conceptroom_id,
                                            conceptroomname: temp3,
                                            conceptdata: temp2
                                        })
                                        recursiveStundeconcept(start + 1, end);
                                        return;
                                    }

                                    var floorid = stundetconceptdata[start1].data.floor_id;
                                    conceptroom_id = stundetconceptdata[start1].conceproomtid;

                                    var concept_id = stundetconceptdata[start1].conceptid;

                                    var urlPath2 = dashboardServices.getConceptroomJson(subjectid, floorid);
                                    ajaxCallsFactory.getCall(urlPath2)
                                        .then(function (response2) {

                                            var conceptname = response2.data.conceptroom[conceptroom_id].concept[concept_id].concept_name;

                                            temp2.push({
                                                conceptname: conceptname,
                                                concept_id: concept_id,
                                                percantage: parseFloat(stundetconceptdata[start1].percantage).toFixed(0),
                                                activityid: stundetconceptdata[start1].data.activity_id
                                            })

                                            recursive2(start1 + 1, end1)
                                        }, function (error) {
                                            console.log("Cannot get data")
                                        });

                                }

                                recursive2(0, stundetconceptdata.length)
                            }

                            recursiveStundeconcept(0, stundetconceptarray.length)

                        }, function (error) {
                            console.log("Cannot get data");
                            dataModalServices.closeModal();
                        });

                }, function (error) {
                    console.log("Cannot get data");
                    dataModalServices.closeModal();
                });

        }

        $scope.loadStudentActivityDetails = function (floorid, conceptroomid, conceptid, activityid) {
            $("#activityModal").modal("show");

            var school_id = sessionStorage.getItem("schoolid");
            var subjectid = $scope.sub_analysis3;

            $scope.studentPassActivityId = activityid;

            var urlPath = dashboardServices.getConceptroomJson(subjectid, floorid);
            ajaxCallsFactory.getCall(urlPath)
                .then(function (response) {
                    var floorConceptroomdata = response.data;
                    $scope.activityList = floorConceptroomdata.conceptroom[conceptroomid].concept[conceptid].activity;
                }, function (error) {
                    console.log("Cannot get data")
                });

        }

    });
