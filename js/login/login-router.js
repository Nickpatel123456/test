angular.module('sledstudio')
.config(function ($routeProvider) {
    $routeProvider
	.when('/home', {
		templateUrl: baselinkforfiles+'html/home/home.html', 
        controller: 'HomeController'
	})
	.otherwise({redirectTo: '/'})
});
