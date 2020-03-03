var baselinkforfiles = "/test/";
// var baselinkforfiles = "/unmf/sledstudio/dashboard/app/";

var iplinkurl = "http://122.170.7.116:";
// var iplinkurl = window.location.href;
// iplinkurl = iplinkurl.split("/");
// iplinkurl = iplinkurl[0] + "//" + iplinkurl[2];
// iplinkurl = iplinkurl.slice(0, iplinkurl.length - 4);

//this below declaration variable is use to get the local jar file data  (if show the report on local server remove commit this variable else show report on cloud this below all variable is commit)
var backend_api_base = iplinkurl + "1920/sledstudioengine/api/";
var slearn_backend_api = iplinkurl + "1920/sledstudioengine/api/slearn/";
var skiilreport_backend_api = iplinkurl + "8788/sledstudioreports/api/";
var mainslquizurl = baselinkforfiles + "slquiz";
var slquizurl = iplinkurl + "8586/sledstudio/api/slquiz";
var liveexamurl = iplinkurl + "8888/sledstudio/api/";
var server_current_time = backend_api_base + "slcore/util/timestamp";
var readJsonPath = baselinkforfiles + "sledstudio/";

//this below api is use CLOUD_REPORTING run on online (un-commit below API and above same variable code commit)
// var backend_api_base = "http://35.154.61.92/clouddashboard/sledstudioengine/api/";
// var slearn_backend_api = "http://35.154.61.92/clouddashboard/sledstudioengine/api/slearn/";
// var skiilreport_backend_api = "http://35.154.61.92/sledstudioreports/api/";
// var readJsonPath = "http://35.154.61.92/unmf/sledstudio/dashboard/";

var sledstudio_menu = readJsonPath + "config/sledstudio.json";
var general_config = readJsonPath + "config/general_config.json";
var school_config = readJsonPath + "config/school.json";
var slearn_config = readJsonPath + "config/slearn.json";
var slate_config = readJsonPath + "config/slate.json";
var dictionary = readJsonPath + "meta/general/dictionary.json";
var eng_remedial = readJsonPath + "config/";
var slearn_activities_metadata = readJsonPath + "meta/slearn/activity_meta_details/";
var schoolgroup_config = readJsonPath + "config/schoolgroup.json";
var slateTextBookChapter_config = readJsonPath + "meta/slate/text_book_chapter.json";
var skill_config = readJsonPath + "meta/slearn/skill.json";

var slatebaseurl = window.location.href;
slatebaseurl = slatebaseurl.split("/");
slatebaseurl = slatebaseurl[0] + "//" + slatebaseurl[2];
slatebaseurl = slatebaseurl.slice(0, slatebaseurl.length - 4);
slatebaseurl = slatebaseurl + "9999/slate/app/html/index.html";
slateContentPath = 'http://' + window.location.hostname + ':' + window.location.port + '/gj/all/std'

var slearnbaseurl = window.location.href;
slearnbaseurl = slearnbaseurl.split("/");
slearnbaseurl = slearnbaseurl[0] + "//" + slearnbaseurl[2];
slearnbaseurl = slearnbaseurl.slice(0, slearnbaseurl.length - 4);
slearnbaseurl = slearnbaseurl + "9999/slearn/";

//this use to get subject wise skill id list
var parse_sub_skill = {
    "subskill": {
        "1": [16, 18, 17, 15, 19, 20, 21],
        "2": [8, 9, 11, 10, 12, 13, 14],
        "3": [22, 23, 28, 26, 24, 25, 27, 31, 30, 29, 33, 34, 35, 32, 37, 42, 41, 36, 39, 40, 38, 44, 43, 49, 47, 46, 48, 45],
        "4": [1, 2, 4, 3, 5, 6, 7],
        "6": [50, 55, 53, 51, 54, 52, 56]
    }
};

var checkAdminFilepushArray = false;

var x, countDownDate, Base64, showornot = "";
var numberofcss = 0;
var numberofjs = 0;
var promiseOfOnlyOneTab = null;
var promiseOfSessionChecking = null;
var promiseSessionExpiryDialog = null;
var promiseOfSubjectChecking = null;
var showWarningMsgPopupRelogin = null;

// Css dependencies from here
var listofcssdependencies = [
    baselinkforfiles + "lib/bootstrap/css/bootstrap.min.css",
    baselinkforfiles + "lib/datatable/dataTables.bootstrap.min.css",
    baselinkforfiles + "lib/datatable/buttons.bootstrap.min.css",
    baselinkforfiles + "lib/datatable/responsive.dataTables.min.css",
    baselinkforfiles + "lib/jquery-ui.css",
    baselinkforfiles + "css/style.css",
    baselinkforfiles + "css/login.css",
    baselinkforfiles + "lib/video/video-js.css"
];

var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; // indexOf("android") or indexOf("windows")
if (isAndroid) {
    listofcssdependencies.push(baselinkforfiles + "css/android.css");
}

var listofslearncssdependencies = [
    baselinkforfiles + "apps/slearn/css/style.css",
    baselinkforfiles + "apps/slearn/css/csshake.min.css"
];

