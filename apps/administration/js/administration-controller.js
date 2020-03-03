angular.module('sledstudio')
    .controller('AdministrationController', function ($scope, $window, errorFactory, basicFactory, CommonController, ajaxCallsFactory, $filter, geturlServices, subjectLoggingFactory, dataModalServices) {
        this.init = function () {
            // CommonController.backgroundTabCheckService();
            if (basicFactory.checkIfLoggedInCorrectly() == true) {
                $("body").addClass("backgroundImage");
                sessionStorage.setItem("menuid", sessionStorage.getItem("selectedProduct"));
                $scope.AddUser = {TeacherIsAPrincipal: 'No'};
                $scope.ViewUser = {};

                ajaxCallsFactory.getCall(sledstudio_menu)
                    .then(function (response) {
                        $scope.userRoleCatloge = response.data.role_catelogue;
                        $scope.userRoleArray = [];
                        for (var k in $scope.userRoleCatloge) {
                            $scope.userRoleArray.push({roleType: k, roleName: $scope.userRoleCatloge[k].guj})
                        }
                    }, function (error) {
                        errorFactory.errorWindowCloseModal("slearn Config File Error !!! Please contact Schoolslens");
                    });

                ajaxCallsFactory.getCall(dictionary)
                    .then(function (response1) {
                        $scope.teachertypedata = response1.data.teachertype;
                    }, function (error) {
                        errorFactory.errorWindowCloseModal("Dictionary Config File Error !!! Please contact Schoolslens");
                    });

                ajaxCallsFactory.getCall(school_config)
                    .then(function (response2) {
                        var standard_division_map = response2.data.standard_division_map;
                        $scope.standarddata = [];
                        for (var stdkey in standard_division_map) {
                            $scope.standarddata.push(stdkey)
                        }

                    }, function (error) {
                        errorFactory.errorWindowCloseModal("sledstudio json File Error !!! Please contact Schoolslens");
                    });
            }

            $scope.showSlquizPanel = JSON.parse(sessionStorage.getItem('slquizPanel'));
        }

        this.init();

        $scope.gotosLquiz = function () {
            $("body").removeClass("backgroundImage");
            sessionStorage.setItem("selectedProduct", "3");
            sessionStorage.setItem("menuid", "3");
            $window.location.href = "#/slquiz";
        }

        $scope.getdivisiondata = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    if ($scope.viewform == "student") {
                        $scope.stddivision = response.data.standard_division_map[$scope.ViewUser.StudentStandard];
                    } else {
                        $scope.stddivision = response.data.standard_division_map[$scope.AddUser.StudentStandard];
                    }

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            $scope.divisiondata = response1.data.division;
                            $scope.divisiondataarray = [];
                            $.each($scope.stddivision, function (k, v) {
                                $scope.divisiondataarray.push({divid: v, divname: $scope.divisiondata[v].name});
                            });
                        }, function (error) {
                            errorFactory.errorWindowCloseModal("Dictionary Config File Error !!! Please contact Schoolslens");
                        });
                }, function (error) {
                    errorFactory.errorWindowCloseModal("School Config File Error !!! Please contact Schoolslens");
                });
        }


        /* Start of Add user module. Validating the entire form */
        $scope.checkAddUserFormValid = function (isValid) {
            var user = {};
            if (isValid) {
                switch ($scope.AddUser.RoleType) {
                    case "dummy_student":
                    case "student":
                        var date_Of_Birth = $filter('date')($scope.AddUser.StudentDateOfBirth, "dd-MM-yyyy");
                        user = JSON.stringify({
                            "student_detail": {
                                "standard_id": $scope.AddUser.StudentStandard,
                                "division_id": $scope.AddUser.StudentDivision.divid,
                                "roll_number": $scope.AddUser.StudentRollNumber,
                                "address": $scope.AddUser.StudentAddress,
                                "father_name": $scope.AddUser.StudentMiddleName
                            },
                            "user_detail": {
                                "gender": $scope.AddUser.StudentGender.value,
                                "user_tag": $scope.AddUser.StudentUserName,
                                "password": $scope.AddUser.StudentPassword,
                                "user_role": $scope.AddUser.RoleType,
                                "dob": date_Of_Birth,
                                "first_name": $scope.AddUser.StudentFirstName,
                                "middle_name": $scope.AddUser.StudentMiddleName,
                                "last_name": $scope.AddUser.StudentLastName,
                                "phone_number": $scope.AddUser.StudentPhone,
                                "email_id": $scope.AddUser.StudentEmail
                            }
                        });
                        $scope.addusersendbackenddata(user);
                        break;

                    case "headmaster":
                    case "teacher":
                        if ($scope.AddUser.RoleType == "headmaster") {
                            var flag = true;
                        } else if ($scope.AddUser.RoleType == "teacher") {
                            var flag = false;
                        }

                        var date_Of_Birth = $filter('date')($scope.AddUser.TeacherDateOfBirth, "dd-MM-yyyy");
                        user = JSON.stringify({
                            "teacher_detail": {
                                "teacher_type": $scope.AddUser.TeacherType.name.en,
                                "is_headmaster": flag,
                                "address": $scope.AddUser.TeacherAddress,
                                "exprience_in_year": $scope.AddUser.TeacherExperience
                            },
                            "user_detail": {
                                "gender": $scope.AddUser.TeacherGender.value,
                                "user_tag": $scope.AddUser.TeacherUserName,
                                "password": $scope.AddUser.TeacherPassword,
                                "user_role": $scope.AddUser.RoleType,
                                "dob": date_Of_Birth,
                                "first_name": $scope.AddUser.TeacherFirstName,
                                "middle_name": $scope.AddUser.TeacherMiddleName,
                                "last_name": $scope.AddUser.TeacherLastName,
                                "phone_number": $scope.AddUser.TeacherPhone,
                                "email_id": $scope.AddUser.TeacherEmail
                            }
                        });
                        $scope.addusersendbackenddata(user);
                        break;

                    case "admin":
                    case "reviewer":
                        var date_Of_Birth = $filter('date')($scope.AddUser.AdminDateOfBirth, "dd-MM-yyyy");
                        user = JSON.stringify({
                            "user_detail": {
                                "gender": $scope.AddUser.AdminGender.value,
                                "user_tag": $scope.AddUser.AdminUserName,
                                "password": $scope.AddUser.AdminPassword,
                                "user_role": $scope.AddUser.RoleType,
                                "dob": date_Of_Birth,
                                "first_name": $scope.AddUser.AdminFirstName,
                                "middle_name": $scope.AddUser.AdminMiddleName,
                                "last_name": $scope.AddUser.AdminLastName,
                                "phone_number": $scope.AddUser.AdminPhone,
                                "email_id": $scope.AddUser.AdminEmail
                            }
                        });
                        $scope.addusersendbackenddata(user);
                        break;
                }
            } else {
                errorFactory.errorModal("લાલ ખાના ફરજિયાત ભરો.");
            }
        }

        $scope.addusersendbackenddata = function (data) {
            var pathurl = geturlServices.addUserInsert();
            ajaxCallsFactory.postCall(pathurl, data)
                .then(function (response1) {
                    errorFactory.errorModal("User data add successfully.");
                    $scope.AddUser = {};
                }, function (error) {
                    errorFactory.errorModal("This user entry all ready added. ! Try using different" + error.data.message);
                });
        }
        /* End of validating form */


        /* Start of View user module. */
        $scope.viewuserdetails = function () {
            switch ($scope.ViewUser.RoleType.roleType) {
                case 'teacher':
                    $scope.getTeacherDetails();
                    break;

                case 'student':
                    $scope.getStudentDetails();
                    break;

                default:
                    $scope.viewform = "";
                    break;
            }
        }

        $scope.getStudentDetails = function () {
            $scope.viewform = "student";
        }

        //this function show student details in view student directive on button click
        $scope.studenttableDetail = function () {
            dataModalServices.openMoldal();
            $scope.tableviewstudent = false;
            var stdid = $scope.ViewUser.StudentStandard;
            var divid = $scope.ViewUser.StudentDivision.divid;

            ajaxCallsFactory.getCall(school_config)
                .then(function (resSchoolConfig) {
                    var schoolId = resSchoolConfig.data.school_detail.school_id;
                    var data = JSON.stringify({"school_id": schoolId, "standard_id": stdid, "division_id": divid});
                    var studentdata = geturlServices.studentListDetail(data);
                    ajaxCallsFactory.getCall(studentdata)
                        .then(function (response) {
                            var objdata = JSON.stringify({
                                school_id: schoolId,
                                product_id: 1,
                                standard_id: stdid,
                                division_id: divid
                            });
                            $.ajax({
                                type: "POST",
                                url: skiilreport_backend_api + 'teacher/inactivestudents',
                                data: objdata,
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: true,
                                success: function (res) {
                                    $scope.studentdetail = {};
                                    angular.forEach(response.data.data, function (value, key) {
                                        if (res.data[key]) {
                                            $scope.studentdetail[key] = {
                                                rowColor: 'danger',
                                                data: value
                                            };
                                        } else {
                                            $scope.studentdetail[key] = {
                                                rowColor: 'success',
                                                data: value
                                            };
                                        }
                                    });
                                    dataModalServices.closeModal();
                                    $scope.tableviewstudent = true;
                                }
                            });

                        }, function (error) {
                            errorFactory.errorModal("can not get teacher details please check pass school id" + error.data.message);
                        });

                }, function (error) {
                    errorFactory.errorModal("This school_config file error" + error.data.message);
                });
        }

        //this function use show teacher details in view teacher directive on button click
        $scope.getTeacherDetails = function () {
            dataModalServices.openMoldal();
            $scope.viewform = "teacher";
            ajaxCallsFactory.getCall(school_config)
                .then(function (resSchoolConfig) {
                    var schoolid = resSchoolConfig.data.school_detail.school_id;
                    var teacherdata = geturlServices.viewteacherdetails(schoolid);
                    $scope.teacherStoreData = [];
                    ajaxCallsFactory.getCall(teacherdata)
                        .then(function (resTeacher) {
                            $scope.teacherStoreData = resTeacher.data.data;
                            $scope.upper = $scope.teachertypedata[1].name.guj;
                            $scope.lower = $scope.teachertypedata[2].name.guj;
                            dataModalServices.closeModal();
                        }, function (error) {
                            errorFactory.errorModal("can not get teacher details please check pass school id" + error.data.message);
                        });
                }, function (error) {
                    errorFactory.errorModal("This school_config file error" + error.data.message);
                });
        }
        /* End of View user Form form */


        /* User ForceFully LogOut function*/
        $scope.forcefullyLout = function (id) {
            var logoutUrl = geturlServices.forcefullyLogoutServices(id);
            ajaxCallsFactory.getCall(logoutUrl)
                .then(function (resLogout) {
                    errorFactory.errorModal(resLogout.data.message);
                }, function (error) {
                    errorFactory.errorModal("This User can't Active" + error.data.message);
                });
        }
        /* */
    })
    .directive('addusersForm', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/administration/html/addusers.html'
        };
    })
    .directive('addStudent', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/administration/html/addusers/addstudent.html'
        };
    })
    .directive('addTeacher', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/administration/html/addusers/addteacher.html'
        };
    })
    .directive('addAdmin', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/administration/html/addusers/addadmin.html'
        };
    })
    .directive('viewuserForm', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/administration/html/viewuser.html'
        };
    })
    .directive('viewteacherForm', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/administration/html/viewusers/viewteacher.html'
        };
    })
    .directive('viewstudentForm', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/administration/html/viewusers/viewstudent.html'
        };
    });
