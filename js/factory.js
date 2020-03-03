angular.module('sledstudio')
    .factory('subjectLoggingFactory', ['$interval', 'ajaxCallsFactory', 'errorFactory', function ($interval, ajaxCallsFactory, errorFactory) {
        var dataFactory = {};

        dataFactory.subjectService = function () {
            var subjectinterval = Number(sessionStorage.getItem("subject_recording_time")) * 1000;
            var getCurrentTime = backend_api_base + "slcore/util/timestamp";
            ajaxCallsFactory.getCall(getCurrentTime)
                .then(function (response) {
                    sessionStorage.setItem("slearn_start_time", response.data.data.timestamp);
                    console.log("slearn start time --" + response.data.data.timestamp);
                    promiseOfSubjectChecking = $interval(function () {
                        var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                        ajaxCallsFactory.getCall(getCurrentTime)
                            .then(function (response1) {
                                var slearn_stop_time = Number(response1.data.data.timestamp);
                                var slearn_start_time = Number(sessionStorage.getItem("slearn_start_time"));
                                var subject_id = sessionStorage.getItem("slearnsubject");
                                var durtation = slearn_stop_time - slearn_start_time;
                                var data = {"subject_id": subject_id, "duration": durtation};
                                var subject_data_usage_send = slearn_backend_api + "submit/student/subjectusage";

                                ajaxCallsFactory.postCall(subject_data_usage_send, data)
                                    .then(function (response2) {
                                        var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                                        ajaxCallsFactory.getCall(getCurrentTime)
                                            .then(function (response3) {
                                                sessionStorage.setItem("slearn_start_time", response3.data.data.timestamp);
                                            }, function (error) {
                                                errorFactory.errorWindowCloseModal("સર્વર સમય મળતો નથી");
                                            });
                                    }, function (error) {
                                        console.log("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી")
                                        //errorFactory.errorWindowCloseModal("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી");
                                    });
                            }, function (error) {
                                errorFactory.errorWindowCloseModal("સર્વર સમય મળતો નથી");
                            });
                    }, subjectinterval); // x Minutes
                }, function (error) {
                    errorFactory.errorWindowCloseModal("સર્વર સમય મળતો નથી");
                });
        }

        dataFactory.closeSubjectService = function () {
            $interval.cancel(promiseOfSubjectChecking);
            if (sessionStorage.getItem("slearn_start_time") != null) {
                var slearn_start_time = Number(sessionStorage.getItem("slearn_start_time"));
                var subject_id = sessionStorage.getItem("slearnsubject");

                var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                ajaxCallsFactory.getCall(getCurrentTime)
                    .then(function (response) {
                        var slearn_stop_time = Number(response.data.data.timestamp);
                        console.log("slearn stop time --" + slearn_stop_time);

                        var duration = slearn_stop_time - slearn_start_time;
                        var data = {"subject_id": subject_id, "duration": duration};
                        var subject_data_usage_send = slearn_backend_api + "submit/student/subjectusage";

                        ajaxCallsFactory.postCall(subject_data_usage_send, data)
                            .then(function (response1) {
                                console.log("Out of subject usage data sending loop");
                                sessionStorage.removeItem("slearn_start_time");
                                return true;
                            }, function (error) {
                                console.log("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી")
                                //errorFactory.errorWindowCloseModal("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી");
                            });
                    }, function (error) {
                        errorFactory.errorWindowCloseModal("સર્વર સમય મળતો નથી");
                    });
            } else {
                console.log("Slearn Subject Not Running !!");
                return true;
            }
        }
        return dataFactory;
    }])
    .factory('errorFactory', ['$uibModal', function ($uibModal, $scope, $window) {
        var dataFactory = {};

        dataFactory.errorModal = function (errorstatement) {
            $uibModal.open({
                templateUrl: baselinkforfiles + 'html/error/error.html',
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                controller: function ($uibModalInstance, $scope, $window) {
                    $scope.errstatement = errorstatement;
                    $scope.closeCustomModal = function () {
                        $uibModalInstance.close();
                    };
                }
            });
        }

        dataFactory.errorWindowCloseModal = function (errorstatement) {
            $uibModal.open({
                templateUrl: baselinkforfiles + 'html/error/errorwithoutbutton.html',
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                controller: function ($uibModalInstance, $scope) {
                    $scope.errstatement = errorstatement;

                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    }
                }
            });
        }

        dataFactory.errorUnAuthorizedUser = function (errorstatement) {
            $uibModal.open({
                templateUrl: baselinkforfiles + 'html/error/notauthorized.html',
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                controller: function ($uibModalInstance, $scope) {
                    $scope.errorstatement1 = errorstatement
                    $scope.logOutUnauthorizedUser = function () {
                        $uibModalInstance.close();
                        window.location.href = "#/";
                        window.location.reload();
                    }
                }
            });
        }
        return dataFactory;
    }])
    .service("dataModalServices", ['$uibModal', function ($uibModal, $scope, $window) {
        var modalInstance;

        this.openMoldal = function () {
            modalInstance = $uibModal.open({
                templateUrl: baselinkforfiles + 'html/error/dataloading.html',
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                controller: function ($scope) {
                    $scope.datamodelimagepath = baselinkforfiles + "images/dataloading.gif";
                }
            });
        }

        this.closeModal = function () {
            modalInstance.close();
        }
    }])
    .factory('logOutFactory', ['$interval', '$timeout', 'subjectLoggingFactory', 'errorFactory', 'ajaxCallsFactory', 'dataModalServices', function ($interval, $timeout, subjectLoggingFactory, errorFactory, ajaxCallsFactory, dataModalServices) {
        var dataFactory = {};
        dataFactory.logOut = function () {
            $interval.cancel(promiseOfSubjectChecking);
            $interval.cancel(showWarningMsgPopupRelogin);
            if (sessionStorage.getItem("slearn_start_time") != null) {
                var slearn_start_time = Number(sessionStorage.getItem("slearn_start_time"));
                var subject_id = sessionStorage.getItem("slearnsubject");

                var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                ajaxCallsFactory.getCall(getCurrentTime)
                    .then(function (response) {
                        var slearn_stop_time = Number(response.data.data.timestamp);
                        console.log("slearn stop time --" + slearn_stop_time);

                        var duration = slearn_stop_time - slearn_start_time;
                        var data = {"subject_id": subject_id, "duration": duration};
                        var subject_data_usage_send = slearn_backend_api + "submit/student/subjectusage";

                        ajaxCallsFactory.postCall(subject_data_usage_send, data)
                            .then(function (response1) {
                                console.log("Out of subject usage data sending loop");
                                sessionStorage.removeItem("slearn_start_time");
                                $interval.cancel(promiseOfSessionChecking);
                                $timeout.cancel(promiseSessionExpiryDialog);
                                sessionStorage.clear();
                                window.location.href = "#/";
                            }, function (error) {
                                console.log("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી")
                                //errorFactory.errorWindowCloseModal("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી");
                            });
                    }, function (error) {
                        errorFactory.errorWindowCloseModal("સર્વર સમય મળતો નથી");
                    });
            } else {
                console.log("Slearn Subject Not Running !!");
                $interval.cancel(promiseOfSessionChecking);
                $interval.cancel(promiseOfSessionChecking);
                $timeout.cancel(promiseSessionExpiryDialog);
                sessionStorage.clear();
                window.location.href = "#/";
            }
            clearInterval(x);
        }

        dataFactory.logUserOut = function () {
            $interval.cancel(promiseOfSubjectChecking);
            if (sessionStorage.getItem("slearn_start_time") != null) {
                var slearn_start_time = Number(sessionStorage.getItem("slearn_start_time"));
                var subject_id = sessionStorage.getItem("slearnsubject");

                var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                ajaxCallsFactory.getCall(getCurrentTime)
                    .then(function (response) {
                        var slearn_stop_time = Number(response.data.data.timestamp);
                        console.log("slearn stop time --" + slearn_stop_time);

                        var duration = slearn_stop_time - slearn_start_time;
                        var data = {"subject_id": subject_id, "duration": duration};
                        var subject_data_usage_send = slearn_backend_api + "submit/student/subjectusage";

                        ajaxCallsFactory.postCall(subject_data_usage_send, data)
                            .then(function (response1) {
                                console.log("Out of subject usage data sending loop");
                                sessionStorage.removeItem("slearn_start_time");

                                var logout_api = backend_api_base + "um/auth/logout";
                                ajaxCallsFactory.getCall(logout_api)
                                    .then(function (response2) {
                                        $interval.cancel(promiseOfSessionChecking);
                                        $interval.cancel(promiseOfOnlyOneTab);
                                        $timeout.cancel(promiseSessionExpiryDialog);
                                        sessionStorage.clear();
                                        localStorage.clear();
                                        window.location.href = "#/";
                                        dataModalServices.closeModal();
                                    }, function (error) {
                                        $interval.cancel(promiseOfSessionChecking);
                                        $interval.cancel(promiseOfOnlyOneTab);
                                        $timeout.cancel(promiseSessionExpiryDialog);
                                        sessionStorage.clear();
                                        localStorage.clear();
                                        dataModalServices.closeModal();
                                        errorFactory.errorWindowCloseModal(" લૉગઆઉટ  સમસ્યા ");
                                    });

                            }, function (error) {
                                dataModalServices.closeModal();
                                console.log("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી")
                                //errorFactory.errorWindowCloseModal("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી");
                            });
                    }, function (error) {
                        dataModalServices.closeModal();
                        errorFactory.errorWindowCloseModal("સર્વર સમય મળતો નથી");
                    });
            } else {
                console.log("Slearn Subject Not Running !!");
                var logout_api = backend_api_base + "um/auth/logout";
                ajaxCallsFactory.getCall(logout_api)
                    .then(function (response2) {
                        $interval.cancel(promiseOfSessionChecking);
                        $interval.cancel(promiseOfOnlyOneTab);
                        $timeout.cancel(promiseSessionExpiryDialog);
                        sessionStorage.clear();
                        localStorage.clear();
                        window.location.href = "#/";
                        dataModalServices.closeModal();
                    }, function (error) {
                        $interval.cancel(promiseOfSessionChecking);
                        $interval.cancel(promiseOfOnlyOneTab);
                        $timeout.cancel(promiseSessionExpiryDialog);
                        dataModalServices.closeModal();
                        if (sessionStorage.getItem('logoutModal') == 'hide') {
                            sessionStorage.removeItem('logoutModal');
                            localStorage.clear();
                            return;
                        }
                        sessionStorage.clear();
                        localStorage.clear();
                        errorFactory.errorWindowCloseModal(" લૉગઆઉટ  સમસ્યા  ");
                    });
            }
            clearInterval(x);
        }

        dataFactory.logUnauthorizedUserOut = function () {
            $interval.cancel(promiseOfSubjectChecking);
            if (sessionStorage.getItem("slearn_start_time") != null) {
                var slearn_start_time = Number(sessionStorage.getItem("slearn_start_time"));
                var subject_id = sessionStorage.getItem("slearnsubject");

                var getCurrentTime = backend_api_base + "slcore/util/timestamp";
                ajaxCallsFactory.getCall(getCurrentTime)
                    .then(function (response) {
                        var slearn_stop_time = Number(response.data.data.timestamp);
                        console.log("slearn stop time --" + slearn_stop_time);

                        var duration = slearn_stop_time - slearn_start_time;
                        var data = {"subject_id": subject_id, "duration": duration};
                        var subject_data_usage_send = slearn_backend_api + "submit/student/subjectusage";

                        ajaxCallsFactory.postCall(subject_data_usage_send, data)
                            .then(function (response1) {
                                console.log("Out of subject usage data sending loop");
                                sessionStorage.removeItem("slearn_start_time");

                                var logout_api = backend_api_base + "um/auth/logout";
                                ajaxCallsFactory.getCall(logout_api)
                                    .then(function (response2) {
                                        $interval.cancel(promiseOfSessionChecking);
                                        $interval.cancel(promiseOfOnlyOneTab);
                                        $timeout.cancel(promiseSessionExpiryDialog);
                                        sessionStorage.clear();
                                        localStorage.clear();
                                        errorFactory.errorUnAuthorizedUser("તમારી પાસે આ એપ્લિકેશન રમવાની પરવાનગી નથી અથવા તમારો સેશન ચાલુ છે,  લોગઆઉટ કરો.");
                                    }, function (error) {
                                        errorFactory.errorWindowCloseModal("લૉગઆઉટ  સમસ્યા ");
                                    });

                            }, function (error) {
                                console.log("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી")
                                //errorFactory.errorWindowCloseModal("બેકએન્ડ પર વિષય ઉપયોગ ડેટા મોકલ્યો નથી");
                            });

                    }, function (error) {
                        errorFactory.errorWindowCloseModal("સર્વર સમય મળતો નથી");
                    });
            } else {
                console.log("Slearn Subject Not Running !!");

                var logout_api = backend_api_base + "um/auth/logout";
                ajaxCallsFactory.getCall(logout_api)
                    .then(function (response2) {
                        $interval.cancel(promiseOfSessionChecking);
                        $interval.cancel(promiseOfOnlyOneTab);
                        $timeout.cancel(promiseSessionExpiryDialog);
                        sessionStorage.clear();
                        localStorage.clear();
                        errorFactory.errorUnAuthorizedUser("તમારી પાસે આ એપ્લિકેશન રમવાની પરવાનગી નથી અથવા તમારો સેશન ચાલુ છે,  લોગઆઉટ કરો.");
                    }, function (error) {
                        errorFactory.errorWindowCloseModal(" લૉગઆઉટ  સમસ્યા ");
                    });
            }
            clearInterval(x);
        }

        return dataFactory;
    }])
    .factory('basicFactory', ['logOutFactory', function (logOutFactory) {
        var dataFactory = {};
        dataFactory.checkIfLoggedInCorrectly = function () {
            if (sessionStorage.getItem("loggedInCorrectly") == "Yes") {
                return true;
            } else {
                logOutFactory.logOut();
            }
        }

        dataFactory.checkIfArrayHasValue = function (appnumber, totalArray) {
            for (var i = 0; i < totalArray.length; i++) {
                if (String(appnumber) == String(totalArray[i])) {
                    return "Yes";
                } else {
                    console.log("No Match found");
                }
            }
        }

        dataFactory.checkIfAppHasPermission = function (appnumber) {
            var product_config = Object.keys(JSON.parse(sessionStorage.getItem("product_config")));
            if (dataFactory.checkIfArrayHasValue(appnumber, product_config) == "Yes") {
                return true;
            } else {
                return false;
            }
        }

        dataFactory.getListOfKeys = function (jsonvalue) {
            return Object.keys(jsonvalue);
        }
        return dataFactory;
    }])
    .factory('slateFactory', ['basicFactory', 'errorFactory', function (basicFactory, errorFactory) {
        var dataFactory = {};

        dataFactory.launchSlate = function (slateid) {
            // if (basicFactory.checkIfAppHasPermission("2") == true){
            if (slateid == 2) {

                console.log("sLate is Allowed!!");
                window.open(slatebaseurl, 'slate', 'width=500,height=500');
            } else {
                window.location.href = "#/home";
                errorFactory.errorModal("તમારી પાસે આ એપ્લિકેશન રમવાની પરવાનગી નથી. Please contact Schoolslens");
            }
        }
        return dataFactory;
    }])
    .factory('sessionCheckingFactory', ['logOutFactory', 'errorFactory', 'ajaxCallsFactory', 'subjectLoggingFactory', '$uibModal', '$timeout', '$interval', function (logOutFactory, errorFactory, ajaxCallsFactory, subjectLoggingFactory, $uibModal, $timeout, $interval, $scope) {
        var dataFactory = {};

        dataFactory.loadSessionCheckingModal = function () {
            $uibModal.open({
                templateUrl: baselinkforfiles + 'html/error/sessionexpiry.html',
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                controller: function ($uibModalInstance, $timeout, $scope, $window) {
                    $scope.usersname = sessionStorage.getItem("first_name");
                    $scope.user_tag = sessionStorage.getItem("user_tag");

                    $scope.init = function () {
                        subjectLoggingFactory.closeSubjectService();
                        $scope.checked = 0;
                        /*$scope.usersname = sessionStorage.getItem("first_name");
                        $scope.user_tag = sessionStorage.getItem("user_tag");*/
                        promiseSessionExpiryDialog = $timeout(function () {
                            // clear session storage with user id, usertag, user password, user role, firstname,
                            // read new login and log out time and call runSessionKeyCheckService
                            $uibModalInstance.close();
                            localStorage.clear();
                            logOutFactory.logOut();
                            window.location.reload(); // to reload and display all products on auto log out.
                        }, Number(sessionStorage.getItem("session_expired_logout") * 1000)); //
                    }
                    // this.init()

                    $scope.showpopup = false;
                    let timerCount = Number(sessionStorage.getItem("showpopuptime"));
                    showWarningMsgPopupRelogin = $interval(function () {
                        document.getElementById('timerCountDown').innerHTML = timerCount;
                        if (timerCount === 0) {
                            document.getElementById("warning").pause();
                            $scope.showpopup = true;
                            $scope.checked = 1;
                            $interval.cancel(showWarningMsgPopupRelogin);
                            $scope.init();
                        } else {
                            document.getElementById("warning").play();
                            timerCount = timerCount - 1;
                        }
                    }, 1000);

                    $scope.logOutAndLoginWithNewUser = function () {
                        $uibModalInstance.close();
                        logOutFactory.logUserOut();
                    }

                    $scope.reloginAgain = function () {
                        $timeout.cancel(promiseSessionExpiryDialog);
                        $scope.checked = 1;
                        $timeout(function () {
                            $uibModalInstance.close();
                            // clear session storage with user id, usertag, user password, user role, firstname,
                            // read new login and log out time and call runSessionKeyCheckService
                            var login_api = backend_api_base + "um/auth/login";
                            var request = {
                                "user_tag": sessionStorage.getItem("user_tag"),
                                "password": sessionStorage.getItem("user_password"),
                                "product_id": Number(sessionStorage.getItem("selectedProduct"))
                            }
                            ajaxCallsFactory.postCall(login_api, request)
                                .then(function (response) {
                                    sessionStorage.setItem("selectedProduct", response.data.data.login_record.product_id);
                                    sessionStorage.setItem("user_id", response.data.data.login_record.user_id);
                                    sessionStorage.setItem("user_tag", response.data.data.user_detail.user_tag);
                                    sessionStorage.setItem("user_password", sessionStorage.getItem("user_password"));
                                    sessionStorage.setItem("user_role", response.data.data.user_detail.user_role);
                                    sessionStorage.setItem("first_name", response.data.data.user_detail.first_name);
                                    sessionStorage.setItem("loggedInCorrectly", "Yes");
                                    sessionStorage.setItem("user_session_key", response.data.data.login_record.session_key);
                                    localStorage.setItem("loginresponse", JSON.stringify(response.data.data));
                                    var responsedata = response.data.data;
                                    var numberofminutes = Number(responsedata.login_record.logout_timestamp * 1000) - Number(responsedata.login_record.login_timestamp * 1000) - Number(sessionStorage.getItem("session_time") * 1000);
                                    promiseOfSessionChecking = $interval(function () {
                                        $interval.cancel(promiseOfSessionChecking);
                                        dataFactory.loadSessionCheckingModal();
                                    }, numberofminutes); // x Minutes
                                    if (sessionStorage.getItem("inside_subject") == "Yes") {
                                        subjectLoggingFactory.subjectService();
                                    } else {
                                        console.log("No need to start subject service not at subject level");
                                    }
                                }, function (error) {
                                    errorFactory.errorWindowCloseModal("લોગિન નિષ્ફળ થયુ છે. ");
                                });
                        }, Number(sessionStorage.getItem("session_time") * 1000)); //
                    }
                }
            });
        }
        return dataFactory;
    }])
    .service("geturlServices", function () {
        //this below service is use slearn product get json file
        this.addUserInsert = function () {
            var urlPath = backend_api_base + "um/manage/adduser";
            return urlPath;
        };

        this.loginUser = function () {
            var urlPath = backend_api_base + "um/auth/login";
            return urlPath;
        }

        this.conceptroomJson = function (subjectid, floorid) {
            var urlPath = slearn_activities_metadata + subjectid + "/" + floorid + "_conceptroom.json";
            return urlPath;
        }

        this.floorJson = function (subjectid) {
            var urlPath = slearn_activities_metadata + subjectid + "/" + "floors.json";
            return urlPath;
        }

        this.dictionaryJosn = function () {
            var urlPath = slearn_activities_metadata + subjectid + "/" + "floors.json";
            return urlPath;
        }

        this.viewteacherdetails = function (schoolid) {
            var urlPath = backend_api_base + "um/insights/teacherdetail?school_id=" + schoolid;
            return urlPath;
        }

        this.forcefullyLogoutServices = function (userid) {
            var urlPath = backend_api_base + "um/auth/forcelogout/" + userid;
            return urlPath;
        }

        this.studentListDetail = function (data) {
            var urlPath = backend_api_base + "um/insights/studentdetail?payload=" + data;
            return urlPath;
        }

        this.userEnrolledsummery = function () {
            var urlPath = backend_api_base + "um/report/enrolledstudentsummary/true";
            return urlPath;
        }

        this.checkUserLogin = function (user_info) {
            return backend_api_base + 'um/auth/userDetails/' + user_info;
        }
    })
    .service('metaserviceServices', ['$http', function ($http) {
        //this metaserviceServices use Slquiz exam data
        var receivedgetcalldata = [];
        var standard = {};
        var subject = {};
        var skill = {};
        var division = {};
        var examdata = {};
        var examstdsubdata = {};

        this.getStandard = function () {
            var urlBase = mainslquizurl + "/metadata/standard.json";
            return urlBase;
        };

        this.setStandard = function (input) {
            sessionStorage.setItem("standardmetadata", JSON.stringify(input));
        };

        this.returnStandard = function () {
            standard = JSON.parse(sessionStorage.getItem("standardmetadata"));
            // console.log(standard);
            return standard;
        };

        this.getSubject = function () {
            var urlBase = mainslquizurl + "/metadata/subject.json";
            return urlBase;
        };

        this.setSubject = function (input) {
            sessionStorage.setItem("subjectmetadata", JSON.stringify(input));
        };

        this.returnSubject = function () {
            subject = JSON.parse(sessionStorage.getItem("subjectmetadata"));
            return JSON.parse(subject);
        };

        this.getSkill = function () {
            var urlBase = mainslquizurl + "/metadata/skill.json";
            return urlBase;
        };

        this.setSkill = function (input) {
            sessionStorage.setItem("skillmetadata", JSON.stringify(input));
        };

        this.returnSkill = function () {
            skill = JSON.parse(sessionStorage.getItem("skillmetadata"));
            //console.log(skill);
            return skill;
        };

        this.getDivision = function () {
            var urlBase = mainslquizurl + "/metadata/division.json";
            return urlBase;
        };

        this.setDivision = function (input) {
            sessionStorage.setItem("divisionmetadata", JSON.stringify(input));
        };

        this.returnDivision = function () {
            division = JSON.parse(sessionStorage.getItem("divisionmetadata"));
            //console.log(division);
            return division;
        };

        this.getStandardSubjectSkill = function () {
            var urlBase = mainslquizurl + "/metadata/standardsubjectskill.json";
            return urlBase;
        };

        this.setStandardSubjectSkill = function (input) {
            sessionStorage.setItem("standardsubjectmetadata", JSON.stringify(input));
        };

        this.returnStandardSubjectSkill = function () {
            standardsubjectskill = JSON.parse(sessionStorage.getItem("standardsubjectmetadata"));
            //console.log(standardsubjectskill);
            return standardsubjectskill;
        };

        this.getExam = function () {
            var urlBase = mainslquizurl + "/questionPaper/exam.json";
            return urlBase;
        };

        this.setStdSubExam = function (input) {
            sessionStorage.setItem("examstdsubdata", JSON.stringify(input));
        };

        this.setExam = function (input) {
            sessionStorage.setItem("exammetadata", JSON.stringify(input));
        };

        this.returnExam = function () {
            examdata = JSON.parse(sessionStorage.getItem("exammetadata"));
            // console.log(standardsubjectskill);
            return examdata;
        };

        this.returnStdSubExam = function () {
            examstdsubdata = JSON.parse(sessionStorage.getItem("examstdsubdata"));
            // console.log(standardsubjectskill);
            return examstdsubdata;
        };

    }])
    .service('examMusterServices', ['$http', function ($http) {
        //this services is used to get the slquiz database data

        this.getExamMusterData = function (filterdata) {
            var urlBase = slquizurl + "/exammuster?filter=" + filterdata;
            return urlBase; //method get
        }

        this.setExamMusterData = function () {
            var urlBase = slquizurl + "/exammuster";
            return urlBase;
        };

        this.checkExamineeStatus = function (filterdata) {
            var urlBase = slquizurl + "/examinee?filter=" + filterdata;
            return urlBase;
        };

        this.updateExamineeStatus = function () {
            var urlBase = slquizurl + "/examinee";
            return urlBase;
        };

        this.getExamQuestions = function (info) {
            var urlBase = mainslquizurl + "/questionPaper/" + info;
            return urlBase; //method get
        };

        this.getWakefullnessQuestions = function (info) {
            var urlBase = mainslquizurl + "/metadata/" + info;
            return urlBase; //method get
        };

        this.totalsubExamTime = function () {
            var urlBase = slquizurl + "/exam/time";
            return urlBase; //this api send the stundet start and finish the exam time duration
        }

        this.getStudentDetails = function (data) {
            var urlPath = backend_api_base + "um/insights/studentdetail?payload=" + data;
            return urlPath; //this api get the stundet data standard division and school_id wise
        };
    }])
    .factory('slquizfactory', ['$http', function ($http) {

        var dataFactory = {};
        var temp = null;

        dataFactory.setSlquizId = function (id) {
            temp = id;
        };

        dataFactory.returnSlquizId = function () {
            return temp;
        };

        dataFactory.submitSlquizAnswers = function () {
            var urlBase = slquizurl + "/answersheet";
            return urlBase; //method post
        };

        dataFactory.checkUserSubmittedAnaswers = function (quizinfo) {
            var urlBase = slquizurl + "/answersheet/submitted?filter=" + quizinfo;
            return urlBase; //method get
        };

        return dataFactory;
    }])
    .factory('LiveExamFactory', function ($http) {
        var dataFactory = {};

        dataFactory.getQuestionBankId = function (stdid, subid) {
            var urlBase = mainslquizurl + "/questionPaper/" + stdid + "_" + subid + ".json";
            return urlBase; //this is $.Ajax get method to get the json file data
        };

        dataFactory.getLiveResultdata = function (data) {
            var urlBase = liveexamurl + "live/result";
            return urlBase; //this is $.Ajax post method
        }

        dataFactory.getExamineeState = function (data) {
            var urlBase = liveexamurl + "examinee/state";
            return urlBase; //this is $.Ajax post method
        };

        return dataFactory;
    })
    .factory('dialogFactory', function () {
        var factory = {};
        factory.dialogModal = function (title, statement) {
            $("<div title='" + title + "'>" + statement + "</div>").dialog({
                modal: true,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close"); //closing on Ok click
                    }
                },
            });
        }
        return factory;
    });
