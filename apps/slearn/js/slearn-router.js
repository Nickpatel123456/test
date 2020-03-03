angular.module('sledstudio')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/slearn', {
                templateUrl: baselinkforfiles + 'apps/slearn/html/slearn.html',
                controller: 'SlearnController'
            })
            .when('/listeningcorner', {
                templateUrl: baselinkforfiles + 'apps/slearn/html/listening-corner.html',
                controller: 'ListeningCornerController'
            })
            .when('/conceptroom', {
                templateUrl: baselinkforfiles + 'apps/slearn/html/conceptroom.html',
                controller: 'ConceptroomController'
            })
            .when('/conceptlist', {
                templateUrl: baselinkforfiles + 'apps/slearn/html/conceptlist.html',
                controller: 'ConceptlistController'
            })
            .when('/activities_list', {
                templateUrl: baselinkforfiles + 'apps/slearn/html/activity_list.html',
                controller: 'ActivityListController'
            })
            .when('/activity', {
                templateUrl: baselinkforfiles+'apps/slearn/html/activity.html'
            })
            .otherwise({redirectTo: '/'})
    });
