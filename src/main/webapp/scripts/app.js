var env = {};

// Import variables if present (from env.js)
if(window){
    Object.assign(env, window.__env);
}


var EYApp = angular.module('EYApp', ['ui.router','ngSanitize','ui.bootstrap','LocalStorageModule', 'toaster', 'ngIdle','ngDialog']);

EYApp.run(['$rootScope', '$location', '$http', '$state', '$window', 'toaster', function($rootScope, $location, $http, $state, $window, toaster){

	$rootScope.showLoader = false;
	
	$rootScope.enableLoader = function()
	{
		$rootScope.showLoader = true;
	}
	
	$rootScope.disableLoader = function()
	{
		$rootScope.showLoader = false;
	}

}]);

EYApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider','$httpProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider){
    	
    $stateProvider
    
        .state('login', {
			url: '/login',
			templateUrl: 'views/login.html',
			controller : 'loginPageCtrl'
        })
    
		.state('home', {
            abstract:true,
			url: '/home',
			templateUrl: 'views/homePage.html',
			controller : 'homePageCtrl'
        })
		
		.state('home.subscriberMgmt', {
		url: '/subscriberMgmt',
		templateUrl: 'views/subscriberMgmt.html',
		controller: 'subscriberMgmtCtrl'
		})	
		
		.state('home.complianceMgmt', {
		url: '/complianceMgmt',
		templateUrl: 'views/complianceMgmt.html',
		controller: 'complianceMgmtCtrl'
		})
		
		.state('home.manageGeo', {
		url: '/manageGeo',
		templateUrl: 'views/manageGeo.html',
		controller: 'manageGeoCtrl'
		})
		
		.state('home.manageQuestions', {
		url: '/manageQuestions',
		templateUrl: 'views/manageQuestions.html',
		controller: 'manageQuestionsCtrl'
		})
		
		.state('home.report', {
		url: '/reports',
		templateUrl: 'views/reports.html',
		controller: 'reportCtrl'
		})
		
		.state('home.chatbot', {
		url: '/chatbot',
		templateUrl: 'views/chatbot.html',
		controller: 'chatbotCtrl'
		})
		
		$urlRouterProvider.otherwise('/login');
}]);

EYApp.constant('__env', env);