angular.module('sledstudio')
    .controller('TakeslquizController', function ($scope, $compile, metaserviceServices, ajaxCallsFactory, examMusterServices, slquizfactory) {

        this.init = function () {
            sessionStorage.setItem("menuid", 3);
            var is_there_any_exam = false;
            var user = JSON.parse(localStorage.getItem("loginresponse"));

            var urlpath = examMusterServices.getExamMusterData("");
            $.ajax({
                type: "GET",
                url: urlpath,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    var examdetails = data.data;
                    for (var i = 0; i < examdetails.length; i++) {
                        if (String(examdetails[i].standard_id) == String(user.student_detail.standard_id) && String(examdetails[i].division_id) == String(user.student_detail.division_id) && examdetails[i].state == "START") {
                            is_there_any_exam = true;
                            document.getElementById('slquizavailable').style.display = 'flex';
                            switch (String(examdetails[i].subject_id)) {
                                case "1":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><science-available id="scienceavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </science-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "2":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><maths-available id="mathsavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </maths-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "3":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><ss-available id="ssavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </ss-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "4":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><gujarati-available id="gujaratiavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </gujarati-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "5":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><hindi-available id="hindiavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </hindi-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "6":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><english-available id="englishavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </english-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "7":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><sanskrit-available id="sanskritavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </sanskrit-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "9":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><sauniaaspaas-available id="sauniaaspaasavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </sauniaaspaas-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "10":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><mariaaspaas-available id="mariaaspaasavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </mariaaspaas-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;

                                case "11":
                                    $("#slquizavailable").append('<div class="col-md-4 col-sm-5 col-xs-6"><amariaaspaas-available id="amariaaspaasavailableid" slquizvalue="' + examdetails[i].questionpaper_id + '"> </amariaaspaas-available></div></div>');
                                    $compile("#slquizavailable")($scope);
                                    break;
                            }
                        }
                    }

                    if (is_there_any_exam == false) {
                        document.getElementById('noslquizavailable').style.display = 'block';
                        $("#noslquizavailable").html("<noslquiz-available> </noslquiz-available>");
                        $compile("#noslquizavailable")($scope);
                    }else{
                        document.getElementById('info').style.display = 'block';
                    }
                }
            });
        };

        this.init();

        $scope.goBackToSlQuizPage = function () {
            window.location.href = "#/home";
        }

    })
    .directive('noslquizAvailable', function () {
        return {
            restrict: 'E',
            template: '<center><h3> No Quiz Available today.</h3> <button type="button" class="btn btn-info" ng-click="goBackToSlQuizPage()">Go Back </button></center>'
        };
    })
    .directive('scienceAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<br/><div id="scienceavailableblock" class="blockdesign"><center><img class="img-responsive" id="sciimg"/><hr/><h4> વિજ્ઞાન અને ટેકનોલોજી </h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/science.png';
                $('#sciimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#scienceavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('mathsAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="mathsavailableblock" class="blockdesign"><center><img class="img-responsive" id="matimg"/><hr/><h4> ગણિત</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/maths.png';
                $('#matimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#mathsavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('ssAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="ssavailableblock" class="blockdesign"><center><img class="img-responsive" id="ssimg"/><hr/><h4> સામાજિક વિજ્ઞાન</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/socialscience.png';
                $('#ssimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#ssavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('englishAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="englishavailableblock" class="blockdesign"><center><img class="img-responsive" id="engimg"/><hr/><h4> અંગ્રેજી </h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/english.png';
                $('#engimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#englishavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('hindiAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="hindiavailableblock" class="blockdesign"><center><img class="img-responsive" id="hinimg"/><hr/><h4> હિન્દી</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/hindi.png';
                $('#hinimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#hindiavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('gujaratiAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="gujaratiavailableblock" class="blockdesign"><center><img class="img-responsive" id="gujimg"/><hr/><h4> ગુજરાતી</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/gujarati.png';
                $('#gujimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#gujaratiavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('sanskritAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="sanskritavailableblock" class="blockdesign"><center><img class="img-responsive" id="sanskritimg"/><hr/><h4> સંસ્કૃત</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/sanskrit.png';
                $('#sanskritimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#sanskritavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('sauniaaspaasAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="sauniaaspaasavailableblock" class="blockdesign"><center><img class="img-responsive" id="sauimg"/><hr/><h4> સૌની આસપાસ</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/sau.png';
                $('#sauimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#sauniaaspaasavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('mariaaspaasAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="mariaaspaasavailableblock" class="blockdesign"><center><img class="img-responsive" id="mariimg"/><hr/><h4> મારી આસપાસ</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/mari.png';
                $('#mariimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#mariaaspaasavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }])
    .directive('amariaaspaasAvailable', ['slquizfactory', function (slquizfactory) {
        return {
            restrict: 'E',
            template: '<div id="amariaaspaasavailableblock" class="blockdesign"><center><img class="img-responsive" id="amariimg"/><hr/><h4> અમારી આસપાસ</h4></center></div>',
            link: function (scope, element) {
                var imgpath = baselinkforfiles + 'images/amari.png';
                $('#amariimg').attr('src', imgpath);

                element.bind('click', function () {
                    var id = $("#amariaaspaasavailableid").attr("slquizvalue");
                    slquizfactory.setSlquizId(id);
                    window.location.href = "/#takesubjectslquiz";
                    localStorage.setItem("studentSubExamStartTime", parseInt(new Date().getTime() / 1000));
                });
            }
        };
    }]);