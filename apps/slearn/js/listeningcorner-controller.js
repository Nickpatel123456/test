angular.module('sledstudio')
    .controller('ListeningCornerController', function (errorFactory, basicFactory, subjectLoggingFactory, slearnErrorFactory, ajaxCallsFactory, $scope) {
        $scope.backBtnName = JSON.parse(sessionStorage.getItem("uiTextConfig")).backBtnName;
        $scope.baseImagePath = baselinkforfiles;
        $scope.showRemedial = '';
        $scope.slateRemedial = '';
        $scope.levelData = '';
        $scope.selectActivity;
        $scope.setSem = 0;
        $scope.showVideoPlayer = false;
        $scope.slateVideoList = [];
        $scope.remedial_video_url = '';
        $scope.selectVideo = -1;
        $scope.imgurl = baselinkforfiles + 'images/video.png';

        $scope.listeningValue = [
            {id: 3, name: 'Level 3'},
            {id: 4, name: 'Level 4'},
            {id: 5, name: 'Level 5'},
            {id: 6, name: 'Level 6'},
            {id: 7, name: 'Level 7'},
            {id: 8, name: 'Level 8'}
        ];

        $scope.back = function () {
            window.location.href = '#/slearn';
        }

        $scope.loadActivityRemedial = function (floordata, indexNo) {
            $scope.levelData = floordata;
            if (floordata.id <= 4) {
                $scope.showRemedial = true;
                $scope.slateRemedial = false;
                $scope.showVideoPlayer = false;
                $scope.selectActivity = '';
                ajaxCallsFactory.getCall(eng_remedial + 'eng_remedial_' + floordata.id + '.json')
                    .then(function (response) {
                        $scope.actvityList = response.data.data;
                    }, function (error) {
                        $scope.showRemedial = false;
                    });
            } else {
                $scope.showRemedial = '';
                $scope.slateRemedial = true;
                $scope.getLevelNo = floordata.id;
                $scope.slateChapName = [];
                $scope.setSem = 0;
            }
        }

        $scope.playRemedialVideo = function (activitydata, indexNO) {
            $scope.selectActivity = indexNO;
            $scope.showVideoPlayer = true;
            $scope.remedial_video_url = slearnbaseurl + 'remedial/eng/' + activitydata.l2_remedial_id + '.mp4';
        }

        $scope.setSemester = function (semNo) {
            $scope.slateVideoList = [];
            $scope.setSem = Number(semNo);
            $scope.selectActivity = '';
            $scope.slateChapName = [];
            $scope.slateVideoList = [];
            $.ajax({
                type: "GET",
                url: slateContentPath + '' + $scope.levelData.id + '/sem' + $scope.setSem + '/eng/cont/common/chaplist.xml',
                dataType: 'xml',
                crossDomain: true,
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                success: function (xml) {
                    $(xml).find('unit').each(function () {
                        if ($(this).find("UnitId").text() !== 'DNC') {
                            $scope.slateChapName.push({
                                id: $(this).find("UnitId").text(),
                                name: $(this).find("title").text(),
                            });
                        }
                    });
                }
            });
        }

        $scope.getSlateVideoList = function (chap, indexNo) {
            $scope.selectVideo = 0;
            $scope.selectActivity = indexNo;
            $scope.slateVideoList = [];
            $scope.chapNo = chap;
            $.ajax({
                type: "GET",
                url: slateContentPath + '' + $scope.levelData.id + '/sem' + $scope.setSem + '/eng/cont/chap' + chap.id + '/chap' + chap.id + '.xml',
                dataType: 'xml',
                crossDomain: true,
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                success: function (xml) {
                    var count = 0;
                    $(xml).find('actions').each(function () {
                        if ($(this).attr('type') === 'video') {
                            count++;
                            $scope.slateVideoList.push({
                                name: 'video ' + count,
                                path: $(this).text()
                            })
                        }
                    });
                }
            });
        }

        $scope.playSlateVideo = function (video, indexNo) {
            $scope.selectVideo = indexNo + 1;
            $('#vidoModal').modal('show');
            $scope.videoStop = true;
            $scope.slate_video_url = slateContentPath + '' + $scope.levelData.id + '/sem' + $scope.setSem + '/eng/mat/' + video.path;
        }

        $scope.stopVideo = function () {
            $scope.videoStop = false;
            $('#vidoModal').modal('hide');
        }
    })
    .filter("trustUrl", function ($sce) {
        return function (Url) {
            return $sce.trustAsResourceUrl(Url);
        };
    });
