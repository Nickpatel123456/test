angular.module('sledstudio')
    .controller('NavbarController', function ($scope, $rootScope, slateFactory, logOutFactory, basicFactory, CommonController, dataModalServices) {
        this.init = function () {
            $scope.slearnsubjectname = sessionStorage.getItem("slearnsubjectname");
            CommonController.backgroundTabCheckService();
            if (basicFactory.checkIfLoggedInCorrectly() == true && promiseOfSessionChecking != null) {
                $scope.baseLinkForScope = baselinkforfiles;
                $scope.usersfirstname = sessionStorage.getItem("first_name") + " " + sessionStorage.getItem("last_name");
                $("body").removeClass("loginbackground");
                $scope.menu = Number(sessionStorage.getItem("menuid"));
                var str = sessionStorage.getItem("selectedProduct");
                var navRequired = str.split(",");
                for (var i = 0; i < navRequired.length; i++) {
                    switch (navRequired[i]) {
                        case "1":
                            $scope.navslearn = 1;
                            break;
                        case "2":
                            $scope.navslate = 2;
                            break;
                        case "3":
                            $scope.navslquiz = 3;
                            break;
                        case "4":
                            $scope.navreporting = 4;
                            break;
                        case "5":
                            $scope.navextra = 5;
                            break;
                        case "6":
                            $scope.navreview = 6;
                            break;
                        case "7":
                            $scope.navmonitor = 7;
                            break;
                        case "8":
                            $scope.navadministration = 8;
                            break;
                        case "9":
                            $scope.navslquizadm = 9;
                            break;
                    }
                }
            } else {
                // Yet to decide whether to logout or loguserout
                logOutFactory.logOut();
            }
        }
        this.init();

        $scope.launchSlate = function () {
            slateFactory.launchSlate();
        }

        $scope.logOut = function () {
            if ($rootScope.userOnline) {
                dataModalServices.openMoldal();
                logOutFactory.logUserOut();
            } else {
                alert('browser offline')
            }
        }
    });
