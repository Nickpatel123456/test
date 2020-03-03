angular.module('sledstudio')
    .controller('LoginFormController', function ($scope, $rootScope, $window, $interval, errorFactory, logOutFactory, ajaxCallsFactory, slateFactory, CommonController, basicFactory, geturlServices, dataModalServices) {
        $scope.displayProduct = false;
        $scope.removeTemporarysessionStorageItem = function () {
            sessionStorage.removeItem("product_config");
            sessionStorage.removeItem("student_access");
            sessionStorage.removeItem("teacher_access");
            sessionStorage.removeItem("head_master_access");
            sessionStorage.removeItem("reviewer_access");
            sessionStorage.removeItem("admin_access");
            sessionStorage.removeItem("dummy_student_access");
            sessionStorage.removeItem("tempproductid");
        }

        $scope.showProductCatlog = function () {
            $scope.selectedproduct = 0;
        }

        $scope.allowedUser = function (response) {
            dataModalServices.closeModal();
            sessionStorage.setItem("selectedProduct", response.data.data.login_record.product_id);
            sessionStorage.setItem("user_id", response.data.data.login_record.user_id);
            sessionStorage.setItem("user_tag", response.data.data.user_detail.user_tag);
            sessionStorage.setItem("user_password", $scope.isAndroid ? $scope.loginDetailsOfUser.Username : $scope.loginDetailsOfUser.Password);
            sessionStorage.setItem("user_role", response.data.data.user_detail.user_role);
            sessionStorage.setItem("first_name", response.data.data.user_detail.first_name);
            sessionStorage.setItem("last_name", response.data.data.user_detail.last_name);
            sessionStorage.setItem("loggedInCorrectly", "Yes");
            sessionStorage.setItem("user_session_key", response.data.data.login_record.session_key);
            localStorage.setItem("loginresponse", JSON.stringify(response.data.data));
            CommonController.runSessionKeyCheckService(JSON.parse(localStorage.getItem("loginresponse")));
            $scope.removeTemporarysessionStorageItem();
            window.location.href = "#/home";
        }

        $scope.notAllowedUser = function (response) {
            dataModalServices.closeModal();
            localStorage.setItem("loginresponse", JSON.stringify(response.data.data));
            $scope.showProductCatlog();
            $scope.loginDetailsOfUser.Username = "";
            $scope.loginDetailsOfUser.Password = "";
            logOutFactory.logUnauthorizedUserOut();
        }


        $scope.tryLoggingIn = function () {
            dataModalServices.openMoldal();
            $scope.disable_login_button = true;
            var login_api = geturlServices.loginUser();

            var request = {
                "user_tag": $scope.loginDetailsOfUser.Username,
                "password": $scope.isAndroid ? $scope.loginDetailsOfUser.Username : $scope.loginDetailsOfUser.Password,
                "product_id": Number(sessionStorage.getItem("tempproductid"))
            }

            ajaxCallsFactory.postCall(login_api, request)
                .then(function (response) {
                    if (response.status == 200) {
                        if (response.data.success == true && response.data.status == 200) {
                            //this below switch check the user is authorised or not in product login
                            switch (response.data.data.user_detail.user_role) {
                                case "student":
                                    //this if check the factory.js file inside use basicFactory code
                                    if (basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("student_access")) == "Yes" && basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("product_config")) == "Yes") {
                                        $scope.allowedUser(response);
                                    } else {
                                        $scope.notAllowedUser(response);
                                    }
                                    break;

                                case "dummy_student":
                                    if (basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("student_access")) == "Yes" && basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("product_config")) == "Yes") {
                                        $scope.allowedUser(response);
                                    } else {
                                        $scope.notAllowedUser(response);
                                    }
                                    break;

                                case "teacher":
                                    if (basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("teacher_access")) == "Yes" && basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("product_config")) == "Yes") {
                                        $scope.allowedUser(response);
                                    } else {
                                        $scope.notAllowedUser(response);
                                    }
                                    break;

                                case "headmaster":
                                    if (basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("head_master_access")) == "Yes" && basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("product_config")) == "Yes") {
                                        $scope.allowedUser(response);
                                        window.location.href = "#/home";
                                    } else {
                                        $scope.notAllowedUser(response);
                                    }
                                    break;

                                case "reviewer":
                                    if (basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("reviewer_access")) == "Yes" && basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("product_config")) == "Yes") {
                                        $scope.allowedUser(response);
                                    } else {
                                        $scope.notAllowedUser(response);
                                    }
                                    break;

                                case "admin":
                                    if (basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("admin_access")) == "Yes" && basicFactory.checkIfArrayHasValue(sessionStorage.getItem("tempproductid"), sessionStorage.getItem("product_config")) == "Yes") {
                                        $scope.allowedUser(response);
                                    } else {
                                        $scope.notAllowedUser(response);
                                    }
                                    break;

                                default:
                                    $scope.notAllowedUser(response);
                                    break;
                            }

                        } else {
                            dataModalServices.closeModal();
                            $scope.loginDetailsOfUser.Username = "";
                            $scope.loginDetailsOfUser.Password = "";
                            errorFactory.errorWindowCloseModal("આ યુઝર માટે સેસન ચાલુ છે.");
                        }
                    } else {
                        dataModalServices.closeModal();
                        errorFactory.errorWindowCloseModal("Please contact schoolsLENS.");
                    }
                }, function (error) {
                    dataModalServices.closeModal();
                    errorFactory.errorWindowCloseModal("લોગ ઈન નિષ્ફળ ... વપરાશકર્તા નામ અને પાસવર્ડ ખોટા છે. ");
                });
        }

        $scope.loadProductNormally = function () {
            ajaxCallsFactory.getCall(sledstudio_menu)
                .then(function (response) {
                    var sledstudio_menu_data = response.data.product_index;
                    var productmode = response.data.product_mode;

                    ajaxCallsFactory.getCall(school_config)
                        .then(function (response1) {
                            var servertype = response1.data.server_detail.server_type;
                            $scope.productDetails = [];

                            switch (productmode) {
                                case "SCHOOL":
                                    if (servertype == "SERVER") {
                                        var productid_list = response.data.product_acces_control_basis_product_mode.SCHOOL.SERVER
                                    } else if (servertype == "SMART_CLASS") {
                                        var productid_list = response.data.product_acces_control_basis_product_mode.SCHOOL.SMART_CLASS
                                    }
                                    $scope.productruuning = true;
                                    break;

                                case "CLOUD_REPORTING":
                                    var productid_list = response.data.product_acces_control_basis_product_mode.CLOUD_REPORTING.default
                                    $scope.productruuning = false;
                                    break;
                            }

                            angular.forEach(productid_list, function (value, key) {
                                $scope.productDetails.push({
                                    key: value,
                                    details: sledstudio_menu_data[value]
                                })

                            });
                            sessionStorage.setItem("product_config", JSON.stringify($scope.productDetails));
                        }, function (error) {
                            errorFactory.errorWindowCloseModal("sledstudio menu Config File Error !!! Please contact Schoolslens");
                        });

                    $scope.version_Name = response.data.suite_detail.version;
                    sessionStorage.setItem("student_access", JSON.stringify(response.data.product_acces_control.student));
                    sessionStorage.setItem("teacher_access", JSON.stringify(response.data.product_acces_control.teacher));
                    sessionStorage.setItem("head_master_access", JSON.stringify(response.data.product_acces_control.headmaster));
                    sessionStorage.setItem("reviewer_access", JSON.stringify(response.data.product_acces_control.reviewer));
                    sessionStorage.setItem("admin_access", JSON.stringify(response.data.product_acces_control.admin));
                    sessionStorage.setItem("dummy_student_access", JSON.stringify(response.data.product_acces_control.dummy_student));

                    ajaxCallsFactory.getCall(slearn_config)
                        .then(function (response1) {
                            sessionStorage.setItem("session_time", response1.data.ui_config.session_control.session_expiry_check);
                            sessionStorage.setItem("session_expired_logout", response1.data.ui_config.session_control.session_expired_logout);
                            sessionStorage.setItem("showpopuptime", response1.data.ui_config.session_control.showpopuptime);
                            sessionStorage.setItem("subject_recording_time", response1.data.ui_config.subject_recording_time);
                        }, function (error) {
                            errorFactory.errorWindowCloseModal("slearn Config File Error !!! Please contact Schoolslens");
                        });
                }, function (error) {
                    errorFactory.errorWindowCloseModal("sledstudio menu Config File Error !!! Please contact Schoolslens");
                });
        }

        $scope.uiTextConfig = function () {
            ajaxCallsFactory.getCall(dictionary)
                .then(function (resUiText) {
                    sessionStorage.setItem("uiTextConfig", JSON.stringify(resUiText.data));
                    $scope.selectProductText = resUiText.data.selectProductName; //this scope variable is use to login html file
                }, function (error) {
                    errorFactory.errorWindowCloseModal("Cannot get Ui Text Config file.");
                });
        }

        countDownDate = eval(Base64.decode(myOwnFun()));
        x = setInterval(function () {
            myTimer();
            if (showornot == true) {
                if (JSON.parse(localStorage.getItem('loginresponse'))) {
                    logOutFactory.logUserOut();
                }
            }
            $scope.displayProduct = showornot;
        }, 1000);

        this.init = function () {
            $interval.cancel(showWarningMsgPopupRelogin);
            $scope.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; // indexOf("android") or indexOf("windows")

            if ($scope.displayProduct == false) {
                if (showornot == "" || showornot == true) {
                    $scope.displayProduct = true;
                } else {
                    $scope.displayProduct = false;
                }
                $('body').removeClass('backgroundImage');
                $('body').removeClass('slearnbackground');
                $('body').removeClass('conceptroombackground');
                $("body").addClass("loginbackground");
                $('body').removeClass('slearn_subject_bg_color');
                $scope.selectedproduct = -1;
                $scope.baseLinkForScope = baselinkforfiles;
                CommonController.backgroundTabCheckService();
                $scope.instruction = "Checking if a session exists...";
                $scope.uiTextConfig();

                ajaxCallsFactory.getCall(school_config)
                    .then(function (response) {
                        $scope.serverdetails = response.data.server_detail.server_type + "(" + response.data.server_detail.server_id + ")";
                    }, function (error) {
                        console.log("not define server details in sledstudio json")
                    });

                if (localStorage.getItem("loginresponse") == null) {
                    $scope.selectedproduct = 0;
                    $scope.loadProductNormally();
                } else {
                    $scope.sessionchecking = 1;
                    $scope.instruction = "Checking if session is valid !!";
                    ajaxCallsFactory.getCall(server_current_time)
                        .then(function (response2) {
                            var responsedata = JSON.parse(localStorage.getItem("loginresponse"));
                            var currenttime = response2.data.data.timestamp;
                            if (currenttime > responsedata.login_record.logout_timestamp) {
                                $scope.selectedproduct = 0;
                                localStorage.removeItem("loginresponse");
                                $scope.loadProductNormally();
                            } else {
                                $scope.sessionchecking = 0;
                                $scope.instruction = "આ યુઝર માટે સેસન ચાલુ છે. આગળ વધવા માટે લોગ આઉટ પર ક્લિક કરો.";
                            }
                        }, function (error) {
                            errorFactory.errorWindowCloseModal("સર્વરથી સમય મળી શકતો નથી કૃપા કરીને કનેક્શન તપાસો.");
                        });
                }
            } else if ($scope.displayProduct == true) {
                if (JSON.parse(localStorage.getItem('loginresponse'))) {
                    logOutFactory.logUserOut();
                }
                $scope.displayProduct = false;
            }
        }

        this.init();

        $scope.launchSlate = function (slateid) {
            slateFactory.launchSlate(slateid);
        }

        $scope.closeSession = function () {
            logOutFactory.logUnauthorizedUserOut();
        }

        $scope.loginSelectedProduct = function (productdata) {
            $scope.displayProduct = false;
            if (productdata.key == 2) {
                slateFactory.launchSlate(productdata.key);
            } else {
                $scope.selectedproduct = 1;
                sessionStorage.setItem("tempproductid", productdata.key);
                $rootScope.productname = productdata.details.name.en;
                $scope.productpath = "images/product" + productdata.key + ".png";
            }
        }

        $scope.toggleKeyBoard = function () {
            $scope.isAndroid = !$scope.isAndroid;
        }
    })
    .directive('keyBoardDirective', [function () {
        return {
            restrict: 'A',
            scope: {isAndroid: '='},
            link: function (scope, element, attr, ctrl) {
                scope.$watch('isAndroid', function (newValue) {
                    if (newValue === true) {
                        element.attr('type', 'number')
                    } else {
                        element.attr('type', 'text')
                    }
                })
            }
        };
    }]);
