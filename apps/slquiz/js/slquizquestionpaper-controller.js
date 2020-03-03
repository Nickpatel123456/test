angular.module('sledstudio')
    .controller('SlquizquestionpaperController', function ($scope, $interval, $compile, $sce, metaserviceServices, geturlServices, ajaxCallsFactory, examMusterServices, slquizfactory, logOutFactory) {
        $scope.slquizQuestionPaper = {};
        $scope.question = null;
        $scope.option1 = null;
        $scope.option2 = null;
        $scope.option3 = null;
        $scope.option4 = null;
        $scope.quesno = null;
        $scope.stdno = null;
        $scope.mcqquestion = [];
        $scope.subjectivequestion = [];
        $scope.tempquestionpaper = [];
        var count = 0;
        $scope.questioncount = 0;
        var mcqshuffledquestionnumber = [];
        var subjectiveshuffledquestionnumber = [];
        $scope.tempquestioncount = 0;
        var mcqquestioncount = 0;
        var subjectivequestioncount = 0;
        var settingtimer = null;
        var skipqusArr = [];
        $scope.countSkipQuestion = 0;
        var skipcheck = false;
        var tempskipquesArr = [];
        var tempskipcount = 0;
        var gamecontinue = false;
        var timeleft, ansTimer, startexamSubId;
        $scope.showstartexam = false;
        clearInterval(ansTimer);

        $scope.hosturl = mainslquizurl + "/media/";
        var user = JSON.parse(localStorage.getItem("loginresponse"));
        var userid = user.student_detail.user_id;

        this.init = function () {
            var temp = slquizfactory.returnSlquizId(); //this api declare factory.js file and get the questionpaperId in exam.json file
            var filterdata = JSON.stringify({
                "questionpaper_id": temp,
                "user_id": userid,
                "standard_id": user.student_detail.standard_id,
                "division_id": user.student_detail.division_id
            });

            $scope.studentName = sessionStorage.getItem("first_name") + " " + sessionStorage.getItem("last_name");
            $scope.userID = user.user_detail.user_tag;
            var studentDivId = JSON.parse(JSON.parse(sessionStorage.getItem("divisionmetadata")))[user.student_detail.division_id].guj;
            $scope.standardId = user.student_detail.standard_id + ', ' + studentDivId;

            var urlpath = examMusterServices.checkExamineeStatus(filterdata); //this api check student status check std sub div exam finish or start
            $.ajax({
                type: "GET",
                url: urlpath,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    //this condition check user exam status start or finish
                    if (response.data.length == 0 || response.data[0].state != "FINISH") {
                        var statusdata = JSON.stringify({
                            "questionpaper_id": temp,
                            "division_id": user.student_detail.division_id,
                            "state": "START",
                            "user_id": userid,
                            "user_name": user.user_detail.user_tag,
                            "roll_number": user.student_detail.roll_number
                        });

                        var urlpath1 = examMusterServices.updateExamineeStatus();
                        $.ajax({
                            type: "POST",
                            url: urlpath1,
                            data: statusdata,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            crossDomain: true,
                            success: function (response) {
                                $scope.fetchedAskedPaper();
                            }
                        });
                    } else if (response.data[0].state == "FINISH") {
                        $("#loadQuestion").html('<quizover-block></quizover-block>');
                        $compile("#loadQuestion")($scope);
                    } else {
                        $scope.fetchedAskedPaper();
                    }
                }
            });
        };

        this.init();

        //this below code work if last answer submit then send exam strat time and exam finish time difference duration  send (this function declare inside gamefinish function)
        $scope.stundentStoreExamStartStopTime = function (userid, questionpaperid) {
            $scope.timerBtn = false;
            var studentSubExamStartStopTime = (parseInt(new Date().getTime() / 1000)) - localStorage.getItem("studentSubExamStartTime");
            var timeStampData = JSON.stringify({
                "userId": userid,
                "questionpaperId": questionpaperid,
                "responseJson": studentSubExamStartStopTime.toString()
            });

            var urlpath = examMusterServices.totalsubExamTime();
            $.ajax({
                type: "POST",
                url: urlpath,
                data: timeStampData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    console.log("Examinee Complete Exam Time Duration Updated");
                    $scope.goBackToTakeSlQuiz();
                }
            });
        }

        //this function assign 5 weakfullnest question if start the exam
        $scope.fetchedAskedPaper = function () {
            var temp = slquizfactory.returnSlquizId();
            var objdata = JSON.stringify({"questionpaper_id": temp});
            var urlpath = examMusterServices.getExamMusterData(objdata);
            $.ajax({
                type: "GET",
                url: urlpath,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    var jsonname = data.data[0].standard_id + "_" + data.data[0].subject_id + ".json";
                    var tempsubname = metaserviceServices.returnSubject();
                    startexamSubId = data.data[0].subject_id;
                    $scope.subjectName = tempsubname[startexamSubId].guj;
                    var exampaperdata = examMusterServices.getExamQuestions(jsonname);
                    $.ajax({
                        type: "GET",
                        url: exampaperdata,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success: function (response) {
                            var tempjsonname = examMusterServices.getWakefullnessQuestions("wakefullnesstest.json");
                            $.ajax({
                                type: "GET",
                                url: tempjsonname,
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: true,
                                success: function (response1) {
                                    // $scope.tempquestionpapertemp = response1;
                                    var examPaper = JSON.parse(response);
                                    $scope.slquizQuestionPaper = examPaper;
                                    $scope.slquizQuestionPaper.quizid = examPaper.questionpaper_id;
                                    $scope.slquizQuestionPaper.standard = examPaper.standard_id;
                                    var tempsub = metaserviceServices.returnSubject();
                                    $scope.slquizQuestionPaper.subject = tempsub[examPaper.subject_id].guj;

                                    var temp100 = examPaper.mcq.section_1;
                                    var temp101 = examPaper.mcq.section_2;
                                    var temp102 = examPaper.subjective.section_1;
                                    var temp103 = examPaper.subjective.section_2;

                                    $scope.checkIfUserAnsweredQuestion(temp100, temp101, temp102, temp103, JSON.parse(response1));
                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                    console.log('Getting metaservice exampaper Failed');
                                    console.log(xhr);
                                    console.log(ajaxOptions);
                                    console.log(thrownError);
                                }
                            });
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log('Getting metaservice standard Failed');
                            console.log(xhr);
                            console.log(ajaxOptions);
                            console.log(thrownError);
                        }
                    });
                }
            });
        }

        $scope.checkIfUserAnsweredQuestion = function (temp100, temp101, temp102, temp103, questionpapermap) {
            $scope.mcqquestiontemp = temp100.concat(temp101);
            $scope.subjectivequestiontemp = temp102.concat(temp103);
            var temp = slquizfactory.returnSlquizId();

            var userquizinfo = JSON.stringify({"user_id": userid, "questionpaper_id": temp});
            var urlpath = slquizfactory.checkUserSubmittedAnaswers(userquizinfo);
            $.ajax({
                type: "GET",
                url: urlpath,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    if (data.data.length == 0) {
                        // $scope.tempquestionpaper = $scope.tempquestionpapertemp;
                        $scope.tempquestionpaper = questionpapermap;
                        $scope.mcqquestion = $scope.mcqquestiontemp;
                        $scope.subjectivequestion = $scope.subjectivequestiontemp;

                        if (typeof $scope.mcqquestion.length === 'undefined') {
                            $scope.mcqquestion.length = 0;
                        }

                        if (typeof $scope.subjectivequestion.length === 'undefined') {
                            $scope.subjectivequestion.length = 0;
                        }

                        // console.log("length   : " + $scope.tempquestionpaper.mcq.section_1.length);
                        $scope.slquizQuestionPaper.totalquestion = $scope.mcqquestion.length + $scope.tempquestionpaper.mcq.section_1.length;

                        for (var i = 0; i < $scope.mcqquestion.length; i++) {
                            mcqshuffledquestionnumber[i] = i;
                            if ((user.student_detail.standard_id >= 5) && (i == $scope.mcqquestion.length - 1)) {
                                mcqshuffledquestionnumber = $scope.shuffle(mcqshuffledquestionnumber);
                            }
                        }

                        $("#startingmodal").html("<startquiz-modal> </startquiz-modal>");
                        $compile("#startingmodal")($scope);
                    } else {
                        var answeredquestions = data.data;

                        // $scope.tempquestionpaper = $scope.tempquestionpapertemp;
                        $scope.tempquestionpaper = questionpapermap;

                        for (var i = 0; i < answeredquestions.length; i++) {
                            $scope.mcqquestiontemp = $scope.removeByAttr($scope.mcqquestiontemp, "questionbank_id", answeredquestions[i]);
                            $scope.mcqquestion = $scope.mcqquestiontemp;
                        }

                        if (typeof $scope.mcqquestion.length === 'undefined') {
                            $scope.mcqquestion.length = 0;
                        }

                        $scope.slquizQuestionPaper.totalquestion = $scope.mcqquestion.length + $scope.tempquestionpaper.mcq.section_1.length;

                        for (var i = 0; i < $scope.mcqquestion.length; i++) {
                            mcqshuffledquestionnumber[i] = i;
                            if ((user.student_detail.standard_id >= 5) && (i == $scope.mcqquestion.length - 1)) {
                                mcqshuffledquestionnumber = $scope.shuffle(mcqshuffledquestionnumber);
                            }
                        }
                    }

                    $("#startingmodal").html("<startquiz-modal> </startquiz-modal>");
                    $(".questionpaperbackground").hide();
                    $compile("#startingmodal")($scope);
                }
            });
        }

        $scope.startPoppingQuestions = function () {
            $("#startquizmodalblock").hide();
            $(".questionpaperbackground").show();
            $scope.loadQuestionAndOptions();
            $scope.showstartexam = true;
        }

        $scope.removeByAttr = function (arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }

        $scope.shuffle = function (o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
            return o;
        }

        //this function work if user skip question then store skip question number
        $scope.skipQuestionNumber = function () {
            $scope.countSkipQuestion++;
            skipcheck = true;
            skipqusArr.push($scope.quesion_Number);
            if (gamecontinue == true) {
                //this function work first time all question finish after load skip question
                $scope.loadskipquestion();
            } else {
                //this function work first time start the exam without skip question
                $scope.loadQuestionAndOptions();
            }
        }

        //this function check if user skip the question and show jqyery modal --> select on ક્વિઝ ચાલુ રાખો
        $scope.gameContinue = function () {
            gamecontinue = true;
            skipcheck = false;
            tempskipquesArr = [];
            tempskipquesArr.length = 0;
            tempskipquesArr = skipqusArr;
            skipqusArr = [];
            tempskipcount = 0;

            for (var i = 0; i < tempskipquesArr.length; i++) {
                mcqshuffledquestionnumber[i] = tempskipquesArr[i];
            }

            $scope.questioncount = 0;
            $scope.loadskipquestion();
        }

        $scope.loadQuestionAndOptions = function () {
            var user_info = JSON.parse(localStorage.getItem('loginresponse')).user_detail.user_id;
            ajaxCallsFactory.getCall(geturlServices.checkUserLogin(user_info))
                .then(function (response) {
                    console.log(response.data);
                    console.log("gamecontinue : " + gamecontinue);
                    if (gamecontinue == true) {
                        $scope.loadskipquestion();
                    } else {
                        $scope.loadfirstimequestion();
                    }
                    $("#countdowntimer").html(JSON.parse(sessionStorage.getItem("uiTextConfig")).slquianstime);
                }, function (error) {
                    console.log('UnAuthorized User');
                    localStorage.clear();
                    window.location.href = '#/';
                });
        }

        $scope.showHideTimerBtnAfterSkipQues = function () {
            if (gamecontinue == true) $scope.timerBtn = false;
            else $scope.timerBtn = true;
        }

        //this function send back-end student exam status finish
        $scope.gamefinish = function () {
            $interval.cancel($scope.checkLoginTimer);
            var temp = slquizfactory.returnSlquizId();
            var statusdata = JSON.stringify({
                "questionpaper_id": temp,
                "division_id": user.student_detail.division_id,
                "state": "FINISH",
                "user_id": userid,
                "user_name": user.user_detail.user_tag,
                "roll_number": user.student_detail.roll_number
            });

            var urlpath1 = examMusterServices.updateExamineeStatus();
            $.ajax({
                type: "POST",
                url: urlpath1,
                data: statusdata,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    console.log("Examinee status updated to complete");
                    $scope.stundentStoreExamStartStopTime(userid, temp);

                    // localStorage.removeItem("slquizminutes"+userid+$scope.slquizQuestionPaper.quizid);
                    // $("#loadQuestion").html('<quizover-block></quizover-block>');
                    // $compile("#loadQuestion")($scope);
                }
            });
        }

        //this interval check admin stop the exam then auto logout student take the exam
        var checkExamStatus = setInterval(function () {
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
                    var responsedetails = resexamMuster.data;
                    var temp = slquizfactory.returnSlquizId();

                    for (var i = 0; i < responsedetails.length; i++) {
                        if (responsedetails[i].standard_id == user.student_detail.standard_id && responsedetails[i].division_id == user.student_detail.division_id && responsedetails[i].subject_id == startexamSubId && responsedetails[i].questionpaper_id == temp && responsedetails[i].state == 'STOP') {
                            clearInterval(checkExamStatus);
                            $scope.gamefinish();
                            break;
                        }
                    }
                }
            });
        }, 10000);

        $scope.showSlquizNextButton = function () {
            var ansemptyornot = jQuery.isEmptyObject($scope.slquizopt);
            $scope.skipbtndisable = true;
            if (timeleft === 0 && ansemptyornot === true) {
                $("#slquiznextbutton").hide();
            } else if (timeleft === 0 && ansemptyornot === false) {
                $("#slquiznextbutton").show();
            }
        }

        $scope.showorhideAnsBtn = function (timeleft) {
            var ansemptyornot = jQuery.isEmptyObject($scope.slquizopt);
            if (timeleft === 0 && ansemptyornot === true) {
                $("#slquiznextbutton").hide();
            } else if (timeleft === 0 && ansemptyornot === false) {
                $("#slquiznextbutton").show();
            }
        };

        $scope.goBackToTakeSlQuiz = function () {
            sessionStorage.setItem('logoutModal', 'hide');
            logOutFactory.logUserOut();
            // window.location.href="#/slquiz";
        }

        //this function work load all skip question
        $scope.loadskipquestion = function () {
            $scope.skipbtndisable = false;
            if (tempskipquesArr.length > tempskipcount) {
                $scope.countSkipQuestion--;
                if (tempskipcount == 0) {
                    var temp = metaserviceServices.returnSubject();
                    $scope.slquizopt = {};

                    $scope.quesion_Number = mcqshuffledquestionnumber[tempskipcount];

                    $scope.loadTypeOfQuestion("loadQuestion", String($scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].standard_id), temp[$scope.slquizQuestionPaper.subject_id].eng, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].code, String($scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].question_number), $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].questionText, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option1_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option2_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option3_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option4_text);

                    tempskipcount++;
                } else {
                    var info = JSON.stringify({
                        "user_id": userid,
                        "questionpaper_id": $scope.slquizQuestionPaper.quizid,
                        "questionbank_id": $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount - 1]].questionbank_id,
                        "answer": $scope.slquizopt
                    });
                    var jsonobject = JSON.parse(info);

                    if (($scope.slquizopt.length > 0 || jsonobject.answer.length == undefined) && skipcheck == true) {
                        var temp = metaserviceServices.returnSubject();
                        $scope.slquizopt = {};

                        $scope.quesion_Number = mcqshuffledquestionnumber[tempskipcount];

                        $scope.loadTypeOfQuestion("loadQuestion", String($scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].standard_id), temp[$scope.slquizQuestionPaper.subject_id].eng, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].code, String($scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].question_number), $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].questionText, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option1_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option2_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option3_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option4_text);
                        tempskipcount++;

                        skipcheck = false;
                    } else {
                        var urlpath1 = slquizfactory.submitSlquizAnswers();
                        $.ajax({
                            type: "POST",
                            url: urlpath1,
                            data: info,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            crossDomain: true,
                            success: function (response) {
                                var temp = metaserviceServices.returnSubject();
                                $scope.slquizopt = {};

                                $scope.quesion_Number = mcqshuffledquestionnumber[tempskipcount];

                                $scope.loadTypeOfQuestion("loadQuestion", String($scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].standard_id), temp[$scope.slquizQuestionPaper.subject_id].eng, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].code, String($scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].question_number), $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].questionText, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option1_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option2_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option3_text, $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount]].option4_text);
                                tempskipcount++;
                            }
                        });
                    }
                }
            } else {
                $("#slquiznextbutton,#skipbutton").attr("disabled", "disabled");
                if ($scope.slquizopt.length == 1) {
                    var info = JSON.stringify({
                        "user_id": userid,
                        "questionpaper_id": $scope.slquizQuestionPaper.quizid,
                        "questionbank_id": $scope.mcqquestion[mcqshuffledquestionnumber[tempskipcount - 1]].questionbank_id,
                        "answer": $scope.slquizopt
                    });

                    var urlpath1 = slquizfactory.submitSlquizAnswers();
                    $.ajax({
                        type: "POST",
                        url: urlpath1,
                        data: info,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success: function (response) {
                            console.log("Skip After Last Answer Submited");
                            $scope.skipAfterLastAnsSubmit();
                        }
                    });
                } else {
                    $scope.skipAfterLastAnsSubmit();
                }
            }
        }

        //this function work if user take last question answer submit after check skip question Array is blank Or Not
        $scope.skipAfterLastAnsSubmit = function () {
            if (skipqusArr.length == 0) {
                $scope.skipbtndisable = true;
                $scope.gamefinish();
            } else if (skipqusArr.length > 0 || tempskipquesArr.length > 0) {
                count++;
                $('<div title="સૂચના :" id="quescon">તમારે  <span class="skipquescount"></span> પ્રશ્નોના જવાબ આપવાના બાકી છે. જો તમે પ્રશ્નોના જવાબ આપવા ઈચ્છતા હોય તો <b><u> ટેસ્ટ ચાલુ રાખો </u></b> અથવા <b><u>ટેસ્ટ પૂર્ણ કરો.</u></b><br><audio controls id="myAudio' + count + '"><source src="' + baselinkforfiles + 'audio/1.mp3"></audio></div>').dialog({
                    modal: true,
                    width: 500,
                    buttons: [
                        {
                            text: 'ટેસ્ટ પૂર્ણ કરો',
                            open: function () {
                                $(this).addClass('finish')
                            },
                            click: function () {
                                $(this).dialog("close"); //closing on Ok click
                                document.getElementById("myAudio" + count).src = "";
                                $scope.gamefinish();
                            }
                        },
                        {
                            text: "ટેસ્ટ ચાલુ રાખો",
                            open: function () {
                                $(this).addClass('continue');
                            },
                            click: function () {
                                $(this).dialog("close"); //closing on Ok click
                                document.getElementById("myAudio" + count).src = "";
                                $scope.gameContinue();
                            }
                        }
                    ],
                    dialogClass: "dialog-close-sign",
                    closeOnEscape: false,
                    open: function (event, ui) {
                        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                        $(".skipquescount").html($scope.countSkipQuestion);
                    }
                });
            }
        }

        //this function work start the first time exam
        $scope.loadfirstimequestion = function () {
            if ($scope.questioncount < $scope.slquizQuestionPaper.totalquestion && $scope.slquizQuestionPaper.totalquestion > 5) {
                if ($scope.questioncount == 0) {
                    $scope.skipbtndisable = true;

                    $scope.loadTypeOfQuestion("loadQuestion", "0", "wakefullnesstest", $scope.tempquestionpaper.mcq.section_1[Number($scope.tempquestioncount)].code, String($scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].question_number), $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].questionText, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option1_text, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option2_text, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option3_text, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option4_text);
                    $scope.tempquestioncount++;
                } else if ($scope.questioncount < 5) {
                    $scope.skipbtndisable = true;

                    var temp = metaserviceServices.returnSubject();
                    $scope.slquizopt = {};

                    $scope.quesion_Number = mcqshuffledquestionnumber[mcqquestioncount];

                    $scope.loadTypeOfQuestion("loadQuestion", "0", "wakefullnesstest", $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].code, String($scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].question_number), $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].questionText, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option1_text, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option2_text, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option3_text, $scope.tempquestionpaper.mcq.section_1[$scope.tempquestioncount].option4_text);
                    $scope.tempquestioncount++;
                } else if ($scope.questioncount >= 5) {
                    $scope.skipbtndisable = false;

                    if (mcqquestioncount < $scope.mcqquestion.length) {
                        if (mcqquestioncount == 0) {

                            var temp = metaserviceServices.returnSubject();
                            $scope.slquizopt = {};

                            $scope.quesion_Number = mcqshuffledquestionnumber[mcqquestioncount];

                            $scope.loadTypeOfQuestion("loadQuestion", String($scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].standard_id), temp[$scope.slquizQuestionPaper.subject_id].eng, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].code, String($scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].question_number), $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].questionText, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option1_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option2_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option3_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option4_text);
                            mcqquestioncount++;
                        } else {
                            var info = JSON.stringify({
                                "user_id": userid,
                                "questionpaper_id": $scope.slquizQuestionPaper.quizid,
                                "questionbank_id": $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount - 1]].questionbank_id,
                                "answer": $scope.slquizopt
                            });
                            var jsonobject = JSON.parse(info);

                            if (($scope.slquizopt.length > 0 || jsonobject.answer.length == undefined) && skipcheck == true) {
                                var temp = metaserviceServices.returnSubject();
                                $scope.slquizopt = {};

                                $scope.quesion_Number = mcqshuffledquestionnumber[mcqquestioncount];

                                $scope.loadTypeOfQuestion("loadQuestion", String($scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].standard_id), temp[$scope.slquizQuestionPaper.subject_id].eng, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].code, String($scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].question_number), $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].questionText, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option1_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option2_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option3_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option4_text);
                                mcqquestioncount++;
                                skipcheck = false;
                            } else {
                                var urlpath1 = slquizfactory.submitSlquizAnswers();
                                $.ajax({
                                    type: "POST",
                                    url: urlpath1,
                                    data: info,
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    crossDomain: true,
                                    success: function (response) {
                                        var temp = metaserviceServices.returnSubject();
                                        $scope.slquizopt = {};

                                        $scope.quesion_Number = mcqshuffledquestionnumber[mcqquestioncount];

                                        $scope.loadTypeOfQuestion("loadQuestion", String($scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].standard_id), temp[$scope.slquizQuestionPaper.subject_id].eng, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].code, String($scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].question_number), $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].questionText, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option1_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option2_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option3_text, $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount]].option4_text);
                                        mcqquestioncount++;
                                    }
                                });
                            }
                        }
                    }
                }
            } else {
                $("#slquiznextbutton, #skipbutton").attr("disabled", "disabled");
                if ($scope.slquizopt.length == 1) {
                    var info = JSON.stringify({
                        "user_id": userid,
                        "questionpaper_id": $scope.slquizQuestionPaper.quizid,
                        "questionbank_id": $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount - 1]].questionbank_id,
                        "answer": $scope.slquizopt
                    });

                    var urlpath1 = slquizfactory.submitSlquizAnswers();
                    $.ajax({
                        type: "POST",
                        url: urlpath1,
                        data: info,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success: function (response) {
                            console.log("Without Skip Last Answer Submited");
                            $scope.withoutSkipLastAnsSubmit();
                        }
                    });
                } else {
                    $scope.withoutSkipLastAnsSubmit();
                }
            }
        }

        $scope.withoutSkipLastAnsSubmit = function () {
            if (skipqusArr.length == 0) {
                $scope.gamefinish();
            } else if (skipqusArr.length > 0 || tempskipquesArr.length > 0) {
                $('<div title="સૂચના:" id="quescon">તમારે  <span class="skipquescount"></span> પ્રશ્નોના જવાબ આપવાના બાકી છે. જો તમે પ્રશ્નોના જવાબ આપવા ઈચ્છતા હોય તો <b><u> ટેસ્ટ ચાલુ રાખો </u></b> અથવા <b><u>ટેસ્ટ પૂર્ણ કરો.</u></b> <br><audio controls  id="myAudio"><source src="' + baselinkforfiles + 'audio/1.mp3"></audio></div>').dialog({
                    modal: true,
                    width: 500,
                    buttons: [
                        {
                            text: 'ટેસ્ટ પૂર્ણ કરો',
                            open: function () {
                                $(this).addClass('finish')
                            },
                            click: function () {
                                $(this).dialog("close"); //closing on Ok click
                                document.getElementById("myAudio").src = "";
                                $scope.gamefinish();
                            }
                        },
                        {
                            text: "ટેસ્ટ ચાલુ રાખો",
                            open: function () {
                                $(this).addClass('continue');
                            },
                            click: function () {
                                $(this).dialog("close"); //closing on Ok click
                                document.getElementById("myAudio").src = "";
                                $scope.gameContinue();
                            }
                        }
                    ],
                    dialogClass: "dialog-close-sign",
                    closeOnEscape: false,
                    open: function (event, ui) {
                        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                        $(".skipquescount").html($scope.countSkipQuestion);
                    }
                });
            }
        }

        $scope.loadTypeOfQuestion = function (loadid, questionstandard, subjectengname, questiontype, questionid, question, option1, option2, option3, option4) {
            $scope.questioncount++;
            $scope.thisCanBeusedInsideNgBindHtml = "";
            $scope.question = "";

            if ($scope.slquizQuestionPaper.standard == '3' || $scope.slquizQuestionPaper.standard == '4') {
                $scope.showaudiotag = true;
                $scope.questionaudiotext = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/q.mp3";
            } else {
                $scope.showaudiotag = false;
            }

            if ($scope.slquizQuestionPaper.subject_id != "6") {
                $scope.question = "[" + $scope.questioncount + "] " + question;
            } else {
                // if($scope.slquizQuestionPaper.standard == 8){
                // question = question.replace("(","<br> (");
                // var splt = $sce.trustAsHtml(question).split("(");
                // $scope.thisCanBeusedInsideNgBindHtml = "["+$scope.questioncount+ "] "+ splt[0];
                // }else{
                // question = question.replace("(","<br> (");
                // $scope.thisCanBeusedInsideNgBindHtml = "["+$scope.questioncount+ "] "+ $sce.trustAsHtml(question);
                // }
                question = question.replace("(", "<br> (").replace(")", ") <br> ");
                $scope.thisCanBeusedInsideNgBindHtml = "[" + $scope.questioncount + "] " + $sce.trustAsHtml(question);
            }

            //this below code work assign seconds in one single quesion(if question time finish after show next and skip button)
            clearInterval(ansTimer);
            if (gamecontinue == true) {
                timeleft = 0;
            } else {
                $scope.slquizanstime = JSON.parse(sessionStorage.getItem("uiTextConfig")).slquianstime;
                timeleft = $scope.slquizanstime;
                ansTimer = setInterval(function () {
                    timeleft--;
                    $("#countdowntimer").html(timeleft);
                    // document.getElementById("countdowntimer").textContent = timeleft;
                    if (timeleft <= 0) {
                        $("#skipbutton").show();
                        clearInterval(ansTimer);
                        $scope.showorhideAnsBtn(timeleft);
                    }
                }, 1000);
            }


            switch (questiontype) {
                case "TT4T":
                    $("#" + loadid).html('<tt4t-block></tt4t-block>');

                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $scope.option3 = option3;
                    $scope.option4 = option4;

                    $compile("#" + loadid)($scope);
                    break;

                case "TT2T":
                    $("#" + loadid).html('<tt2t-block></tt2t-block>');

                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $compile("#" + loadid)($scope);
                    break;

                case "TI4T":
                    $("#" + loadid).html('<ti4t-block></ti4t-block>');

                    $scope.questionimage = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/q.png";
                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $scope.option3 = option3;
                    $scope.option4 = option4;
                    $compile("#" + loadid)($scope);
                    break;

                case "TA4T":
                    $("#" + loadid).html('<ta4t-block></ta4t-block>');

                    $scope.questionaudio = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/a.mp3";
                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $scope.option3 = option3;
                    $scope.option4 = option4;
                    $compile("#" + loadid)($scope);
                    break;

                case "TV4T":
                    $("#" + loadid).html('<tv4t-block></tv4t-block>');

                    $scope.questionvideo = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/v.mp4";
                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $scope.option3 = option3;
                    $scope.option4 = option4;
                    $compile("#" + loadid)($scope);
                    break;

                case "TI2T":
                    $("#" + loadid).html('<ti2t-block></ti2t-block>');

                    $scope.questionimage = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/q.png";
                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $compile("#" + loadid)($scope);
                    break;

                case "TA2T":
                    $("#" + loadid).html('<ta2t-block></ta2t-block>');

                    $scope.questionaudio = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/a.mp3";
                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $compile("#" + loadid)($scope);
                    break;

                case "TV2T":
                    $("#" + loadid).html('<tv2t-block></tv2t-block>');

                    $scope.questionvideo = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/v.mp4"
                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $compile("#" + loadid)($scope);
                    break;

                case "TT4I":
                    $("#" + loadid).html('<tt4i-block></tt4i-block>');

                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $scope.option3image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o3.png";
                    $scope.option4image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o4.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "TT2I":
                    $("#" + loadid).html('<tt2i-block></tt2i-block>');

                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "TI4I":
                    $("#" + loadid).html('<ti4i-block></ti4i-block>');

                    $scope.questionimage = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/q.png"
                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $scope.option3image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o3.png";
                    $scope.option4image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o4.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "TI2I":
                    $("#" + loadid).html('<ti2i-block></ti2i-block>');

                    $scope.questionimage = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/q.png"
                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "TA4I":
                    $("#" + loadid).html('<ta4i-block></ta4i-block>');

                    $scope.questionaudio = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/a.mp3";
                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $scope.option3image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o3.png";
                    $scope.option4image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o4.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "TV4I":
                    $("#" + loadid).html('<tv4i-block></tv4i-block>');

                    $scope.questionvideo = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/v.mp4";
                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $scope.option3image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o3.png";
                    $scope.option4image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o4.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "TA2I":
                    $("#" + loadid).html('<ta2i-block></ta2i-block>');

                    $scope.questionaudio = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/a.mp3";
                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "TV2I":
                    $("#" + loadid).html('<tv2i-block></tv2i-block>');

                    $scope.questionvideo = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/v.mp4";
                    $scope.questionimage = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/v.mp4";
                    $scope.option1image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o1.png";
                    $scope.option2image = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/o2.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "STT":
                    $("#" + loadid).html('<stt-block></stt-block>');
                    $compile("#" + loadid)($scope);
                    break;

                case "STI":
                    $("#" + loadid).html('<sti-block></sti-block>');

                    $scope.questionimage = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/q.png";
                    $compile("#" + loadid)($scope);
                    break;

                case "STV":
                    $("#" + loadid).html('<stv-block></stv-block>');

                    $scope.questionvideo = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/v.mp4";
                    $compile("#" + loadid)($scope);
                    break;

                case "STA":
                    $("#" + loadid).html('<sta-block></sta-block>');

                    $scope.questionaudio = $scope.hosturl + questionstandard + "/" + subjectengname + "/" + questionid + "/a.mp3";
                    $compile("#" + loadid)($scope);
                    break;

                case "TTA4T":
                    $("#" + loadid).html('<tta4t-block></tta4t-block>');

                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $scope.option3 = option3;
                    $scope.option4 = option4;
                    $compile("#" + loadid)($scope);
                    break;

                case "TTA2T":
                    $("#" + loadid).html('<tta2t-block></tta2t-block>');

                    $scope.option1 = option1;
                    $scope.option2 = option2;
                    $compile("#" + loadid)($scope);
                    break;
            }
            $scope.showHideTimerBtnAfterSkipQues();
        }

        /*this below code is not used in this session
        $scope.examComplete = function() {
            if($scope.slquizQuestionPaper.totalquestion > 5) {
                var info = JSON.stringify({
                    "user_id" : userid,
                    "questionpaper_id" : $scope.slquizQuestionPaper.quizid,
                    "questionbank_id" : $scope.mcqquestion[mcqshuffledquestionnumber[mcqquestioncount - 1]].questionbank_id,
                    "answer" : $scope.slquizopt
                });

                var urlpath1 = slquizfactory.submitSlquizAnswers();
                $.ajax({
                    type: "POST",
                    url:urlpath1,
                    data:info,
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    crossDomain: true,
                    success:function(response){
                        console.log(response.data);
                        mcqquestioncount++;

                        var temp = slquizfactory.returnSlquizId();
                        var statusdata = JSON.stringify({
                            "questionpaper_id":temp,
                            "division_id":user.student_detail.division_id,
                            "state":"FINISH",
                            "user_id":userid,
                            "user_name":user.user_detail.user_tag,
                            "roll_number":user.student_detail.roll_number
                        });

                        var urlpath2 = examMusterServices.updateExamineeStatus();
                        $.ajax({
                            type: "POST",
                            url:urlpath2,
                            data:statusdata,
                            headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                            },
                            crossDomain: true,
                            success:function(response1){
                                console.log("Examinee status updated to complete")
                                localStorage.removeItem("slquizminutes"+userid+$scope.slquizQuestionPaper.quizid);
                                $("#loadQuestion").html('<quizover-block></quizover-block>');
                                $compile("#loadQuestion")($scope);
                            }
                        });
                    }
                });
            }else {
                var temp = slquizfactory.returnSlquizId();
                var statusdata = JSON.stringify({
                    "questionpaper_id":temp,
                    "division_id":user.student_detail.division_id,
                    "state":"FINISH",
                    "user_id":userid,
                    "user_name":user.user_detail.user_tag,
                    "roll_number":user.student_detail.roll_number
                });

                var urlpath2 = examMusterServices.updateExamineeStatus();
                $.ajax({
                    type: "POST",
                    url:urlpath2,
                    data:statusdata,
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    crossDomain: true,
                    success:function(response1){
                        console.log("Examinee status updated to complete")
                        localStorage.removeItem("slquizminutes"+userid+$scope.slquizQuestionPaper.quizid);
                        $("#loadQuestion").html('<quizover-block></quizover-block>');
                        $compile("#loadQuestion")($scope);
                    }
                });
            }
        }

        $scope.quizOver = function() {
            console.log("Quiz is over");
            localStorage.removeItem("slquizminutes"+userid+$scope.slquizQuestionPaper.quizid);
            $("#loadQuestion").html('<quizover-block></quizover-block>');
            $compile("#loadQuestion")($scope);
        }

        $scope.startTimer = function (duration, display) {
            var timer = duration, minutes, seconds;
                settingtimer = setInterval(function () {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                var difference = (minutes * 60)+seconds;
                localStorage.setItem("slquizminutes"+userid+$scope.slquizQuestionPaper.quizid,difference);
                display.text(minutes + ":" + seconds);

                if (--timer < 0) {
                    clearInterval(settingtimer);
                    localStorage.removeItem("slquizminutes"+userid+$scope.slquizQuestionPaper.quizid,difference);
                    $scope.quizOver();
                }
            }, 1000);
        }
        */
    })
    .directive('startquizModal', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/take_exam/startquizmodal.html'
        };
    })
    .directive('quizoverBlock', function () {
        return {
            restrict: 'E',
            template: '<center><p style="color:white;font-size:20px;"> sLQuiz સમાપ્ત થઈ ગઈ છે.</p> <button id="quizoverbutton" type="button" class="btn btn-info" ng-click="goBackToTakeSlQuiz()"> પાછા જાઓ </button></center>'
        };
    })
    .directive('ta2tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TA2T.html'
        };
    })
    .directive('ta4iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TA4I.html'
        };
    })
    .directive('ta2iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TA2I.html'
        };
    })
    .directive('ta4tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TA4T.html'
        };
    })
    .directive('ti2tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TI2T.html'
        };
    })
    .directive('ti4iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TI4I.html'
        };
    })
    .directive('ti2iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TI2I.html'
        };
    })
    .directive('ti4tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TI4T.html'
        };
    })
    .directive('tt2tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TT2T.html'
        };
    })
    .directive('tt4iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TT4I.html'
        };
    })
    .directive('tt2iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TT2I.html'
        };
    })
    .directive('tt4tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TT4T.html'
        };
    })
    .directive('tv2tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TV2T.html'
        };
    })
    .directive('tv4iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TV4I.html'
        };
    })
    .directive('tv2iBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TV2I.html'
        };
    })
    .directive('tv4tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TV4T.html'
        };
    })
    .directive('sttBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/STT.html'
        };
    })
    .directive('stiBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/STI.html'
        };
    })
    .directive('stvBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/STV.html'
        };
    })
    .directive('staBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/STA.html'
        };
    })
    .directive('tta2tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TTA2T.html'
        };
    })
    .directive('tta4tBlock', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/questiontype/TTA4T.html'
        };
    });
