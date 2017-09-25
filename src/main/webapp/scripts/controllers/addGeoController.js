EYApp.controller('addGeoCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'geoService', function($scope, $rootScope, $state, ngDialog, geoService)
{
        $rootScope.enableLoader();	
		var p = geoService.getAllCountries();
		p.then(function(response)
		{
			$scope.allCountries = response.data.countries;
			$rootScope.disableLoader();
		},
		function(error)
		{
			$rootScope.disableLoader();
		});    
        https://beta-testing-new-dot-poc-iot.appspot.com/fetchList?token=country
    
    
	$scope.getStatesForSelectedCountry = function()
	{
		$rootScope.enableLoader();	
		var p = geoService.getAllStatesForCountry($scope.geoCountry);
		p.then(function(response)
		{
			$scope.allStates = response.data.states;
			$rootScope.disableLoader();
		},
		function(error)
		{
			$rootScope.disableLoader();
		});
	}
	
	$scope.saveLawDescription = function()
	{
		$rootScope.enableLoader();
		var lawDescData =
		{
			'topicId' : $scope.selTopic.topic_id,
			'subTopicId' : $scope.selTopic.sub_topic_id,
			'countryId' : $scope.geoCountry,
			'stateId' : $scope.geoState,
			'description' : $scope.description
		}
		var p = geoService.addLawDescription(lawDescData);
		p.then(function(response)
		{
			$rootScope.disableLoader();
			$state.reload();
			ngDialog.close();
		},
		function(error)
		{
			$scope.closeThisDialog();
			$rootScope.disableLoader();
			ngDialog.open({
				showClose : true,
				template: 'views/PopUps/error.html',
				closeByDocument : false,
				controller : ['$scope', 'ngDialog', function ($scope, ngDialog) {
						$scope.message = "Error occurred while adding geo!";
					}]
			});
		});
	}
	
	$scope.cancel = function()
	{
		ngDialog.close();
	}
}]);