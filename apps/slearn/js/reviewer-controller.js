angular.module('sledstudio')
    .controller('ReviewerController', function (errorFactory, basicFactory, ajaxCallsFactory, $scope, geturlServices) {

        this.init = function () {
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                // $scope.baseLinkForScope = baselinkforfiles;
                sessionStorage.setItem("menuid", 6);
                ajaxCallsFactory.getCall(slearn_config)
                    .then(function (response) {
                        var subjectKey = response.data.subject_usage_limitation;

                        ajaxCallsFactory.getCall(dictionary)
                            .then(function (response1) {
                                var subjectDetails = response1.data.subject;
                                $scope.subject = [];
                                for (var k in subjectKey)
                                    $scope.subject.push({subid: k, name: subjectDetails[k].name})
                            }, function (error) {
                                console.log("Cannot get Dictionary file");
                            });
                    }, function (error) {
                        console.log("Cannot get slearn config file");
                    });

                var subject_id = null;
                var floor_id = null;
                var conceptroom_id = null;
                var concept_id = null;
                var activitynumber = null;

                $scope.showDivFloor = $scope.showDivConceptroom = $scope.showDivConcept = $scope.showDivActivity = false;
            }
        }
        this.init();

        $scope.loadFloorList = function (subid, subname) {
            $scope.showDivFloor = true;
            $scope.showSubmitButton = false;
            $scope.showDivConceptroom = $scope.showDivConcept = $scope.showDivActivity = false;
            $scope.selectdFloor = $scope.conceptroomName = $scope.conceptName = $scope.activityName = null;
            $scope.allvaluesselected = 0;
            $scope.emptyAllDiv();
            $scope.selectdSubjectName = subname;
            subject_id = subid;
            var url = geturlServices.floorJson(subid);
            ajaxCallsFactory.getCall(url)
                .then(function (response) {
                    $scope.flooridlist = basicFactory.getListOfKeys(response.data.floor);
                    $scope.floor = [];
                    angular.forEach($scope.flooridlist, function (value, key) {
                        this.push({floorid: value, foorname: value})
                    }, $scope.floor);
                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });
        }

        $scope.loadConceptRoomList = function (floorid) {
            $scope.showDivConceptroom = true;
            $scope.showSubmitButton = false;
            $scope.showDivConcept = $scope.showDivActivity = false;
            $scope.conceptroomName = $scope.conceptName = $scope.activityName = null;
            $scope.allvaluesselected = 0;
            $scope.emptyAllDiv();
            $scope.selectdFloor = floorid;
            floor_id = floorid;
            var url = geturlServices.floorJson(subject_id);
            ajaxCallsFactory.getCall(url)
                .then(function (response) {
                    var conceptroomresponse = response.data.floor[floorid].conceptroom;
                    var conceptroom_id = basicFactory.getListOfKeys(conceptroomresponse);
                    $scope.conceptroom = [];
                    for (var i = 0; i < conceptroom_id.length; i++) {
                        var temp = {
                            "concept_room_name": conceptroomresponse[conceptroom_id[i]].conceptroom_name,
                            "conceptroom_id": conceptroom_id[i]
                        };
                        $scope.conceptroom.push(temp);
                    }

                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });
        }

        $scope.loadConceptList = function (conceptroomid, conceptroomname) {
            $scope.showDivConcept = true;
            $scope.showSubmitButton = false;
            $scope.conceptName = $scope.activityName = null;
            $scope.showDivActivity = false;
            $scope.allvaluesselected = 0;
            $scope.selectedActivity = 0;
            $scope.emptyAllDiv();
            conceptroom_id = conceptroomid;
            $scope.conceptroomName = conceptroomname;

            var url = geturlServices.conceptroomJson(subject_id, floor_id);
            ajaxCallsFactory.getCall(url)
                .then(function (response) {
                    var output = response.data.conceptroom[conceptroomid].concept
                    var keysofoutput = basicFactory.getListOfKeys(output);
                    $scope.concept = [];
                    for (var i = 0; i < keysofoutput.length; i++) {
                        var temp = response.data.conceptroom[conceptroomid].concept[keysofoutput[i]].activity;
                        var temp1 = basicFactory.getListOfKeys(temp);
                        for (var j = 0; j < temp1.length; j++) {
                            if (temp[temp1[j]].is_anchor == true) {
                                var test = {
                                    "concept_id": keysofoutput[i],
                                    "concept_name": temp[temp1[j]].activity_name
                                };
                                $scope.concept.push(test);
                            }
                        }
                    }
                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });
        }

        $scope.loadActivityList = function (conceptid, conceptname) {
            $scope.showDivActivity = true;
            $scope.showSubmitButton = false;
            $scope.activityName = null;
            concept_id = conceptid;
            $scope.conceptName = conceptname;
            $scope.allvaluesselected = 0;
            $scope.emptyAllDiv();
            var url = geturlServices.conceptroomJson(subject_id, floor_id);
            ajaxCallsFactory.getCall(url)
                .then(function (response) {
                    var output = response.data.conceptroom[conceptroom_id].concept[conceptid].activity;
                    var keysofoutput = basicFactory.getListOfKeys(output);
                    $scope.activity = [];
                    for (var i = 0; i < keysofoutput.length; i++) {
                        var test = {
                            "activity_id": keysofoutput[i],
                            "activity_name": output[keysofoutput[i]].activity_name,
                            "ordr_of_activity": output[keysofoutput[i]].ordr_of_activity
                        };
                        $scope.activity.push(test);
                    }

                    $scope.activity.sort(function (a, b) {
                        return a.ordr_of_activity - b.ordr_of_activity
                    });

                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });
        }

        $scope.displayButtonsToShowConcepts = function () {
            $scope.allvaluesselected = 1;
            $scope.isanchor = '';
            $scope.buttonactive = "";
            $("#collapse1,#collapse2,#collapse3,#collapse4,#collapse5").collapse('hide');
        }

        $scope.changedActivity = function (activityid, activityname) {
            $scope.activityName = activityname;
            activitynumber = activityid;

            if (subject_id == null && floor_id == null && conceptroom_id == null && concept_id == null && activitynumber == null) {
                $scope.showSubmitButton = false;
            } else {
                $scope.showSubmitButton = true;
            }

            $scope.allvaluesselected = 0;
            $scope.emptyAllDiv();
        }


        $scope.emptyAllDiv = function () {
            $('#loaddetails').empty();
            $("#loaddetails").removeAttr("style");
        }

        $scope.isActive = function (type) {
            return type === $scope.buttonactive;
        };

        $scope.loadActivity = function () {
            $scope.emptyAllDiv();
            $scope.getSubjectName(String(subject_id));
            sessionStorage.setItem("activity_standard", floor_id);
            sessionStorage.setItem("concept", concept_id);
            sessionStorage.setItem("level", activitynumber);
            var url = geturlServices.conceptroomJson(String(subject_id), floor_id);
            ajaxCallsFactory.getCall(url)
                .then(function (response) {
                    console.log(sessionStorage.getItem('subject'));
                    console.log(response.data.conceptroom[conceptroom_id].concept[concept_id].activity[activitynumber].game_id);
                    sessionStorage.setItem("templateid", response.data.conceptroom[conceptroom_id].concept[concept_id].activity[activitynumber].game_id);

                    //below if condition is used to check if template_id is 13 and subject is maths then it will use game13 in slearntemplates else if subject is other than maths then it will use game60 in slearntemplates.
                    sessionStorage.setItem("anchor", response.data.conceptroom[conceptroom_id].concept[concept_id].activity[activitynumber].is_anchor);

                    $scope.isanchor = sessionStorage.getItem("anchor");
                    $("#loaddetails").attr("style", "width:100%; height:40em");
                    // document.getElementById("loaddetails").innerHTML='<object type="text/html" style="width:100%; height:100%" data="'+baselinkforfiles+'apps/slearn/slearntemplates/game'+sessionStorage.getItem("templateid")+'"></object>';

                    $scope.tempId = response.data.conceptroom[conceptroom_id].concept[concept_id].activity[activitynumber].game_id;
                    $scope.actId = activitynumber;
                    $scope.skillID = response.data.conceptroom[conceptroom_id].concept[concept_id].activity[activitynumber].skill_id;

                    ajaxCallsFactory.getCall(skill_config)
                        .then(function (response1) {
                            $scope.skillname = response1.data[$scope.skillID].name.guj;
                            $scope.showActivityDetails = true;
                        });

                    document.getElementById("loaddetails").innerHTML = '<iframe src="' + baselinkforfiles + 'apps/slearn/slearntemplates/game' + sessionStorage.getItem("templateid") + '" width="100%" height="95%" frameborder="0" allowfullscreen="allowfullscreen"></iframe>';
                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });
            $scope.buttonactive = "activity";
        }

        $scope.getSubjectName = function (subjectid) {
            ajaxCallsFactory.getCall(dictionary)
                .then(function (resdictionary) {
                    sessionStorage.setItem("subject", resdictionary.data.subject[subject_id].name.slearn_folder);
                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });
        }

        $scope.loadRemedial1 = function () {
            $scope.emptyAllDiv();
            $scope.getSubjectName(String(subject_id));
            var url = geturlServices.conceptroomJson(String(subject_id), floor_id);
            ajaxCallsFactory.getCall(url)
                .then(function (response) {
                    sessionStorage.setItem("remedialid1", response.data.conceptroom[conceptroom_id].concept[concept_id].activity[activitynumber].remedial["1"].remedial_id);
                    $("#loaddetails").attr("style", "");
                    $("#loaddetails").attr("style", "width:100%; height:80vh");
                    // document.getElementById("loaddetails").innerHTML='<object type="text/html" style="width:100%; height:100%" data="'+slearnbaseurl+"remedial/"+sessionStorage.getItem("subject")+"/"+sessionStorage.getItem("remedialid1")+'"></object>';
                    document.getElementById("loaddetails").innerHTML = '<iframe src="' + slearnbaseurl + "remedial/" + sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("remedialid1") + '" width="100%" height="100%" frameborder="0" allowfullscreen="allowfullscreen"></iframe>';
                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });

            $scope.buttonactive = "remedial1";
        }

        $scope.loadRemedial2 = function () {
            $scope.emptyAllDiv();
            $scope.getSubjectName(String(subject_id));
            var url = geturlServices.conceptroomJson(String(subject_id), floor_id);
            ajaxCallsFactory.getCall(url)
                .then(function (response) {
                    sessionStorage.setItem("remedialid2", response.data.conceptroom[conceptroom_id].concept[concept_id].activity[activitynumber].remedial["2"].remedial_id);
                    $("#loaddetails").attr("style", "padding: 8px;background-color: bisque;margin: auto;");
                    $("#loaddetails").html('<center><video controls style="width:90%"><source src="' + slearnbaseurl + "remedial/" + sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("remedialid2") + ".mp4" + '" type="video/mp4" /></video></center>');
                }, function (error) {
                    console.log('Cannot get Conceptroom list' + error.message);
                });

            $scope.buttonactive = "remedial2";
        }
    });
