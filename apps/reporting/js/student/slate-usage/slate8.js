angular.module('sledstudio')
    .controller('Slate8ReportController', function ($scope, ajaxCallsFactory, FromdateTodateFactory, dashboardServices, dataModalServices, tableOptionService) {
        $scope.tableOption8 = tableOptionService.options();

        $scope.loadStandard8 = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (resStandard) {
                    $scope.standarddata8 = [];
                    for (var key in resStandard.data.standard_division_map) {
                        $scope.standarddata8.push(key);
                    }
                }, function (error) {
                    console.log("can not get stndard data school json file")
                });
        }
        $scope.loadStandard8();

        $scope.getDivisionData8 = function () {
            ajaxCallsFactory.getCall(school_config)
                .then(function (response) {
                    var divId = response.data.standard_division_map[$scope.standard_data8];

                    ajaxCallsFactory.getCall(dictionary)
                        .then(function (response1) {
                            $scope.divisiondata8 = [];

                            for (var k in divId)
                                $scope.divisiondata8.push({
                                    divid: divId[k],
                                    divname: response1.data.division[divId[k]].name
                                })
                        }, function (error) {
                            console.log("can not get Dicttonary data school json file")
                        });
                }, function (error) {
                    console.log("can not get slearn_config data")
                });
        }

        $scope.loadslearn8report = function () {
            dataModalServices.openMoldal();
            var school_id = sessionStorage.getItem("schoolid");
            var standard_id = $scope.standard_data8;
            var division_id = $scope.division_data8;
            var product_id = 2;
            $scope.errorMsg = "No data avaliable";

            $scope.showslearn8table = false;
            $scope.showerrromsg8 = false;
            $scope.inActivestddata8 = [];

            var objdata = JSON.stringify({
                school_id: school_id,
                product_id: product_id,
                standard_id: standard_id,
                division_id: division_id
            });
            $.ajax({
                type: "POST",
                url: skiilreport_backend_api + 'teacher/inactivestudents',
                data: objdata,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                crossDomain: true,
                success: function (response) {
                    var student_data = response.data;

                    var dataJson = JSON.stringify({
                        "school_id": school_id,
                        "standard_id": standard_id,
                        "division_id": division_id
                    });
                    var urlPath1 = dashboardServices.getStudentDetails(dataJson);
                    ajaxCallsFactory.getCall(urlPath1)
                        .then(function (response1) {
                            var studentDetails = response1.data.data;

                            angular.forEach(student_data, function (value, key) {
                                this.push({
                                    studentid: student_data[key].user_id,
                                    rollno: student_data[key].roll_number,
                                    fullname: studentDetails[key].user_detail.first_name + " " + studentDetails[key].user_detail.last_name
                                })
                            }, $scope.inActivestddata8);

                            if ($scope.inActivestddata8.length == 0) {
                                $scope.showslearn8table = false;
                                $scope.showerrromsg8 = true;
                            } else {
                                $scope.showslearn8table = true;
                                $scope.showerrromsg8 = false;
                            }
                            dataModalServices.closeModal();
                        });

                }
            });
        }

    });