var listofreportcssdependencies = [
    baselinkforfiles + "apps/reporting/css/style.css",
];

// Js dependencies from here
var listofjsdependencies = [
    baselinkforfiles + "lib/jquery-ui.js",
    baselinkforfiles + "lib/bootstrap/js/bootstrap.min.js",
    baselinkforfiles + "lib/postmessage.js",
    baselinkforfiles + "lib/video/video.js",
    baselinkforfiles + "lib/angular/angular.min.js",
    baselinkforfiles + "lib/angular/angular-route.js",
    baselinkforfiles + "lib/angular/angular-animate.js",
    baselinkforfiles + "lib/angular/angular-touch.js",
    baselinkforfiles + "lib/ui-bootstrap-tpls-2.3.1.min.js",
    baselinkforfiles + "lib/chartjs/Chart.min.js",
    baselinkforfiles + "lib/chartjs/Chart.bundle.min.js",
    baselinkforfiles + "lib/angular/angular-chart.min.js",
    baselinkforfiles + "lib/datatable/angular-ui-utils.min.js",
    baselinkforfiles + "lib/datatable/jquery.dataTables.min.js",
    baselinkforfiles + "lib/datatable/dataTables.bootstrap.min.js",
    baselinkforfiles + "lib/datatable/dataTables.buttons.min.js",
    baselinkforfiles + "lib/datatable/buttons.bootstrap.min.js",
    baselinkforfiles + "lib/datatable/jszip.min.js",
    baselinkforfiles + "lib/datatable/buttons.html5.min.js",
    baselinkforfiles + "lib/datatable/buttons.print.min.js",
    baselinkforfiles + "lib/datatable/buttons.colVis.min.js",
    baselinkforfiles + "lib/datatable/dataTables.responsive.min.js",
    baselinkforfiles + "js/common.js",
    baselinkforfiles + "js/ajaxcalls.js",
    baselinkforfiles + "js/factory.js",
    baselinkforfiles + "js/directives.js",
    baselinkforfiles + "js/login/login-controller.js",
    baselinkforfiles + "js/login/login-router.js",
    baselinkforfiles + "js/home/home-controller.js",
    baselinkforfiles + "js/navbar/navbar-controller.js",
    baselinkforfiles + "js/navbar/navbar-router.js"
];

var slearndependencies = [
    // baselinkforfiles + "apps/slearn/js/slearn-controller.js",
    // baselinkforfiles + "apps/slearn/js/slearn-router.js",
    // baselinkforfiles + "apps/slearn/js/conceptroom-controller.js",
    // baselinkforfiles + "apps/slearn/js/slearnsubject-controller.js",
    // baselinkforfiles + "apps/slearn/js/conceptlist-controller.js",
    // baselinkforfiles + "apps/slearn/js/activitylist-controller.js",
    // baselinkforfiles + "apps/slearn/js/activity-controller.js",
    // baselinkforfiles + "apps/slearn/js/slearnfactory.js",
    // baselinkforfiles + "apps/slearn/js/listeningcorner-controller.js"
];

var slatedependencies = [];

var slquizdependencies = [
    // baselinkforfiles + "apps/slquiz/js/slquiz-controller.js",
    // baselinkforfiles + "apps/slquiz/js/slquiz-router.js",
    // baselinkforfiles + "apps/slquiz/js/startslquiz-controller.js",
    // baselinkforfiles + "apps/slquiz/js/takeslquiz-controller.js",
    // baselinkforfiles + "apps/slquiz/js/slquizquestionpaper-controller.js",
    // baselinkforfiles + "apps/slquiz/js/monitoringslquiz-controller.js",
    // baselinkforfiles + "apps/administration/js/administration-controller.js"
];

var reportingdependencies = [
    baselinkforfiles + "apps/reporting/js/schoolreport-router.js",
    baselinkforfiles + "apps/reporting/js/schoolreporting-controller.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/student-sLate-controller.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate1.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate2.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate3.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate4.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate5.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate6.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate7.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate8.js",
    baselinkforfiles + "apps/reporting/js/student/slate-usage/slate9.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearnusage-controller.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn1.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn2.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn3.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn4.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn5.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn6.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn7.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn8.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn9.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-usage/slearn10.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-academic/slearnacademic-controller.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-academic/academic1.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-academic/academic2.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-academic/academic3.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-academic/academic4.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-academic/academic5.js",
    baselinkforfiles + "apps/reporting/js/student/slearn-academic/academic6.js",
    baselinkforfiles + "apps/reporting/js/student/skillwise-usage/skillwiseusage-controller.js",
    baselinkforfiles + "apps/reporting/js/student/skillwise-usage/skill1.js",
    baselinkforfiles + "apps/reporting/js/student/skillwise-usage/skill2.js",
    baselinkforfiles + "apps/reporting/js/student/skillwise-usage/skill3.js",
    baselinkforfiles + "apps/reporting/js/student/skillwise-usage/skill4.js",
    baselinkforfiles + "apps/reporting/js/student-report/studentreport-controller.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/teacher-sLtae-controller.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates1.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates2.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates3.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates4.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates5.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates6.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates7.js",
    baselinkforfiles + "apps/reporting/js/teacher/slate-usage/slates8.js",
// baselinkforfiles + "apps/reporting/js/teacher/report-usage/reportusage-controller.js",
// baselinkforfiles + "apps/reporting/js/teacher/report-usage/report1.js",
    baselinkforfiles + "apps/reporting/js/slquizyear-report/slquizyear-controller.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/aggregation-router.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/Isolated-report/yeardashboard-controller.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLearn-report/sLearnAggregation-controller.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLearn-report/sLearn-analysis1.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLearn-report/sLearn-analysis2.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLearn-report/sLearn-analysis3.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLate-report/sLate-controller.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLate-report/sLate-analysis1.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLate-report/sLate-analysis2.js",
    baselinkforfiles + "apps/reporting/js/aggregation-report/sLate-report/sLate-analysis3.js",
    baselinkforfiles + "apps/reporting/js/dashboard/dashboard-controller.js"
];

