angular.module('sledstudio')
.config(function ($routeProvider) {
    $routeProvider
	.when('/sLearn-report', {
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLearn-report/aggreation-slearn.html', 
        controller: 'AggreationSlearnController'
	})
	.when('/sLate-report', {
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/sLate-report/aggreation-slate.html', 
        controller: 'AggreationSlateController'
	})
	.when('/Isolated-report', {
		templateUrl: baselinkforfiles+'apps/reporting/html/aggregation-report/Isolated-report/year-dashboard.html', 
        controller: 'YearDashboardController'
		
	})
	.otherwise({redirectTo: '/'})
});
