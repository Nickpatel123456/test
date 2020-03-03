angular.module('sledstudio')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.timeout = 2000;
    }])
    .factory('httpRequestInterceptor', function () {
        //this below code is ajax interceptors when call the http method auto send headers in http method
        return {
            request: function (config) {
                config.headers['Content-Type'] = 'application/json';
                config.headers['accept'] = 'application/json';
                config.headers['Authorization'] = (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.session_key)) : '';
                config.headers['User-Info'] = (localStorage.getItem('loginresponse') != null) ? String((JSON.parse(localStorage.getItem('loginresponse')).login_record.user_id)) : '';
                return config;
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    })
    .factory('ajaxCallsFactory', ['$http', function ($http) {
        var dataFactory = {};

        dataFactory.getCall = function (urlBase) {
            return $http.get(urlBase);
        }

        dataFactory.postCall = function (urlBase, inputData) {
            return $http.post(urlBase, inputData);
        }

        return dataFactory;
    }]);