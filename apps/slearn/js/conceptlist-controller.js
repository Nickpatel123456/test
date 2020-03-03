angular.module('sledstudio')
    .controller('ConceptlistController', function (errorFactory, basicFactory, ajaxCallsFactory, $scope, geturlServices, $rootScope) {
        this.init = function () {
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                // $scope.baseLinkForScope = baselinkforfiles;
                sessionStorage.setItem("menuid", 1);
                $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
                // $('body').removeClass('slearnbackground');
                // $('body').removeClass('conceptroombackground');
                $('body').removeClass('slearn_subject_bg_color');
                sessionStorage.setItem("inside_subject", "Yes");
                $scope.per_complete = JSON.parse(sessionStorage.getItem("uiTextConfig")).completed; //this is ui_text_config file, use html file
                $scope.floorText = JSON.parse(sessionStorage.getItem("uiTextConfig")).floor;
                $scope.conceptroomText = JSON.parse(sessionStorage.getItem("uiTextConfig")).conceptroom;
                $scope.selectedfloor = sessionStorage.getItem("selectedfloor");
                var selectedconceptroom = sessionStorage.getItem("selectedconceptroom");
                $scope.conceptimage = baselinkforfiles + "apps/slearn/images/concept.png";

                var urlBase = geturlServices.conceptroomJson(sessionStorage.getItem("slearnsubject"), $scope.selectedfloor);
                ajaxCallsFactory.getCall(urlBase)
                    .then(function (response) {
                        sessionStorage.setItem("conceptroom_response", JSON.stringify(response.data));
                        $scope.conceptroomname = response.data.conceptroom[selectedconceptroom].conceptroom_name;
                        $scope.list_of_concepts = response.data.conceptroom[selectedconceptroom].concept;
                        sessionStorage.setItem("list_of_concepts", JSON.stringify(response.data.conceptroom[selectedconceptroom].concept));

                        var concept_list_percantage = slearn_backend_api + "getstudents/currentflooractivitysummary/subject/" + sessionStorage.getItem("slearnsubject")
                        ajaxCallsFactory.getCall(concept_list_percantage)
                            .then(function (response1) {
                                $scope.concept_list_percantagedata = response1.data.data;
                                $rootScope.concept_completion_percentage1 = [];
                                var currentFloor = Number(sessionStorage.getItem("currentfloor"));
                                var selectedFloor = Number(sessionStorage.getItem("selectedfloor"));
                                var currentConceptOrder = Number(sessionStorage.getItem("current_order_conceptoom"));
                                var selectedConceptroomOrder = Number(sessionStorage.getItem("selectedconceptroomorder"));

                                for (var k in $scope.list_of_concepts) {
                                    if (selectedFloor < currentFloor) {
                                        $rootScope.concept_completion_percentage1.push(100);
                                    } else if ((selectedFloor == currentFloor) && (selectedConceptroomOrder < currentConceptOrder)) {
                                        $rootScope.concept_completion_percentage1.push(100);
                                    } else if ((selectedFloor == currentFloor) && (selectedConceptroomOrder == currentConceptOrder)) {
                                        if ($scope.concept_list_percantagedata[k] != undefined) {
                                            $rootScope.concept_completion_percentage1.push($scope.concept_list_percantagedata[k].concept_completion_percentage.toFixed(2));
                                        } else {
                                            $rootScope.concept_completion_percentage1.push(0);
                                        }
                                    }
                                }
                                sessionStorage.setItem("concept_completion_percentage", $scope.concept_completion_percentage1);
                            }, function (error) {
                                errorFactory.errorWindowCloseModal("Cannot get activities metadata");
                            });
                    }, function (error) {
                        errorFactory.errorWindowCloseModal("Cannot get activities metadata");
                    });
            }
            $scope.subjectnametodisplayornot = true;
        }
        this.init();

        $scope.goToConcept = function (conceptid, selectedConceptIndex) {
            sessionStorage.setItem("selectedconcept", conceptid);
            sessionStorage.setItem("selectedConceptIndex", selectedConceptIndex);
            window.location.href = "#/activities_list"
        }

        $scope.goBacksLearnConceptroom = function () {
            window.location.href = "#/conceptroom"
        }
    });
