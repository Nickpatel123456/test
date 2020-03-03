angular.module('sledstudio')
    .controller('SlearnsubjectController', function (errorFactory, basicFactory, subjectLoggingFactory, slearnErrorFactory, ajaxCallsFactory, $scope) {

        this.init = function () {
            $scope.listofallowedsubjects = {};
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                subjectLoggingFactory.closeSubjectService();
                $('body').removeClass('conceptroombackground');
                $('body').addClass('slearnbackground');
                // $('body').addClass('slearn_subject_bg_color');
                sessionStorage.setItem("menuid", 1);
                $scope.subjectimgpath = baselinkforfiles + "apps/slearn/images/";
                $scope.imageext = ".png";
                sessionStorage.setItem("inside_subject", "No");

                ajaxCallsFactory.getCall(dictionary)
                    .then(function (response) {
                        sessionStorage.setItem("dictionary", JSON.stringify(response.data));

                        ajaxCallsFactory.getCall(slearn_config)
                            .then(function (response1) {
                                sessionStorage.setItem("slearn_config", JSON.stringify(response1.data));
                                $scope.listofallowedsubjects = {};

                                var dictionary = JSON.parse(sessionStorage.getItem("dictionary"));
                                var slearn_config = JSON.parse(sessionStorage.getItem("slearn_config"));
                                var subject_usage_limitation = slearn_config.subject_usage_limitation;
                                var student_standard = String(JSON.parse(localStorage.getItem('loginresponse')).student_detail.standard_id);
                                var allowed_slearn_subjects = Object.keys(subject_usage_limitation);

                                //this foor loop show the subject depend on standard_id when user login slearn
                                for (var i = 0; i < allowed_slearn_subjects.length; i++) {
                                    if (subject_usage_limitation[allowed_slearn_subjects[i]].hasOwnProperty(student_standard)) {
                                        $scope.listofallowedsubjects[allowed_slearn_subjects[i]] = {};
                                        $scope.listofallowedsubjects[allowed_slearn_subjects[i]] = {"gujname": dictionary.subject[allowed_slearn_subjects[i]].name.gj};
                                    }
                                }

                                var url_slearn_completion = backend_api_base + "slearn/getstudents/currentslearncompletionstatus";
                                ajaxCallsFactory.getCall(url_slearn_completion)
                                    .then(function (response) {
                                        // console.log(response.data.data.slearn_completion_percentage);
                                        $scope.slearncompletionstatus = response.data.data.slearn_completion_percentage;

                                        $scope.student_completion_data = [];
                                        var sub_id = Object.keys($scope.listofallowedsubjects);

                                        function studentcompletionperrecursive(start, end) {
                                            if (start > end - 1) {
                                                return;
                                            }
                                            var temp_sub_id = sub_id[start];
                                            var url_Path = backend_api_base + "slearn/getstudents/currentconceptoom/subject/" + temp_sub_id;
                                            ajaxCallsFactory.getCall(url_Path)
                                                .then(function (res) {
                                                    $scope.student_sub_completion_data = res.data.data;
                                                    // console.log($scope.student_sub_completion_data);
                                                    $scope.student_completion_data.push({
                                                        subid: temp_sub_id,
                                                        subname: $scope.listofallowedsubjects[sub_id[start]].gujname,
                                                        subject_completion_percentage: $scope.student_sub_completion_data.subject_completion_percentage,
                                                        floor_completion_percentage: $scope.student_sub_completion_data.floor_completion_percentage,
                                                        conceptroom_completion_percentage: $scope.student_sub_completion_data.conceptroom_completion_percentage
                                                    });
                                                    studentcompletionperrecursive(start + 1, end)
                                                }, function (error) {
                                                    errorFactory.errorWindowCloseModal("Getting student completion status failed");
                                                });
                                        }

                                        studentcompletionperrecursive(0, sub_id.length)
                                    });
                            }, function (error) {
                                errorFactory.errorWindowCloseModal("Get slearn config failed");
                            });

                    }, function (error) {
                        errorFactory.errorWindowCloseModal("Getting dictionary failed");
                    });
            }
        }

        $scope.goToFloorPage = function (subjectid) {
            //console.log(subjectid);
            $scope.subjectname = JSON.parse(sessionStorage.getItem("uiTextConfig")).subject[subjectid].name.gj;

            sessionStorage.setItem("slearnsubjectname", $scope.subjectname);
            //console.log($scope.subjectname);

            //this below api get the weekwise student subject usage duration
            var getSubjectTime = slearn_backend_api + "getstudents/weeklysubjectusagesummary";
            ajaxCallsFactory.getCall(getSubjectTime)
                .then(function (response) {
                    var slearn_config = JSON.parse(sessionStorage.getItem("slearn_config"));
                    var subject_usage_limitation = slearn_config.subject_usage_limitation;
                    var student_standard = String(JSON.parse(localStorage.getItem('loginresponse')).student_detail.standard_id);
                    var weekely_subject_usage_limit = Number(subject_usage_limitation[subjectid][student_standard].duration_usage_limit);
                    var actual_usage = (response.data.data.hasOwnProperty(subjectid) == true) ? Number(response.data.data[subjectid].duration) : 0;

                    //this if condition check the weekwise stundent subject usage is finish or not
                    if (actual_usage < weekely_subject_usage_limit) {
                        sessionStorage.setItem("slearnsubject", subjectid);
                        window.location.href = "#/slearn";
                    } else {
                        //this below factory is define the slearn/slearnfactory.js file
                        slearnErrorFactory.subjectWeeklyUsageErrorModal("આ વિષય માટેનો તમારો સાપ્તાહિક ઉપયોગનો સમય સમાપ્ત થઈ ગયો છે કૃપા કરીને અન્ય વિષયોનો ઉપયોગ કરો.");
                    }

                }, function (error) {
                    errorFactory.errorWindowCloseModal("Getting weekly usage time failed");
                });
        }
        this.init();
    });
