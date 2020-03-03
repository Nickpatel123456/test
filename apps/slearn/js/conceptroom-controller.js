angular.module('sledstudio')
    .controller('ConceptroomController', function (errorFactory, basicFactory, ajaxCallsFactory, $scope, geturlServices) {
        this.init = function () {
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                // $scope.baseLinkForScope = baselinkforfiles;
                $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
                sessionStorage.setItem("menuid", 1);
                $('body').removeClass("slearnbackground");
                $('body').removeClass('slearn_subject_bg_color');
                $('body').addClass("conceptroombackground");
                sessionStorage.setItem("inside_subject", "Yes");

                $scope.opendoor = baselinkforfiles + "apps/slearn/images/door_open.png";
                $scope.closedoor = baselinkforfiles + "apps/slearn/images/door_close.png";
                $scope.floorText = JSON.parse(sessionStorage.getItem("uiTextConfig")).floorLevel; //this is ui_text_config file, use html file
                $scope.per_complete = JSON.parse(sessionStorage.getItem("uiTextConfig")).completed; //this is ui_text_config file, use html file
                $scope.selectedFloor = Number(sessionStorage.getItem("selectedfloor"));
                var subjectid = sessionStorage.getItem("slearnsubject");

                var currentFloorLink = slearn_backend_api + "getstudents/currentconceptoom/subject/" + subjectid;
                ajaxCallsFactory.getCall(currentFloorLink)
                    .then(function (response1) {
                        sessionStorage.setItem("currentfloor", response1.data.data.floor_id);
                        sessionStorage.setItem("current_conceptroom", response1.data.data.conceptroom_id);
                        sessionStorage.setItem("current_order_conceptoom", response1.data.data.ordr_of_conceptroom);
                        //console.log(response1.data.data)
                        $scope.conceptpercentage = response1.data.data.conceptroom_completion_percentage;
                        //sessionStorage.setItem("percentage_completion_details_conceptroom", JSON.stringify(response1.data.data));
                        //console.log($scope.conceptpercentage)
                        if ($scope.conceptpercentage == undefined) {
                            $scope.conceptpercentage1 = 0;
                        } else if ($scope.conceptpercentage == 0) {
                            $scope.conceptpercentage1 = 0;
                        } else {
                            $scope.conceptpercentage1 = $scope.conceptpercentage.toFixed(2);
                        }

                        var currentFloor = Number(sessionStorage.getItem("currentfloor"));
                        var currentConceptRoomOrder = sessionStorage.getItem("current_order_conceptoom");

                        var urlBase = geturlServices.floorJson(sessionStorage.getItem("slearnsubject"));
                        ajaxCallsFactory.getCall(urlBase)
                            .then(function (response) {
                                var required_details = response.data.floor[$scope.selectedFloor].conceptroom;
                                var keys_of_conceptroom = Object.keys(required_details);
                                $scope.conceptrooms = [];
                                for (var i = 0; i < keys_of_conceptroom.length; i++) {
                                    $scope.conceptrooms[i] = {};
                                    if ($scope.selectedFloor < currentFloor) {
                                        $scope.conceptrooms[i] = {
                                            "conceptroom_id": required_details[keys_of_conceptroom[i]].conceptroom_id,
                                            "name": required_details[keys_of_conceptroom[i]].conceptroom_name,
                                            "status": "Complete",
                                            "order": required_details[keys_of_conceptroom[i]].ordr_of_conceptroom
                                        };
                                    } else if ($scope.selectedFloor == currentFloor) {
                                        if (Number(required_details[keys_of_conceptroom[i]].ordr_of_conceptroom) < currentConceptRoomOrder) {
                                            $scope.conceptrooms[i] = {
                                                "conceptroom_id": required_details[keys_of_conceptroom[i]].conceptroom_id,
                                                "name": required_details[keys_of_conceptroom[i]].conceptroom_name,
                                                "status": "Complete",
                                                "order": required_details[keys_of_conceptroom[i]].ordr_of_conceptroom
                                            };
                                        } else if (Number(required_details[keys_of_conceptroom[i]].ordr_of_conceptroom) > currentConceptRoomOrder) {
                                            $scope.conceptrooms[i] = {
                                                "conceptroom_id": required_details[keys_of_conceptroom[i]].conceptroom_id,
                                                "name": required_details[keys_of_conceptroom[i]].conceptroom_name,
                                                "status": "Close",
                                                "order": required_details[keys_of_conceptroom[i]].ordr_of_conceptroom
                                            };
                                        } else if (Number(required_details[keys_of_conceptroom[i]].ordr_of_conceptroom) == currentConceptRoomOrder) {
                                            $scope.conceptrooms[i] = {
                                                "conceptroom_id": required_details[keys_of_conceptroom[i]].conceptroom_id,
                                                "name": required_details[keys_of_conceptroom[i]].conceptroom_name,
                                                "status": "Open",
                                                "order": required_details[keys_of_conceptroom[i]].ordr_of_conceptroom
                                            };
                                        }
                                    }
                                }
                            }, function (error) {
                                errorFactory.errorWindowCloseModal("Cannot get activities metadata");
                            });
                    }, function (error) {
                        errorFactory.errorWindowCloseModal("Cannot get current floor data.");
                    });
                $scope.subjectnametodisplayornot = true;
            }
        }
        this.init();

        $scope.goBacksLearnFloor = function () {
            window.location.href = "#/slearn";
        }

        $scope.goToConceptsPage = function (conceptroom, statusofconceptroom, conceptroomorder) {
            if (statusofconceptroom == "Close") {
                errorFactory.errorModal("તમને આ કન્સેપ્ટ રૂમની પરવાનગી નથી. પહેલાં આગળનો કન્સેપ્ટ રૂમ પૂરો કરો.");
            } else {
                sessionStorage.setItem("selectedconceptroom", conceptroom);
                sessionStorage.setItem("selectedconceptroomorder", conceptroomorder);
                window.location.href = "#/conceptlist";
            }
        }
    });
