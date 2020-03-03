angular.module('sledstudio')
    .controller('ActivityListController', function (errorFactory, basicFactory, ajaxCallsFactory, $scope, geturlServices, $rootScope) {
        $scope.loadActivityList = function () {
            var urlBase = geturlServices.conceptroomJson(sessionStorage.getItem("slearnsubject"), sessionStorage.getItem("selectedfloor"));
            $scope.selectedfloor = sessionStorage.getItem("selectedfloor");
            var selectedconceptroom = sessionStorage.getItem("selectedconceptroom");
            var selectedconcept = sessionStorage.getItem("selectedconcept");

            ajaxCallsFactory.getCall(urlBase)
                .then(function (response) {
                    $scope.conceptroomname = response.data.conceptroom[selectedconceptroom].conceptroom_name;
                    sessionStorage.setItem("selected_conceptroom_name", $scope.conceptroomname);
                    $scope.conceptname = response.data.conceptroom[selectedconceptroom].concept[selectedconcept].concept_name;
                    sessionStorage.setItem("selected_concept_name", $scope.conceptname);
                    var activity_list = response.data.conceptroom[selectedconceptroom].concept[selectedconcept].activity;
                    sessionStorage.setItem("activity_list", JSON.stringify(activity_list));
                    var keys_of_activity = Object.keys(activity_list);
                    $scope.getRequestorsActivityDetails(activity_list, keys_of_activity);
                }, function (error) {
                    errorFactory.errorWindowCloseModal("Cannot get activities metadata");
                });
            $scope.subjectnametodisplayornot = true;
        }

        $scope.getRequestorsActivityDetails = function (activity_list, keys_of_activity_list) {
            var subjectid = sessionStorage.getItem("slearnsubject");
            var getRequestorsConceptroomHistory = slearn_backend_api + "getstudents/currentconceptoom/subject/" + subjectid;
            ajaxCallsFactory.getCall(getRequestorsConceptroomHistory)
                .then(function (response) {
                    //sessionStorage.setItem("percentage_completion_details_conceptroom", JSON.stringify(response.data.data));
                    sessionStorage.setItem("requestors_current_conceptroom_summary", JSON.stringify(response.data.data));

                    var payload = JSON.stringify({
                        "subject_id": sessionStorage.getItem("slearnsubject"),
                        "floor_id": sessionStorage.getItem("selectedfloor"),
                        "conceptroom_id": sessionStorage.getItem("selectedconceptroom"),
                        "concept_id": sessionStorage.getItem("selectedconcept")
                    });

                    var getRequestoryNextActivity = slearn_backend_api + "getstudents/nextactivity?payload=" + payload;
                    ajaxCallsFactory.getCall(getRequestoryNextActivity)
                        .then(function (response1) {
                            sessionStorage.setItem("requestors_next_activity", JSON.stringify(response1.data.data));

                            var getRequestorsConceptroomHistory = slearn_backend_api + "getstudents/currentflooractivitysummary/subject/" + subjectid;
                            ajaxCallsFactory.getCall(getRequestorsConceptroomHistory)
                                .then(function (response2) {
                                    $scope.concept_list_percantagedata = response2.data.data;
                                    sessionStorage.setItem("requestors_floor_conceptroom_activity", JSON.stringify(response2.data.data));
                                    $scope.deciceWhichActivityToMakeActivities(activity_list, keys_of_activity_list);

                                }, function (error) {
                                    errorFactory.errorWindowCloseModal("Cannot get requestors floor conceptroom summary for subject");
                                });
                        }, function (error) {
                            errorFactory.errorWindowCloseModal("Cannot get requestors next activity");
                        });
                }, function (error) {
                    errorFactory.errorWindowCloseModal("Cannot get requestors conceptroom summary for subject");
                });
        }

        $scope.deciceWhichActivityToMakeActivities = function (activity_list, keys_of_activity_list) {
            var requestors_next_activity = JSON.parse(sessionStorage.getItem("requestors_next_activity")); // get users next activity
            var requestors_current_conceptroom_summary = JSON.parse(sessionStorage.getItem("requestors_current_conceptroom_summary")); // users current status of activities
            var requestors_floor_conceptroom_activity = JSON.parse(sessionStorage.getItem("requestors_floor_conceptroom_activity"));
            console.log(requestors_floor_conceptroom_activity);

            var currentfloor = requestors_current_conceptroom_summary.floor_id;
            sessionStorage.setItem("currentfloor", currentfloor);
            var currentconcptroomorder = requestors_current_conceptroom_summary.ordr_of_conceptroom;
            sessionStorage.setItem("current_order_conceptoom", currentconcptroomorder);
            var currentconcptroom = requestors_current_conceptroom_summary.conceptroom_id;
            sessionStorage.setItem("current_conceptroom", currentconcptroom);


            var selectecfloor = sessionStorage.getItem("selectedfloor");
            var selectedconceptroom = sessionStorage.getItem("selectedconceptroom");
            var selectedconceptroomorder = sessionStorage.getItem("selectedconceptroomorder");

            var selectedconcept = sessionStorage.getItem("selectedconcept");

            var concept_completion_percentage1 = [];
            $scope.concept_complt_percant = 0;
            var currentFloor = Number(sessionStorage.getItem("currentfloor"));
            var selectedFloor = Number(sessionStorage.getItem("selectedfloor"));
            var currentConceptOrder = Number(sessionStorage.getItem("current_order_conceptoom"));
            var selectedConceptroomOrder = Number(sessionStorage.getItem("selectedconceptroomorder"));
            $scope.list_of_concepts = JSON.parse(sessionStorage.getItem("list_of_concepts"));
            for (var k in $scope.list_of_concepts) {
                if (selectedFloor < currentFloor) {
                    concept_completion_percentage1.push(100);
                } else if ((selectedFloor == currentFloor) && (selectedConceptroomOrder < currentConceptOrder)) {
                    concept_completion_percentage1.push(100);
                } else if ((selectedFloor == currentFloor) && (selectedConceptroomOrder == currentConceptOrder)) {
                    if ($scope.concept_list_percantagedata[k] != undefined) {
                        concept_completion_percentage1.push($scope.concept_list_percantagedata[k].concept_completion_percentage.toFixed(2));
                    } else {
                        concept_completion_percentage1.push(0);
                    }
                }
            }

            $scope.concept_complt_percant = concept_completion_percentage1[Number(sessionStorage.getItem("selectedConceptIndex"))];
            console.log(" $scope.concept_complt_percant :",$scope.concept_complt_percant);

            console.log("anchor or not anchor : ", sessionStorage.getItem("anchor"));
            
            
            // if($scope.concept_complt_percant == 100.00) {
            //     window.location.href = "#/conceptlist";
            // } else {
            //     window.location.href = "#/activities_list";
            // }

            $scope.activity_list = [];
            // list throught all the activities present in meta files
            for (var i = 0; i < keys_of_activity_list.length; i++) {
                // if selected floor is less then current floor - make all activities active by default
                if (Number(selectecfloor) < Number(currentfloor)) {
                    sessionStorage.setItem("activity_is_repeat", true);
                    var temp = {
                        "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                        "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                        "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                        "status_of_activity": "Active",
                        "is_current_activity": "No",
                        "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                    };
                    $scope.activity_list.push(temp);

                }
                // if selected floor & current floor are equal, but selected conceptroom less than current conceptroom, make all activities active by default
                else if ((Number(selectecfloor) == Number(currentfloor)) && (Number(selectedconceptroomorder) < Number(currentconcptroomorder))) {
                    sessionStorage.setItem("activity_is_repeat", true);
                    var temp = {
                        "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                        "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                        "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                        "status_of_activity": "Active",
                        "is_current_activity": "No",
                        "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                    };
                    $scope.activity_list.push(temp);

                }
                /*
                If selected floor & current floor as well as selected conceptroom and current concept roon both are equal then
                case 1: if user has not completed any activity in a concept, then API 8 will not have the concept key present, then in that case
                    1) All the activities should be deactivated except the one suggested by API 6 that gives next activity number.
                    2) The logic here is if (inside for loop), activity id from list is equal to next activity id, then make it active, rest all inactive
                Case 2: if user has completed an activity in a concept, then API 8 will have the concept key present, then in that case
                    1) All the activities that are less than the order of next activity will be set to active while the rest of the activities are inactive
                        1) Along with active, if the current activity and activity from list are same then current activity is set to be Yes, this is required to
                        show user which activity he should be playing next

                    Extra:
                        1) if next activity length is 0, that means user has cleared all the activities in that concept, hence is_repeat is set to true, this will be needed in cases, where user is still trying to play these activites and we need to sent the usage log

                */
                else if ((Number(selectecfloor) == Number(currentfloor)) && (Number(selectedconceptroomorder) == Number(currentconcptroomorder))) {
                    if (requestors_floor_conceptroom_activity.hasOwnProperty(selectedconcept) == false) {
                        sessionStorage.setItem("activity_is_repeat", false);
                        if (Number(activity_list[keys_of_activity_list[i]].activity_id) == Number(requestors_next_activity.activity_id)) {
                            var temp = {
                                "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                                "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                                "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                                "status_of_activity": "Active",
                                "is_current_activity": "Yes",
                                "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                            };
                            $scope.activity_list.push(temp);
                        } else {
                            var temp = {
                                "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                                "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                                "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                                "status_of_activity": "InActive",
                                "is_current_activity": "No",
                                "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                            };
                            $scope.activity_list.push(temp);
                        }
                    } else {
                        if (jQuery.isEmptyObject(requestors_next_activity)) {
                            sessionStorage.setItem("activity_is_repeat", true);
                            var temp = {
                                "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                                "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                                "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                                "status_of_activity": "Active",
                                "is_current_activity": "No",
                                "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                            };
                            $scope.activity_list.push(temp);
                        } else {
                            sessionStorage.setItem("activity_is_repeat", false);
                            if (Number(activity_list[keys_of_activity_list[i]].ordr_of_activity) <= Number(requestors_next_activity.ordr_of_activity)) {
                                if (Number(activity_list[keys_of_activity_list[i]].activity_id) == Number(requestors_next_activity.activity_id)) {
                                    var temp = {
                                        "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                                        "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                                        "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                                        "status_of_activity": "Active",
                                        "is_current_activity": "Yes",
                                        "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                                    };
                                    $scope.activity_list.push(temp);
                                }
                                else {
                                    var temp = {
                                        "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                                        "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                                        "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                                        "status_of_activity": "InActive",
                                        "is_current_activity": "No",
                                        "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                                    };
                                    $scope.activity_list.push(temp);
                                }
                            } else {
                                var temp = {
                                    "activity_name": activity_list[keys_of_activity_list[i]].activity_name,
                                    "activity_id": activity_list[keys_of_activity_list[i]].activity_id,
                                    "is_anchor": activity_list[keys_of_activity_list[i]].is_anchor,
                                    "status_of_activity": "InActive",
                                    "is_current_activity": "No",
                                    "order": activity_list[keys_of_activity_list[i]].ordr_of_activity
                                };
                                $scope.activity_list.push(temp);
                            }
                        }
                    }
                }
            }

            $scope.showActivity = true;
        }

        $scope.loadSelectedActivity = function (activityid, activityname, anchor) {
            console.log("$scope.concept_complt_percant : ", $scope.concept_complt_percant);
            
            sessionStorage.setItem("selectedactivity", activityid);
            sessionStorage.setItem("selectedactivityname", activityname);
            (anchor == true) ? sessionStorage.setItem("anchor", "Yes") : sessionStorage.setItem("anchor", "No");
            var activity_list = JSON.parse(sessionStorage.getItem("activity_list"));
            if (anchor == false) {
                sessionStorage.setItem("remedial_1", activity_list[activityid].remedial["1"].remedial_id);
                sessionStorage.setItem("remedial_2", activity_list[activityid].remedial["2"].remedial_id);
            }
            window.location.href = "#/activity";
        }

        $scope.goBacksLearnConceptlist = function () {
            window.location.href = "#/conceptlist"
        }

        this.init = function () {
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                /*$scope.baseLinkForScope = baselinkforfiles;
                $('body').removeClass('slearnbackground');
                $('body').removeClass('conceptroombackground');
                $('body').removeClass('slearn_subject_bg_color');*/
                $scope.showActivity = false;
                sessionStorage.setItem("menuid", 1);
                sessionStorage.setItem("inside_subject", "Yes");
                $scope.loadActivityList();
                $scope.imgUrl = baselinkforfiles;
                $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
                $scope.floorText = JSON.parse(sessionStorage.getItem("uiTextConfig")).floor;
                $scope.conceptroomText = JSON.parse(sessionStorage.getItem("uiTextConfig")).conceptroom;
                $scope.conceptText = JSON.parse(sessionStorage.getItem("uiTextConfig")).concept;
                $scope.per_complete = JSON.parse(sessionStorage.getItem("uiTextConfig")).completed; //this is ui_text_config file, use html file
            }
        }
        this.init();
    });
