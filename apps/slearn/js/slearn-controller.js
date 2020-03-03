angular.module('sledstudio')
    .controller('SlearnController', function (errorFactory, basicFactory, subjectLoggingFactory, ajaxCallsFactory, $scope) {
        $scope.slearnsubjectname = sessionStorage.getItem("slearnsubjectname");
        $scope.showListeningcorner = false;
        //console.log($scope.slearnsubjectname);

        if (sessionStorage.getItem("slearnsubject") == 6) {
            $scope.labelforenglish = true;
            $scope.showListeningcorner = true;
        }

        this.basicImagePathConfig = function () {
            $scope.pointsallocatedpath = baselinkforfiles + "apps/slearn/images/tressure.gif"
            $scope.ropeimagepath = baselinkforfiles + "apps/slearn/images/rope.png";
            $scope.baseImagePath = baselinkforfiles;
            $scope.floor1points = baselinkforfiles + "apps/slearn/images/1.png"
            $scope.floor2points = baselinkforfiles + "apps/slearn/images/2.png"
            $scope.floor3points = baselinkforfiles + "apps/slearn/images/3.png"
            $scope.floor4points = baselinkforfiles + "apps/slearn/images/4.png"
            $scope.floor5points = baselinkforfiles + "apps/slearn/images/5.png"
            $scope.floor6points = baselinkforfiles + "apps/slearn/images/6.png"
            $scope.floor7points = baselinkforfiles + "apps/slearn/images/7.png"
            $scope.floor8points = baselinkforfiles + "apps/slearn/images/8.png"
        }

        this.decideWhatFloorsToDisplay = function () {
            $scope.floorsToDisplay = [];
            var slearn_config = JSON.parse(sessionStorage.getItem("slearn_config"));
            var subject_usage_limitation = slearn_config.subject_usage_limitation;
            var student_standard = String(JSON.parse(localStorage.getItem('loginresponse')).student_detail.standard_id);
            var subjectid = sessionStorage.getItem("slearnsubject");
            var minFloor = Number(subject_usage_limitation[subjectid][student_standard].floor_min);
            var maxFloor = Number(subject_usage_limitation[subjectid][student_standard].floor_max);
            for (var i = minFloor; i <= maxFloor; i++) {
                $scope.floorsToDisplay.push(i);
            }

            var currentFloorLink = slearn_backend_api + "getstudents/currentconceptoom/subject/" + subjectid;
            ajaxCallsFactory.getCall(currentFloorLink)
                .then(function (response1) {
                    $scope.currentFloor = Number(response1.data.data.floor_id);
                    sessionStorage.setItem("currentfloor", response1.data.data.floor_id);
                    sessionStorage.setItem("current_conceptroom", response1.data.data.conceptroom_id);
                    sessionStorage.setItem("current_order_conceptoom", response1.data.data.ordr_of_conceptroom);

                    $scope.floorpercentage = response1.data.data.floor_completion_percentage;

                    $scope.howManyPoints($scope.currentFloor, $scope.floorpercentage)

                    if ($scope.floorpercentage == undefined) {
                        $scope.floorpercentage1 = 0;
                    } else if ($scope.floorpercentage == 0) {
                        $scope.floorpercentage1 = 0;
                    } else {
                        $scope.floorpercentage1 = $scope.floorpercentage.toFixed(2);
                    }

                    if (sessionStorage.getItem("slearn_start_time") == null) {
                        subjectLoggingFactory.subjectService();
                    } else {
                        console.log("Subject usage promise already active");
                    }
                }, function (error) {
                    console.log("વર્તમાન ફ્લોર ડેટા મેળવી શકતા નથી.");
                    //errorFactory.errorWindowCloseModal("વર્તમાન ફ્લોર ડેટા મેળવી શકતા નથી.");
                });
        }

        $scope.howManyPoints = function (currentFloor, currentPercentageCompleted) {
            switch (String(currentFloor)) {
                case "1":
                    $scope.floor1count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    $scope.floor2count = "0";
                    $scope.floor3count = "0";
                    $scope.floor4count = "0";
                    $scope.floor5count = "0";
                    $scope.floor6count = "0";
                    $scope.floor7count = "0";
                    $scope.floor8count = "0";
                    break;
                case "2":
                    $scope.floor1count = "1,00,000";
                    $scope.floor2count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    $scope.floor3count = "0";
                    $scope.floor4count = "0";
                    $scope.floor5count = "0";
                    $scope.floor6count = "0";
                    $scope.floor7count = "0";
                    $scope.floor8count = "0";
                    break;
                case "3":
                    $scope.floor1count = "1,00,000";
                    $scope.floor2count = "1,00,000";
                    $scope.floor3count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    $scope.floor4count = "0";
                    $scope.floor5count = "0";
                    $scope.floor6count = "0";
                    $scope.floor7count = "0";
                    $scope.floor8count = "0";
                    break;
                case "4":
                    $scope.floor1count = "1,00,000";
                    $scope.floor2count = "1,00,000";
                    $scope.floor3count = "1,00,000";
                    $scope.floor4count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    $scope.floor5count = "0";
                    $scope.floor6count = "0";
                    $scope.floor7count = "0";
                    $scope.floor8count = "0";
                    break;
                case "5":
                    $scope.floor1count = "1,00,000";
                    $scope.floor2count = "1,00,000";
                    $scope.floor3count = "1,00,000";
                    $scope.floor4count = "1,00,000";
                    $scope.floor5count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    $scope.floor6count = "0";
                    $scope.floor7count = "0";
                    $scope.floor8count = "0";
                    break;
                case "6":
                    $scope.floor1count = "1,00,000";
                    $scope.floor2count = "1,00,000";
                    $scope.floor3count = "1,00,000";
                    $scope.floor4count = "1,00,000";
                    $scope.floor5count = "1,00,000";
                    $scope.floor6count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    $scope.floor7count = "0";
                    $scope.floor8count = "0";
                    break;
                case "7":
                    $scope.floor1count = "1,00,000";
                    $scope.floor2count = "1,00,000";
                    $scope.floor3count = "1,00,000";
                    $scope.floor4count = "1,00,000";
                    $scope.floor5count = "1,00,000";
                    $scope.floor6count = "1,00,000";
                    $scope.floor7count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    $scope.floor8count = "0";
                    break;
                case "8":
                    $scope.floor1count = "1,00,000";
                    $scope.floor2count = "1,00,000";
                    $scope.floor3count = "1,00,000";
                    $scope.floor4count = "1,00,000";
                    $scope.floor5count = "1,00,000";
                    $scope.floor6count = "1,00,000";
                    $scope.floor7count = "1,00,000";
                    $scope.floor8count = String(Math.round((Number(currentPercentageCompleted / 100)) * 100000));
                    break;
            }
        }

        $scope.loadConceptRoomsForFloor = function (floornumber) {
            //this if check user click on locked floor
            if (floornumber > $scope.currentFloor) {
                errorFactory.errorModal("તમારી પાસે આ ફ્લોરની ઍક્સેસ નથી. પ્રવેશ મેળવવા માટે પાછલા ફ્લોરને પૂર્ણ કરો.");
            } else {
                sessionStorage.setItem("selectedfloor", floornumber);
                window.location.href = "#/conceptroom";
            }
        }

        $scope.goBacksLearnSubject = function () {
            window.location.href = "#/slearn_subject";
        }

        this.init = function () {
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
                sessionStorage.setItem("menuid", 1);
                $('body').removeClass('conceptroombackground');
                $('body').addClass('slearnbackground');
                /*$('body').removeClass('conceptroombackground');
                $('body').removeClass('slearn_subject_bg_color');*/
                sessionStorage.setItem("inside_subject", "Yes");
                this.basicImagePathConfig();
                this.decideWhatFloorsToDisplay();
                $scope.subjectnametodisplayornot = true;
            }
        }
        this.init();

        $scope.listeningCorner = function () {
            window.location.href = '#/listeningcorner';
        }
    });
