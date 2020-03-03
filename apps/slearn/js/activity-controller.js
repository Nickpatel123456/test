angular.module('sledstudio')
    .controller('ActivityController', function (errorFactory, basicFactory, logOutFactory, ajaxCallsFactory, $location, $scope, $compile) {

        this.init = function () {
            if (basicFactory.checkIfLoggedInCorrectly() == true && promiseOfSessionChecking != null) {
                $scope.slearnsubjectname = sessionStorage.getItem("slearnsubjectname");
                // $scope.baseLinkForScope = baselinkforfiles;
                sessionStorage.setItem("menuid", 1);
                /* $('body').removeClass('slearnbackground');
                 $('body').removeClass('conceptroombackground');
                 $('body').removeClass('slearn_subject_bg_color');*/
                sessionStorage.setItem("inside_subject", "Yes");
                $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
                $scope.selectedfloor = sessionStorage.getItem("selectedfloor");
                $scope.conceptroomname = sessionStorage.getItem("selected_conceptroom_name");
                $scope.conceptname = sessionStorage.getItem("selected_concept_name");
                $scope.activityname = sessionStorage.getItem("selectedactivityname");
                var activity_list = JSON.parse(sessionStorage.getItem("activity_list"));
                var template_id = activity_list[sessionStorage.getItem("selectedactivity")].game_id;
                var dictionary = JSON.parse(sessionStorage.getItem("dictionary"));

                var game_link = baselinkforfiles + "apps/slearn/slearntemplates/game" + template_id;
                // var game_link = baselinkforfiles + "apps/slearn/slearntemplates/game" + template_id;

                sessionStorage.setItem("level", sessionStorage.getItem("selectedactivity"));
                var dictionary = JSON.parse(sessionStorage.getItem("dictionary"));
                sessionStorage.setItem("subject", dictionary.subject[sessionStorage.getItem("slearnsubject")].name.slearn_folder);
                sessionStorage.setItem("templateid", template_id);

                $scope.playActivityId = sessionStorage.getItem("level");

                var getSubjectTime = slearn_backend_api + "getstudents/weeklysubjectusagesummary";
                ajaxCallsFactory.getCall(getSubjectTime)
                    .then(function (response) {
                        var slearn_config = JSON.parse(sessionStorage.getItem("slearn_config"));
                        var subject_usage_limitation = slearn_config.subject_usage_limitation;
                        var student_standard = String(JSON.parse(localStorage.getItem('loginresponse')).student_detail.standard_id);
                        var subjectid = sessionStorage.getItem("slearnsubject");
                        var weekely_subject_usage_limit = Number(subject_usage_limitation[subjectid][student_standard].duration_usage_limit);
                        var actual_usage = (response.data.data.hasOwnProperty(subjectid) == true) ? Number(response.data.data[subjectid].duration) : 0;
                        if (actual_usage < weekely_subject_usage_limit) {
                            var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                            ajaxCallsFactory.getCall(getCurrentTime)
                                .then(function (response) {
                                    sessionStorage.setItem("activity_start_time", response.data.data.timestamp);
                                    $('.myIframe').css('height', $(window).height() + 'px');

                                    document.getElementById("activityContent").innerHTML = '<iframe style="width:100%;" allowfullscreen src="' + game_link + '" class="myIframe"></iframe>';
                                    $('.myIframe').css('height', $(window).height() + 'px');
                                    $compile('.myIframe')($scope);
                                }, function (error) {
                                    errorFactory.errorWindowCloseModal("Getting Server time failed");
                                });
                        }
                        else {
                            slearnErrorFactory.subjectWeeklyUsageErrorModal("You weekly usage time for this subject is up. Please use other subjects.");
                        }
                    }, function (error) {
                        errorFactory.errorWindowCloseModal("Getting weekly usage time failed");
                    });
            } else {
                // Yet to decide whether to logout or loguserout
                logOutFactory.logOut();
            }
        }
        this.init();

        $scope.goBacksLearnActivitylist = function () {
            var sub = sessionStorage.getItem('slearnsubject');

            var check_conceptroom_completion_per = slearn_backend_api + "getstudents/currentconceptoom/subject/" + sub;

            ajaxCallsFactory.getCall(check_conceptroom_completion_per)
                .then(function (conceptroom_res) {
                    var current_conceptroom_completion_percentage = conceptroom_res.data.data.conceptroom_completion_percentage.toFixed(2);
                    var current_floor_completion_percentage = conceptroom_res.data.data.floor_completion_percentage.toFixed(2);

                    console.log("$scope.current_conceptroom_completion_percentage 0 : ", current_conceptroom_completion_percentage);
                    if (sessionStorage.getItem("remedial1_duration") == null && sessionStorage.getItem("remedial2_duration") == null) {
                        // console.log("if call");
                        console.log('asdasdadaasd : ', sessionStorage.getItem('current_activity_is_anchor'));
                        console.log('asd : ', current_conceptroom_completion_percentage);
                        if (sessionStorage.getItem('current_activity_is_anchor') === "true" && sessionStorage.getItem('anchor_pass_or_not') === "pass") {
                            if (current_conceptroom_completion_percentage == 0.00) {
                                if (current_floor_completion_percentage == 0.00) {
                                    window.location.href = "#/slearn";
                                    console.log("went inside if call")
                                } else {
                                    window.location.href = "#/conceptroom";
                                    console.log("went inside else call :", current_floor_completion_percentage);
                                }

                            } else {
                                window.location.href = "#/conceptlist";
                            }

                        } else {
                            window.location.href = "#/activities_list";
                        }

                    } else {
                        // console.log("else call");
                        var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                        ajaxCallsFactory.getCall(getCurrentTime)
                            .then(function (response) {
                                if (sessionStorage.getItem("clickremedial2") == "yes") {
                                    // console.log("remedial2_duration")
                                    var remedial_usage = response.data.data.timestamp - Number(sessionStorage.getItem("remedial2_duration"));
                                    var remedialusagedata = JSON.stringify({
                                        "subject_id": Number(sessionStorage.getItem("slearnsubject")),
                                        "remedial_id": Number(sessionStorage.getItem("remedial_2")),
                                        "activity_id": Number(sessionStorage.getItem("selectedactivity")),
                                        "duration": remedial_usage
                                    });
                                    sessionStorage.removeItem("clickremedial2");
                                } else {
                                    // console.log("remedial1_duration")
                                    var remedial_usage = response.data.data.timestamp - Number(sessionStorage.getItem("remedial1_duration"));
                                    var remedialusagedata = JSON.stringify({
                                        "subject_id": Number(sessionStorage.getItem("slearnsubject")),
                                        "remedial_id": Number(sessionStorage.getItem("remedial_1")),
                                        "activity_id": Number(sessionStorage.getItem("selectedactivity")),
                                        "duration": remedial_usage
                                    });
                                }

                                var remedial_url = backend_api_base + "slearn/submit/student/remedialusage";
                                ajaxCallsFactory.postCall(remedial_url, remedialusagedata)
                                    .then(function (response1) {
                                        sessionStorage.removeItem("remedial1_duration");
                                        sessionStorage.removeItem("remedial2_duration");
                                        window.location.href = "#/activities_list";
                                    }, function (error) {
                                        errorFactory.errorWindowCloseModal("send server data failed");
                                    });

                            }, function (error) {
                                errorFactory.errorWindowCloseModal("Getting Server time failed");
                            });
                    }

                });


        }

        $scope.goOut = function () {
            window.location.href = "#/";
        }

        $scope.goToSubject = function () {
            window.location.href = "#/slearn_subject";
        }
    });
