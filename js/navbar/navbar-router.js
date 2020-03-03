angular.module('sledstudio')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: baselinkforfiles + 'html/home/home.html',
                controller: 'HomeController'
            })
            .when('/slearn_subject', {
                templateUrl: baselinkforfiles + 'apps/slearn/html/slearn_subject.html',
                controller: 'SlearnsubjectController'
            })
            .when('/administration', {
                templateUrl: baselinkforfiles + 'apps/administration/html/administration.html',
                controller: 'AdministrationController'
            })
            .when('/review', {
                templateUrl: baselinkforfiles + 'apps/slearn/html/reviewer.html',
                controller: 'ReviewerController'
            })
            .when('/reporting', {
                templateUrl: baselinkforfiles + 'apps/reporting/html/schoolreporting.html',
                controller: 'ReportingController'
            })
            .when('/slquiz', {
                templateUrl: baselinkforfiles + 'apps/slquiz/html/slquiz.html',
                controller: 'SlQuizController'
            })
            .when('/user_manual', {
                templateUrl: baselinkforfiles + 'apps/user_manual/html/user_manual.html',
                controller: 'UserManualReportController'
            })
            .otherwise({redirectTo: '/'})
    });
