angular.module('sledstudio', ['ngRoute', 'chart.js', 'ui.bootstrap', 'ui.utils'])
    .config(function ($routeProvider, $locationProvider, $sceProvider) {
        $sceProvider.enabled(false);
        $routeProvider
            .when("/", {
                templateUrl: baselinkforfiles + 'html/login/login.html',
                controller: 'LoginFormController'
            })
            .otherwise({redirectTo: '/'});
    })
    .service('CommonController', ['$interval', '$uibModal', 'ajaxCallsFactory', 'logOutFactory', 'sessionCheckingFactory', function ($interval, $uibModal, ajaxCallsFactory, logOutFactory, sessionCheckingFactory, $scope, $window) {
        //this below code is check multiple tab is open or not in same browser at same time server url
        this.runBackgroundTabCheckService = function (sltabopennumber) {
            promiseOfOnlyOneTab = $interval(function () {
                if (sltabopennumber == localStorage.getItem("sltabopen")) {
                    localStorage.setItem("sltabopen", sltabopennumber);
                } else {
                    localStorage.setItem("sltabopen", 0);
                    window.location.href = "#/";
                    $uibModal.open({
                        templateUrl: baselinkforfiles + 'html/error/errorwithoutbutton.html',
                        scope: $scope,
                        backdrop: 'static',
                        keyboard: false,
                        controller: function ($uibModalInstance, $scope, $window) {
                            $scope.errstatement = "મલ્ટીપલ ટૅબ્સ અથવા ક્રોમ વિન્ડો સમાન એપ્લિકેશન ચલાવી રહ્યાં છે. ચાલુ રાખવા માટે કૃપા કરીને બધા ક્રોમ વિન્ડો બંધ કરો.";
                        }
                    });
                    $interval.cancel(promiseOfOnlyOneTab);
                }
            }, 3000); // 3 seconds

        };

        //this below code is set the localStorage var sltabopen value when user refresh the page(if open two tab and run same url in both tab then set the same value in localStorage var sltabopen)
        this.backgroundTabCheckService = function () {
            $interval.cancel(promiseOfOnlyOneTab);
            if (localStorage.getItem("sltabopen") === null) {
                localStorage.setItem("sltabopen", Number(localStorage.getItem("sltabopen")));
                this.runBackgroundTabCheckService(localStorage.getItem("sltabopen"));
            } else {
                localStorage.setItem("sltabopen", Number(Number(localStorage.getItem("sltabopen")) + 1));
                this.runBackgroundTabCheckService(localStorage.getItem("sltabopen"));
            }
        };


        //this below code is user session modal show when user session timeout left 5 seconds
        this.runSessionKeyCheckService = function (responsedata) {
            var numberofminutes = Number(responsedata.login_record.logout_timestamp * 1000) - Number(responsedata.login_record.login_timestamp * 1000) - Number(sessionStorage.getItem("session_time") * 1000);
            numberofminutes = numberofminutes - Number(sessionStorage.getItem("showpopuptime") * 1000);
            promiseOfSessionChecking = $interval(function () {
                $interval.cancel(promiseOfSessionChecking);
                sessionCheckingFactory.loadSessionCheckingModal();
            }, numberofminutes); // x Minutes
        };
    }])
    .run(function ($window, $rootScope, $interval, ajaxCallsFactory, geturlServices) {
        $rootScope.userOnline = true;
        var count = 0;

        $window.addEventListener("offline", function () {
            $rootScope.$apply(function () {
                count++;
                console.log('offline');
                if (localStorage.getItem('loginresponse')) {
                    var user_info = JSON.parse(localStorage.getItem('loginresponse')).user_detail.user_id;
                    ajaxCallsFactory.getCall(geturlServices.checkUserLogin(user_info))
                        .then(function (response) {
                            console.log('User Login successfully ' + response.data);
                        }, function (error) {
                            $rootScope.userOnline = false;
                            $('<div title="સૂચના :" id="connectiodialog' + count + '">તમારુ wifi કનેક્સન છુટી ગયેલ છે.</div>').dialog({
                                modal: true,
                                width: 300,
                                dialogClass: "dialog-close-sign",
                                closeOnEscape: false,
                                open: function (event, ui) {
                                    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                                }
                            });
                        });
                }
            });
        }, false);
        $window.addEventListener("online", function () {
            $rootScope.$apply(function () {
                $rootScope.userOnline = true;
                console.log('online');
                $('#connectiodialog' + count).dialog('close');
            });
        }, false);
    });
