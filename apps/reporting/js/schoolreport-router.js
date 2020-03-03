angular.module('sledstudio')
.config(function ($routeProvider) {
    $routeProvider
	.when('/student-slearnusage', {
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-usage/slearn-usage.html', 
        controller: 'SlearnUsageReportController'
	})
	.when('/student-slateusage', {
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slate-usage/slate-usage.html', 
        controller: 'SlateUsageReportController'
	})
	.when('/student-slearnAcademic', {
		templateUrl: baselinkforfiles+'apps/reporting/html/student/slearn-academic/slearn-academic.html', 
        controller: 'SlearnAcademicReportController'
	})
	.when('/skillwise-report', {
		templateUrl: baselinkforfiles+'apps/reporting/html/student/skillwise-usage/skillwise-usage.html', 
        controller: 'SkillWiseUsageReportController'
	})
	.when('/studentreport', {
		templateUrl: baselinkforfiles+'apps/reporting/html/student-report/studentreport.html', 
        controller: 'StudentReportController'
	})
	.when('/teacher-slateusage', {
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/slate-usage/slate-usage.html', 
        controller: 'TeacherSlateUsageReportController'
	})	
	.when('/slquizyear-report', {
		templateUrl: baselinkforfiles+'apps/reporting/html/slquizyear-report/slquizyear-reporting.html', 
        controller: 'SlquizYearController'
	})
	.when('/dashboard-report', {
		templateUrl: baselinkforfiles+'apps/reporting/html/dashboard/dashboard-reporting.html', 
        controller: 'DashboardReportController'
	})
	.when('/teacherreportusage-report', {
		templateUrl: baselinkforfiles+'apps/reporting/html/teacher/report-usage/reportusage-reporting.html', 
        controller: 'TeacherReportUsageReportController'
	})
	.otherwise({redirectTo: '/'})
});
