angular.module('sledstudio')
    .controller('MonitoringslquizController', function ($scope, errorFactory, ajaxCallsFactory, $window, $interval, geturlServices, examMusterServices, LiveExamFactory, dataModalServices, metaserviceServices) {
        sessionStorage.setItem("menuid", 3);
        $scope.loadingImgUrl = baselinkforfiles + "images/source.gif";
        $scope.confirm = false;

        $scope.getStandardData = (function () {
            var examJsonPath = metaserviceServices.getExam();
            $.ajax({
                type: "GET",
                url: examJsonPath,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    var stdsubdetails = JSON.parse(response).standardsubjectdetail;
                    $scope.standardDetails = [];

                    ajaxCallsFactory.getCall(school_config)
                        .then(function (response1) {
                            angular.forEach(stdsubdetails, function (value, key) {
                                this.push({stdid: key, subid: value, divid: response1.data.standard_division_map[key]});
                            }, $scope.standardDetails);
                        });
                }
            });
        })();

        $scope.getDivisionData = function () {
            ajaxCallsFactory.getCall(dictionary)
                .then(function (response) {
                    $scope.divisiondetails = {};
                    var std_div_id = JSON.parse($scope.monitoring.standard).divid;
                    var divisiondata = response.data.division;

                    angular.forEach(std_div_id, function (value, key) {
                        $scope.divisiondetails[value] = divisiondata[value];
                    });
                });
        };

        $scope.getsubjectdata = function () {
            var subjectidlist = JSON.parse($scope.monitoring.standard).subid.sort(function (a, b) {
                return a - b;
            });
            var subJsonPath = metaserviceServices.getSubject();
            $.ajax({
                type: "GET",
                url: subJsonPath,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    var subjectdetails = JSON.parse(response);
                    $scope.subjectdetails = [];
                    angular.forEach(subjectidlist, function (value, key) {
                        this.push({subid: value, subname: subjectdetails[value].guj});
                    }, $scope.subjectdetails);
                }
            });
        }

        $scope.showLiveExamList = function () {
            $('#liveExamModal').modal('show');
            $scope.loadingImage = true;
            $.ajax({
                type: "GET",
                url: examMusterServices.getExamMusterData(""),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    var allDivisionname_list = JSON.parse(JSON.parse(sessionStorage.getItem('divisionmetadata')));
                    var allsubjectname_list = JSON.parse(JSON.parse(sessionStorage.getItem('subjectmetadata')));

                    $scope.liveExam_muster_data = [];
                    angular.forEach(data.data, function (value, key) {
                        $scope.liveExam_muster_data.push({
                            questionpaper_id: value.questionpaper_id,
                            standard: value.standard_id,
                            divisionid: value.division_id,
                            division: allDivisionname_list[value.division_id].guj,
                            subject: allsubjectname_list[value.subject_id].guj,
                            state: value.state,
                        });
                    });
                    $scope.loadingImage = false;
                    $scope.showMsg = false;
                }
            });
        }

        $scope.stopSlQuizExam = function (questionpaperid, divisionid) {
            $scope.loadingImage = true;
            $scope.showMsg = true;
            var info = JSON.stringify({questionpaper_id: questionpaperid, division_id: divisionid, state: "STOP"});
            $.ajax({
                type: "POST",
                url: examMusterServices.setExamMusterData(),
                data: info,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    $scope.showLiveExamList();
                }
            });
        }

        //this below function work logout session
        $scope.forcefullyLout = function (user_id) {
            var logoutUrl = geturlServices.forcefullyLogoutServices(user_id); //this api pass the userid then that user logout session
            ajaxCallsFactory.getCall(logoutUrl)
                .then(function (resLogout) {
                    errorFactory.errorModal(resLogout.data.message);
                }, function (error) {
                    errorFactory.errorModal("This User can't Active" + error.data.message);
                });
        };

        $scope.confirmLogout = function () {
            $('#confirm').modal('show');
			$('#deleteMsg').html('');
        };

        $scope.allStudentLogout = function () {
            $scope.confirm = true;
            let data = JSON.stringify({
                "school_id": JSON.parse(localStorage.getItem("loginresponse")).user_detail.school_id,
                "standard_id": $scope.standard_id,
                "division_id": $scope.division_id
            });
            let urlPath1 = examMusterServices.getStudentDetails(data); //this api declare factory.js file and get student details
            ajaxCallsFactory.getCall(urlPath1)
                .then(function (res) {
                    let studentIdList = Object.keys(res.data.data);

                    function forceLogoutAllStudent(start, end) {
                        if (start > end - 1) {
                            $scope.confirm = false;
                            $('#deleteMsg').html('All Student Logout Successfully');
                            console.log('All Student Logout Success');
                            return;
                        }
                        let logoutUrl = geturlServices.forcefullyLogoutServices(studentIdList[start]); //this api pass the userid then that user logout session
                        ajaxCallsFactory.getCall(logoutUrl)
                            .then(function (resLogout) {
                                forceLogoutAllStudent(start + 1, end);
                            }, function (error) {
                                errorFactory.errorModal("This User can't Active" + error.data.message);
                            });
                    }

                    forceLogoutAllStudent(0, studentIdList.length);
                });
        };

        $scope.showLiveExamData = function () {
            dataModalServices.openMoldal();
            $interval.cancel($scope.Timer);
            var schoolId = JSON.parse(localStorage.getItem("loginresponse")).user_detail.school_id;

            $scope.standard_id = JSON.parse($scope.monitoring.standard).stdid;
            $scope.subject_id = JSON.parse($scope.monitoring.subject).id;
            $scope.subname = JSON.parse($scope.monitoring.subject).name;
            $scope.division_id = JSON.parse($scope.monitoring.division).id;

            //this below api is declare the factory.js file
            var urlpath = examMusterServices.getExamMusterData("");
            $.ajax({
                type: "GET",
                url: urlpath,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (resexamMuster) {
                    $scope.examMuserdata = resexamMuster.data;
                    var checkExamStart = 1;

                    //this below foor loop match admin select std,sub and div exam is start or not
                    for (var i = 0; i < $scope.examMuserdata.length; i++) {
                        if ($scope.examMuserdata[i].standard_id == $scope.standard_id && $scope.examMuserdata[i].subject_id == $scope.subject_id && $scope.examMuserdata[i].division_id == $scope.division_id && $scope.examMuserdata[i].state == "START") {
                            checkExamStart = 0;
                            break;
                        } else {
                            checkExamStart = 1;
                        }
                    }

                    // checkExamStart == 0 exam is start, checkExamStart == 1 exam is not start
                    if (checkExamStart == 0) {
                        $scope.showliveexamtable = true;
                        $scope.printAllStudentFinalExamData = [];
                        loadData();
                        $scope.Timer = $interval(loadData, 10000);
                    } else {
                        $interval.cancel($scope.Timer);
                        $scope.showliveexamtable = false;
                        dataModalServices.closeModal();
                        $("<div title='Warning !!! '>There is no live exam.</div>").dialog({
                            modal: true,
                            buttons: {
                                Ok: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Getting metaservice standard Failed');
                    dataModalServices.closeModal();
                    errorFactory.errorModal("sLquiz Live Exam Server Not Started.");
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });

            //this below function is work set interval second (default set 15 second)
            function loadData() {
                $scope.allquestionbankid = [];
                $scope.storStudentWiseExamData = [];

                var jsonPath = LiveExamFactory.getQuestionBankId($scope.standard_id, $scope.subject_id);
                $.ajax({
                    type: "GET",
                    url: jsonPath,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    crossDomain: true,
                    success: function (responsequestion) {
                        var responsequestion = JSON.parse(responsequestion);
                        $scope.questionPaperId = responsequestion.questionpaper_id;

                        $scope.mcqsection1Questionbank = responsequestion.paper_questions_list.mcq.section_1;
                        $scope.mcqsection2Questionbank = responsequestion.paper_questions_list.mcq.section_2;

                        $scope.mcqSecion1Data = responsequestion.mcq.section_1; //this code is store all json Question data
                        $scope.mcqSecion2Data = responsequestion.mcq.section_2; //this code is store all json Question data

                        //this for loop store mcq section_1 questionbank_id
                        for (var k = 0; k < $scope.mcqsection1Questionbank.length; k++)
                            $scope.allquestionbankid.push($scope.mcqsection1Questionbank[k])

                        //this for loop store mcq section_2 questionbank_id
                        for (var k = 0; k < $scope.mcqsection2Questionbank.length; k++)
                            $scope.allquestionbankid.push($scope.mcqsection2Questionbank[k])

                        $scope.allquestionbankid.sort(function (a, b) {
                            return a - b
                        }); //this function sorting questionbankid array
                        $scope.totalquestionlength = $scope.allquestionbankid.length;

                        //this is store mcq section_1 and section_2 json file data
                        $scope.mcqSection1Section2QuestionData = [];
                        var tempStoreQuestion = [];

                        //this for loop store mcq section_1 question data
                        for (var k = 0; k < responsequestion.mcq.section_1.length; k++)
                            $scope.mcqSection1Section2QuestionData.push(responsequestion.mcq.section_1[k])


                        //this for loop store mcq section_2 question data
                        for (var k = 0; k < responsequestion.mcq.section_2.length; k++)
                            $scope.mcqSection1Section2QuestionData.push(responsequestion.mcq.section_2[k])

                        tempStoreQuestion = $scope.mcqSection1Section2QuestionData;
                        $scope.mcqSection1Section2QuestionData = [];

                        //this for loop store sorting question wise json data
                        for (var k = 0; k < $scope.allquestionbankid.length; k++) {
                            for (var l = 0; l < tempStoreQuestion.length; l++) {
                                if ($scope.allquestionbankid[k] == tempStoreQuestion[l].questionbank_id) {
                                    $scope.mcqSection1Section2QuestionData.push(tempStoreQuestion[l]);
                                    break;
                                }
                            }
                        }
                    }
                });

                var data = JSON.stringify({
                    "school_id": schoolId,
                    "standard_id": $scope.standard_id,
                    "division_id": $scope.division_id
                });
                var urlPath1 = examMusterServices.getStudentDetails(data); //this api declare factory.js file and get stundet details
                ajaxCallsFactory.getCall(urlPath1)
                    .then(function (response) {
                        var inactiveObj = JSON.stringify({
                            school_id: schoolId,
                            product_id: 1,
                            standard_id: $scope.standard_id,
                            division_id: $scope.division_id
                        });
                        $.ajax({
                            type: "POST",
                            url: skiilreport_backend_api + 'teacher/inactivestudents',
                            data: inactiveObj,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            crossDomain: true,
                            success: function (resInActiveStudent) {
                                $scope.studentlist = response.data.data; // this $scope store All Student Id Active & Inactive

                                $scope.studentkeyObj = [];
                                // this below for loop store Only Active Student Id List
                                angular.forEach($scope.studentlist, function (value, key) {
                                    if (resInActiveStudent.data[key]) {
                                    } else {
                                        $scope.studentkeyObj.push(key)
                                    }
                                });

                                var objdata = JSON.stringify({
                                    "standard_id": $scope.standard_id,
                                    "division_id": $scope.division_id,
                                    "subject_id": $scope.subject_id
                                });
                                $.ajax({
                                    type: "POST",
                                    url: LiveExamFactory.getLiveResultdata(),
                                    data: objdata,
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    crossDomain: true,
                                    success: function (responseLivedata) {
                                        dataModalServices.closeModal();
                                        //this below var store the student standard subject division wise take the question answer data
                                        $scope.allStudentExamdata = responseLivedata.data;

                                        //this below recursive function store student wise --> question id wise --> store answer id
                                        function studentExamRecursive(startStudentId, endStudentId) {
                                            if (startStudentId > endStudentId - 1) {
                                                $scope.totalStudentNo = $scope.storStudentWiseExamData.length;
                                                $scope.storStudentWiseExamData.sort(function (a, b) {
                                                    return a.showFirst - b.showFirst
                                                });

                                                var startCount = finishCount = naCount = 0;
                                                angular.forEach($scope.storStudentWiseExamData, function (value, key) {
                                                    if (value.userstate == 'START') {
                                                        startCount++;
                                                    } else if (value.userstate == 'FINISH') {
                                                        finishCount++;
                                                    } else if (value.userstate == 'NA') {
                                                        naCount++;
                                                    }
                                                });

                                                $scope.printAllStudentFinalExamData = $scope.storStudentWiseExamData;
                                                $scope.startCount = startCount;
                                                $scope.finishCount = finishCount;
                                                $scope.naCount = naCount;
                                                return;
                                            }

                                            var studentuserid = $scope.studentkeyObj[startStudentId];
                                            $scope.studentAnsdata = $scope.allStudentExamdata[studentuserid];

                                            var data1;
                                            var studentAllAnsdata = []; //store all answer json data
                                            if ($scope.studentAnsdata != undefined) {
                                                for (var k = 0; k < $scope.studentAnsdata.length; k++) {
                                                    data1 = $scope.studentAnsdata[k];
                                                    for (var key in data1)
                                                        studentAllAnsdata.push(data1[key]);
                                                }
                                            }

                                            var userstate; // this is store user use state START OR FINISH
                                            $.ajax({
                                                type: "POST",
                                                url: LiveExamFactory.getExamineeState(),
                                                data: objdata,
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json'
                                                },
                                                crossDomain: true,
                                                success: function (resState) {
                                                    if (resState.data[studentuserid] != undefined) {
                                                        userstate = resState.data[studentuserid].state;
                                                        if (userstate == "START") {
                                                            var color = "#B6F37C";
                                                            var showFirst = 1; // this var declare show first all row if student start exam
                                                        } else {
                                                            var color = "#F7A588";
                                                            var showFirst = 2; // this var declare show second all row if student finish exam
                                                        }
                                                    } else {
                                                        userstate = "NA";
                                                        var color = "#EEF0AC";
                                                        var showFirst = 3; // this var declare show second all row if student finish exam
                                                    }

                                                    //this code is both Mcq Section1 And Section2 Data And correct_answer
                                                    $scope.storeAllAnsdata = [];
                                                    var temp = [];
                                                    var useranswer, trueanswercount = 0;
                                                    for (var i = 0; i < $scope.allquestionbankid.length; i++) {
                                                        for (var j = 0; j < studentAllAnsdata.length; j++) {
                                                            if ($scope.allquestionbankid[i] === studentAllAnsdata[j].questionbank_id) {
                                                                //this comment code is right sing match correct answer code
                                                                // if($scope.mcqSection1Section2QuestionData[i].correct_answer == studentAllAnsdata[j].answer){
                                                                // useranswer = $sce.trustAsHtml("&#10003"); //this is right sign html code if useranswer and correct_answer match
                                                                // trueanswercount++; //this is count the total true answer
                                                                // }else{
                                                                // useranswer = studentAllAnsdata[j].answer; //this is if useranswer and correct_answer not match then user given answer shown
                                                                // }
                                                                useranswer = studentAllAnsdata[j].answer;
                                                                break;
                                                            } else {
                                                                useranswer = "NA";
                                                            }
                                                        }
                                                        temp.push(useranswer)
                                                    }
                                                    //end for loop

                                                    //this json stringify store username and useranswer one by one student
                                                    var studentansJson = JSON.stringify({
                                                        "userdetails": $scope.studentlist[studentuserid],
                                                        "answerdata": temp,
                                                        "trueanswer": trueanswercount,
                                                        "userstate": userstate,
                                                        "color": color,
                                                        "showFirst": showFirst
                                                    });

                                                    //this is store one by one student final store data
                                                    $scope.storStudentWiseExamData.push(JSON.parse(studentansJson)) //this array store final answersheet data

                                                    studentExamRecursive(startStudentId + 1, endStudentId);
                                                }
                                            });

                                            //this code all data and correct_answer Mcq Section1 Data
                                            // var temp1 = [];
                                            // var useranswerMcqSection1;
                                            // for(var i=0;i<$scope.mcqSecion1Data.length;i++){
                                            // for(var j=0;j<studentAllAnsdata.length;j++){
                                            // if($scope.mcqSecion1Data[i].questionbank_id == studentAllAnsdata[j].questionbank_id){
                                            // if($scope.mcqSecion1Data[i].correct_answer == studentAllAnsdata[j].answer){
                                            // useranswerMcqSection1 = $sce.trustAsHtml("&#10003"); //this is right sign html code if useranswer and correct_answer match
                                            // }else{
                                            // useranswerMcqSection1 = studentAllAnsdata[j].answer; //this is if useranswer and correct_answer not match then user given answer shown
                                            // }
                                            // break;
                                            // }else{
                                            // useranswerMcqSection1 = "NA";
                                            // }
                                            // }
                                            // temp1.push(useranswerMcqSection1)
                                            // }
                                            //end for loop

                                            //this code all data and correct_answer Mcq Section2 Data
                                            // var temp2 = [];
                                            // var useranswerMcqSection2;
                                            // for(var i=0;i<$scope.mcqSecion2Data.length;i++){
                                            // for(var j=0;j<studentAllAnsdata.length;j++){
                                            // if($scope.mcqSecion2Data[i].questionbank_id == studentAllAnsdata[j].questionbank_id){
                                            // if($scope.mcqSecion2Data[i].correct_answer == studentAllAnsdata[j].answer){
                                            // useranswerMcqSection2 = $sce.trustAsHtml("&#10003"); //this is right sign html code if useranswer and correct_answer match
                                            // }else{
                                            // useranswerMcqSection2 = studentAllAnsdata[j].answer; //this is if useranswer and correct_answer not match then user given answer shown
                                            // }
                                            // break;
                                            // }else{
                                            // useranswerMcqSection2 = "NA";
                                            // }
                                            // }
                                            // temp2.push(useranswerMcqSection2)
                                            // }
                                            //end for loop
                                        }

                                        studentExamRecursive(0, $scope.studentkeyObj.length);
                                    },
                                    error: function (xhr, ajaxOptions, thrownError) {
                                        console.log("Loading failed");
                                        dataModalServices.closeModal();
                                        console.log(xhr);
                                        console.log(ajaxOptions);
                                        console.log(thrownError);
                                        $interval.cancel($scope.Timer);
                                        $scope.showliveexamtable = false;
                                        $("<div title='Warning !!! '>Live Exam Monitoring Server Not Started! Please Start Server</div>").dialog({
                                            modal: true,
                                            buttons: {
                                                Ok: function () {
                                                    $(this).dialog("close");
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });

                    }, function (error) {
                        console.log("can not get student Data");
                        $interval.cancel($scope.Timer);
                    });
            }
        }
    });















