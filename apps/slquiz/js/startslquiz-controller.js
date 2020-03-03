angular.module('sledstudio')
    .controller('StartslquizController', function ($scope, $http, $rootScope, $interval, metaserviceServices, ajaxCallsFactory, examMusterServices, dialogFactory, errorFactory) {
        var standardId;
        this.init = function () {
            sessionStorage.setItem("menuid", 3);
            $scope.slquizdetailsresponse = [];
            $.ajax({
                type: "GET",
                url: metaserviceServices.getSubject(),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    var subjectNameList = JSON.parse(response);
                    $scope.scienceandtechnology = subjectNameList[1].guj;
                    $scope.maths = subjectNameList[2].guj;
                    $scope.socialscience = subjectNameList[3].guj;
                    $scope.gujarati = subjectNameList[4].guj;
                    $scope.hindi = subjectNameList[5].guj;
                    $scope.english = subjectNameList[6].guj;
                    $scope.sanskrit = subjectNameList[7].guj;
                    $scope.evs_1 = subjectNameList[9].guj;
                    $scope.evs_2 = subjectNameList[10].guj;
                    $scope.evs_3 = subjectNameList[11].guj;
                }
            });

            $.ajax({
                type: "GET",
                url: metaserviceServices.getExam(),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    var examJsonData = JSON.parse(response);
                    $scope.examstdsubdata = examJsonData.standardsubjectdetail;
                }
            });
        };

        this.init();

        //this below code display the standard subject exam list and click on view details button after run this function
        $scope.viewExamDetails = function (standard, subject, examMsg) {
            $scope.loading = false;
            sessionStorage.setItem('startexamSubId', subject);
            $scope.statusMsg = examMsg;
            $("#examdetailmodal").modal('show');
            standardId = standard;
            $scope.standard_details = standard;
            var temp = metaserviceServices.returnSubject();
            $scope.subject_details = temp[Number(subject)].guj;
            $scope.imgurl = baselinkforfiles + "images/source.gif";
            $scope.examStatus = [];
            // $scope.showloading1 = $scope.showloading2 = $scope.showloading3 = false;

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
                    $scope.slquizdetailsresponse = JSON.parse(response).standard_subject_paper_map;
                    var paperid = String($scope.standard_details) + "_" + String(subject);
                    $scope.slquizid = $scope.slquizdetailsresponse[paperid];

                    ajaxCallsFactory.getCall(school_config)
                        .then(function (response1) {
                            var std_div = response1.data.standard_division_map[standard];

                            ajaxCallsFactory.getCall(dictionary)
                                .then(function (response2) {
                                    function divisionwiseStartExam(strat, end) {
                                        if (strat > end - 1) {
                                            $scope.infomsg = false;
                                            $scope.loading = true;
                                            return;
                                        }
                                        var divid = String(std_div[strat]);
                                        var urlpath = examMusterServices.getExamMusterData(JSON.stringify({
                                            questionpaper_id: $scope.slquizid,
                                            division_id: divid
                                        }));
                                        $.ajax({
                                            type: "GET",
                                            url: urlpath,
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            crossDomain: true,
                                            success: function (data) {
                                                $scope.examStatus.push({
                                                    status: data.data,
                                                    divid: divid,
                                                    divname: response2.data.division[divid].name.guj
                                                });
                                                divisionwiseStartExam(strat + 1, end);
                                            },
                                            error: function (xhr, ajaxOptions, thrownError) {
                                                console.log('sLquiz Exam Server Not Started.');
                                                $("#examdetailmodal").modal('hide');
                                                errorFactory.errorModal("sLquiz Exam Server Not Started.");
                                                console.log(xhr);
                                                console.log(ajaxOptions);
                                                console.log(thrownError);
                                            }
                                        });
                                    };
                                    divisionwiseStartExam(0, std_div.length);
                                });
                        });

                    // $scope.divisionresponse = metaserviceServices.returnDivision();
                    /*var divisio1 = JSON.stringify({"questionpaper_id":$scope.slquizid,"division_id":"1"});
                    var urlpath = examMusterServices.getExamMusterData(divisio1);
                    $.ajax({
                        type: "GET",
                        url: urlpath,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success:function(data){
                            $scope.slquizdetails1 = data.data;
                            console.log($scope.slquizdetails1)
                            // $scope.showloading1 = true;
                        }
                    });*/
                    //this code is display the division wise exam
                    /*var divisio1 = JSON.stringify({"questionpaper_id":$scope.slquizid,"division_id":"1"});
                    var urlpath = examMusterServices.getExamMusterData(divisio1);
                    $.ajax({
                        type: "GET",
                        url: urlpath,
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success:function(data){
                            $scope.slquizdetails1 = data.data;
                            $scope.showloading1 = true;
                        }
                    });

                    var divisio2 = JSON.stringify({"questionpaper_id":$scope.slquizid,"division_id":"2"});
                    var urlpath = examMusterServices.getExamMusterData(divisio2);
                    $.ajax({
                        type: "GET",
                        url: urlpath,
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success:function(data){
                            $scope.slquizdetails2 = data.data;
                            $scope.showloading2 = true;
                        }
                    });

                    var divisio3 = JSON.stringify({"questionpaper_id":$scope.slquizid,"division_id":"3"});
                    var urlpath = examMusterServices.getExamMusterData(divisio3);
                    $.ajax({
                        type: "GET",
                        url: urlpath,
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        crossDomain: true,
                        success:function(data){
                            $scope.slquizdetails3 = data.data;
                            $scope.showloading3 = true;
                        }
                    });*/
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Exam Json Not Found!');
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
            });
        }

        //this below code strat the exam click on start button
        $scope.startSlQuiz = function (slquizid, divisionid, divname) {
            $scope.loading = false;
            var info = JSON.stringify({questionpaper_id: slquizid, division_id: divisionid, state: "START"});
            var urlpath = examMusterServices.setExamMusterData();

            $.ajax({
                type: "POST",
                url: urlpath,
                data: info,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    // $("#examdetailmodal").modal('hide');
                    if (data.success == true) {
                        var examstatusmsg = "Standard :- " + standardId + "  Division :- " + divname + " Exam Start Successfully";
                        $scope.viewExamDetails(standardId, sessionStorage.getItem('startexamSubId'), examstatusmsg);
                        // errorFactory.errorModal("Exam Started");
                    } else {
                        $("#examdetailmodal").modal('hide');
                        $scope.loading = true;
                        errorFactory.errorModal("Exam of another subject is all ready running for this class.");
                    }
                }
            });
        }

        $scope.stopSlQuiz = function (slquizid, divisionid, divname) {
            $scope.loading = false;
            var info = JSON.stringify({questionpaper_id: slquizid, division_id: divisionid, state: "STOP"});
            var urlpath = examMusterServices.setExamMusterData();
            $.ajax({
                type: "POST",
                url: urlpath,
                data: info,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    var examstatusmsg = "Standard :- " + standardId + "  Division :- " + divname + " Exam Stop Successfully";
                    $scope.viewExamDetails(standardId, sessionStorage.getItem('startexamSubId'), examstatusmsg);
                    // $("#examdetailmodal").modal('toggle');
                    // errorFactory.errorModal("Exam Stoped");
                }
            });
        }

        $scope.completeSlQuiz = function (slquizid, divisionid) {
            var info = JSON.stringify({questionpaper_id: slquizid, division_id: divisionid, state: "FINISH"});
            var urlpath = examMusterServices.setExamMusterData();

            $.ajax({
                type: "POST",
                url: urlpath,
                data: info,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (data) {
                    $("#examdetailmodal").modal('toggle');
                    errorFactory.errorModal("Exam Completed");
                }
            });
        }

    });
