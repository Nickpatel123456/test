angular.module('sledstudio')
    .controller('SlQuizController', function ($scope, $compile, $rootScope, $interval, $http, $window, metaserviceServices, ajaxCallsFactory, dataModalServices) {
        dataModalServices.openMoldal();
        sessionStorage.setItem("menuid", 3);
        var examdata = metaserviceServices.getExam();
        $.ajax({
            type: "GET",
            url: examdata,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            crossDomain: true,
            success: function (response) {
                dataModalServices.closeModal();
                $scope.init();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                document.getElementById('notStrtaSlquizServer').style.display = 'block'
                dataModalServices.closeModal();
                console.log('Getting metaservice Exam Json Failed');
                console.log(xhr);
                console.log(ajaxOptions);
                console.log(thrownError);
            }
        });

        $scope.back = function () {
            $window.location.href = "#/home";
        }

        $scope.gotoAdmin = function() {
            sessionStorage.setItem("selectedProduct","8");
            sessionStorage.setItem("menuid","8");
            sessionStorage.setItem("slquizPanel","true");
            $window.location.href = "#/administration";
        }

        $scope.init = function () {
            $scope.imageurl = baselinkforfiles + 'images/';
            $interval.cancel($rootScope.Timer);
            var user_role = sessionStorage.getItem("user_role");
            //this switch display box admin or student login wise
            switch (user_role) {
                case "admin":
                    $scope.adminBlock = true;
                    break;

                case "student":
                    $scope.studentBlock = true;
                    break;
            }
            $compile("#slquizblock")($scope);

            var standardJson = metaserviceServices.getStandard();
            $.ajax({
                type: "GET",
                url: standardJson,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    metaserviceServices.setStandard(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Getting metaservice standard Failed');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });


            var subjectJson = metaserviceServices.getSubject();
            $.ajax({
                type: "GET",
                url: subjectJson,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    metaserviceServices.setSubject(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Getting metaservice subject Failed');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });


            var skillJson = metaserviceServices.getSkill();
            $.ajax({
                type: "GET",
                url: skillJson,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    metaserviceServices.setSkill(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Getting metaservice skill Failed');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });


            var divisionJson = metaserviceServices.getDivision();
            $.ajax({
                type: "GET",
                url: divisionJson,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    metaserviceServices.setDivision(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Getting metaservice division Failed');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });

            var stdsubJson = metaserviceServices.getStandardSubjectSkill();
            $.ajax({
                type: "GET",
                url: stdsubJson,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    metaserviceServices.setStandardSubjectSkill(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Getting metaservice standard subject Failed');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });

            var examJson = metaserviceServices.getExam();
            $.ajax({
                type: "GET",
                url: examJson,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    metaserviceServices.setStdSubExam(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Getting metaservice standard subject exam Failed');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });
        };

    })
    .directive('startSlquiz', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/admin_start_exam.html',
            controller: 'StartslquizController',
        };
    })
    .directive('monitoringSlquiz', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/admin_live_monitoring.html',
            controller: 'MonitoringslquizController',
        };
    })
    .directive('takeSlquiz', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/take_exam/takeslquiz.html',
            controller: 'TakeslquizController',
        };
    })
    .directive('errorSlquiz', function () {
        return {
            restrict: 'E',
            templateUrl: baselinkforfiles + 'apps/slquiz/html/error.html',
        };
    });