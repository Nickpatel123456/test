angular.module('sledstudio')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/takesubjectslquiz', {
                templateUrl: baselinkforfiles + 'apps/slquiz/html/take_exam/slquizquestionpaper.html',
                controller: 'SlquizquestionpaperController'
            })
            .otherwise({redirectTo: '/'})
    });
