angular.module('sledstudio')
    .factory('slearnErrorFactory', ['$uibModal', function ($uibModal, $scope, $window) {
        var dataFactory = {};

        dataFactory.subjectWeeklyUsageErrorModal = function (errorstatement) {
            $uibModal.open({
                templateUrl: baselinkforfiles + 'apps/slearn/html/error/subject_usage_error.html',
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                controller: function ($uibModalInstance, $scope, $window) {
                    $scope.errstatement = errorstatement;
                    $scope.closeCustomModalAndSendToSubjectPage = function () {
                        window.location.href = "#/slearn_subject";
                        $uibModalInstance.close();
                    };
                }
            });
        };
        return dataFactory;
    }]);