var usermanualdependencies = [
    // baselinkforfiles + "apps/user_manual/js/user_manual-controller.js"
];

var reviewdependencies = [
    // baselinkforfiles + "apps/slearn/js/reviewer-controller.js"
];

var monitordependencies = [];

var administrationdependencies = [
    // baselinkforfiles + "apps/administration/js/administration-controller.js"
];

var slquizadministrationdependencies = [];

$(document).ready(function () {
    checkWhatAllProductsNeedsToBeAdded();
});

function checkWhatAllProductsNeedsToBeAdded() {
    $.ajax({
        url: sledstudio_menu,
        type: 'get',
        dataType: 'json',
        error: function (data) {
            alert("Error Loading JSON");
        },
        success: function (data) {
            $.ajax({
                url: school_config,
                type: 'get',
                dataType: 'json',
                error: function (data1) {
                    alert("Error Loading JSON");
                },
                success: function (data1) {
                    var productmode = data.product_mode;
                    var servertype = data1.server_detail.server_type;
                    var temp;
                    // this below switch and for loop use to embeds js file in load school and cloud report wise porduct
                    switch (productmode) {
                        case "SCHOOL":
                            if (servertype === "SERVER") {
                                temp = data.product_acces_control_basis_product_mode.SCHOOL.SERVER;
                            } else if (servertype === "SMART_CLASS") {
                                temp = data.product_acces_control_basis_product_mode.SCHOOL.SMART_CLASS;
                            }
                            break;

                        case "CLOUD_REPORTING":
                            temp = data.product_acces_control_basis_product_mode.CLOUD_REPORTING.default
                            break;
                    }

                    for (i = 0; i <= temp.length; i++) {
                        if (temp[i] == 3) {
                            checkAdminFilepushArray = true;
                        }
                        switch (temp[i]) {
                            case "1":
                                listofjsdependencies = listofjsdependencies.concat(slearndependencies);
                                listofcssdependencies = listofcssdependencies.concat(listofslearncssdependencies);
                                break;
                            case "2":
                                listofjsdependencies = listofjsdependencies.concat(slatedependencies);
                                break;
                            case "3":
                                listofjsdependencies = listofjsdependencies.concat(slquizdependencies);
                                break;
                            case "4":
                                listofjsdependencies = listofjsdependencies.concat(reportingdependencies);
                                listofcssdependencies = listofcssdependencies.concat(listofreportcssdependencies);
                                break;
                            case "5":
                                listofjsdependencies = listofjsdependencies.concat(usermanualdependencies);
                                break;
                            case "6":
                                listofjsdependencies = listofjsdependencies.concat(reviewdependencies);
                                break;
                            case "7":
                                listofjsdependencies = listofjsdependencies.concat(monitordependencies);
                                break;
                            case "8":
                                if (checkAdminFilepushArray == false) {
                                    listofjsdependencies = listofjsdependencies.concat(administrationdependencies);
                                }
                                break;
                            case "9":
                                listofjsdependencies = listofjsdependencies.concat(slquizadministrationdependencies);
                                break;
                            default:
                                loadAllCssDependencies();
                                loadAllJsDependeincies();

                        }
                    }
                }
            });
        }
    });
}

function loadAllCssDependencies() {
    if (numberofcss < listofcssdependencies.length) {
        $('head').append('<link rel="stylesheet" href="' + listofcssdependencies[numberofcss] + '" type="text/css" />');
        numberofcss++;
        loadAllCssDependencies();
    } else {
        console.log("All css dependencies loaded !!");
    }
}

function loadAllJsDependeincies() {
    if (numberofjs < listofjsdependencies.length) {
        $.getScript(listofjsdependencies[numberofjs])
            .done(function (script, textStatus) {
                numberofjs++;
                loadAllJsDependeincies();
            })
            .fail(function (jqxhr, settings, exception) {
                console.log(jqxhr);
                console.log(settings);
                console.log(exception);
            });

    } else {
        $('#loader').hide();
        console.log("All js dependencies loaded !!");
        angular.bootstrap(document, ['sledstudio']);
    }
}
