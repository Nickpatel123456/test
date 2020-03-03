angular.module('sledstudio')
    .controller('Slate9ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, barchartcolorServices, convertHourServices, weekyeardataServices, geturlServices) {
        $scope.loadStandard9 = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (resStandard) {
                    $scope.standarddata9 = [];
                    for (var key in resStandard.data.standard_division_map) {
                        if (key > 4) {
                            $scope.standarddata9.push(key);
                        }
                    }
                }, function (error) {
                    console.log("can not get stndard data school json file")
                });
        }
        $scope.loadStandard9();

        $scope.getDivisionData9 = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    var divId = response.data.standard_division_map[$scope.standard_data9];
                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            $scope.divisiondata9 = [];
                            for (var k in divId)
                                $scope.divisiondata9.push({
                                    divid: divId[k],
                                    divname: response1.data.division[divId[k]].name
                                });
                        }, function (error) {
                            console.log("can not get Dicttonary data school json file")
                        });
                }, function (error) {
                    console.log("can not get slearn_config data")
                });
        }

        $scope.getSubjectData_Std = function () {
            var std_id = $scope.standard_data9;
            ajaxCallsFactory.getCall(slate_config)
                .then(function (response) {
                    var stdwisesubid = response.data.standard_subject_map[std_id];
                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            $scope.subject_details_data = [];
                            angular.forEach(stdwisesubid, function (value, index) {
                                this.push({id: value, name: response1.data.subject[value].name})
                            }, $scope.subject_details_data);
                        });
                });
        }

        $scope.semester = function () {
            $scope.semester_data = [
                {id: 1, name: 'Sem 1'},
                {id: 2, name: 'Sem 2'}
            ]
        };


        $scope.chapterDetails = function () {
            var std_id = $scope.standard_data9;
            var sub_id = $scope.subject_data9;
            var sem_id = $scope.semester_id;
            ajaxCallsFactory.getCall(slateTextBookChapter_config)
                .then(function (response) {
                    var chapid = response.data;
                    $scope.store_chapter_data = [];
                    for (var i = 0; i <= 20; i++) {
                        if (chapid[std_id + '' + sem_id + '' + sub_id + '' + i]) {
                            $scope.store_chapter_data.push(chapid[std_id + '' + sem_id + '' + sub_id + '' + i]);
                        }
                    }
                });
        }

        $scope.loadStudentChaptMarks = function () {
			dataModalServices.openMoldal();
            $scope.showChapTable = false;
            $scope.student_kbc_data = [];
            console.log($scope.standard_data9);
            console.log($scope.semester_id);
            console.log($scope.subject_data9);
            console.log($scope.chapter_id);
            var text_book_chapter_id = $scope.standard_data9 + $scope.semester_id + $scope.subject_data9 + $scope.chapter_id;
            console.log(text_book_chapter_id);
            var swa_kbc_data = JSON.stringify({
                division_id: $scope.division_data9,
                text_book_chapter_id: text_book_chapter_id
            });
            var auth_id = sessionStorage.getItem('user_session_key');
            var user_id = sessionStorage.getItem('user_id');
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'user-info': user_id,
                'Authorization': auth_id
            };

            $.ajax({
                type: "POST",
                url: backend_api_base + 'slate/dashboard/local/chapassessment',
                data: swa_kbc_data,
                headers: headers,
                crossDomain: true,
                success: function (response) {
                    $scope.kbc_data = response.data;
                    console.log($scope.kbc_data);
        
					if(Object.keys($scope.kbc_data).length == 0) {
						dataModalServices.closeModal();
						return;
					}

                    var school_id = sessionStorage.getItem("schoolid");

                    var data = JSON.stringify({
                        "school_id": school_id,
                        "standard_id": $scope.standard_data9,
                        "division_id": $scope.division_data9
                    });

                    var studentUrlPath = dashboardServices.getStudentDetails(data);

                    ajaxCallsFactory.getCall(studentUrlPath)
                        .then(function (response1) {
                            var studentDetailsData = response1.data.data;

                            angular.forEach($scope.kbc_data, function (value, key) {
                                var studentname = studentDetailsData[key].user_detail.first_name + " " + studentDetailsData[key].user_detail.last_name;
                                $scope.student_kbc_data.push({
                                    student_name: studentname,
                                    total_ques: value[0].total_question,
                                    attmp_ques: value[0].attempt_question,
                                    right_ans: value[0].correct_question,
                                    marks_obtained: value[0].correct_question
                                });
								dataModalServices.closeModal();
                                $scope.showChapTable = true;
                            });
                        });
                }
            });
        }
    });