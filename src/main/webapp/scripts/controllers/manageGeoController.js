EYApp.controller('manageGeoCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'geoService', 'StorageService', function($scope, $rootScope, $state, ngDialog, geoService, StorageService)
{
	$scope.selTopic = StorageService.getData("topic");
    if($scope.selTopic)
    {
       $scope.topic = $scope.selTopic.topic_name;
	   $scope.subtopic = $scope.selTopic.sub_topic_name;
    }
    else
    {
        $state.go("home.complienceMgmt");
    }
	
	$scope.editDescription = false;
    $scope.noDataForTopic = false;
	$scope.selectedCountry = {};
	$scope.selectedState = {};
	getCountries();
	
	//function for fetching countries list from API
	function getCountries()
	{
		$rootScope.enableLoader();
        var data = 
        {
            "token" : 1,
            "topicId" : parseInt($scope.selTopic.topic_id),
            "subTopicId": parseInt($scope.selTopic.sub_topic_id)
        }
		var p = geoService.getGeo(data);
		p.then(function(response)
		{
			$scope.countries = response.data.countries;
            if($scope.countries.length>0)
            {
                $scope.getstates($scope.countries[0]);
            }
            else
            {
                $scope.noDataForTopic = true;
                $rootScope.disableLoader();
            }
		},
		function(error)
		{
			$rootScope.disableLoader();
		});
	}
	
	//function for fetching states list according to selected country from API
	$scope.getstates = function(country)
	{
		$scope.selectedCountry = country;
        var stateData = 
        { 
            'token' : 2,
            'countryId' : country.country_id,
            'topicId' : parseInt($scope.selTopic.topic_id),
            'subTopicId' : parseInt($scope.selTopic.sub_topic_id)
        };
        
		$rootScope.enableLoader();	
		var p = geoService.getGeo(stateData);
		p.then(function(response)
		{
			$scope.states = response.data.states;
            if($scope.states.length>0)
            {
                $scope.getLawDescription($scope.states[0]);
            }
            else
            {
                $scope.noDataForTopic = true;
                $rootScope.disableLoader();
            }
		},
		function(error)
		{
			$rootScope.disableLoader();
		});
	}
	
	//function for fetching law description from API
	$scope.getLawDescription = function(state)
	{
		$scope.lawDescription = {};
		$scope.selectedState = state;
        var data = 
		{
            'token' : 3,
			'topicId' : $scope.selTopic.topic_id,
			'subTopicId' : $scope.selTopic.sub_topic_id,
			'state_id' : state.state_id,
            'countryId' : $scope.selectedCountry.country_id,
            'stateId' : state.state_id
		};
		$rootScope.enableLoader();	
		var p = geoService.getGeo(data);
		p.then(function(response)
		{
			$scope.editDescription = false;
			$scope.lawDescription = response.data;
			$rootScope.disableLoader();
		},
		function(error)
		{
			$rootScope.disableLoader();
		});
	}
	
	//function for displaying add geo pop up
	$scope.addGeo = function()
	{
		ngDialog.open
		({ 
			template: 'views/PopUps/addGeo.html', 
			controller : 'addGeoCtrl',
			scope : $scope,
			closeByDocument: false,
			className: 'ngdialog-theme-default'
		 });
	}
	
	//function for making modifications in law description
	$scope.modifyLawDescOption = function(action)
	{
		$scope.lawDesc = $scope.lawDescription.law_description;
		switch(action) 
		{
			case 'edit':
				$scope.editDescription = true;
				break;
				
			case 'save':
				modifyDescription();
				break;
				
			case 'cancel':
				$scope.editDescription = false;
				break;
				
			/*default:
				code block*/
		}
	}
	
	function modifyDescription()
	{
		var lawData = {
			"law_description_id" : $scope.lawDescription.law_description_id,
			"law_description" : $scope.lawDesc
		}
		$rootScope.enableLoader();	
		var p = geoService.getGeo(lawData);
		p.then(function(response)
		{
			$scope.lawDescription = lawData;
			$scope.editDescription = false;
			$rootScope.disableLoader();
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
						$scope.message = "Error occurred while modifying law description!";
					}]
			});
		});
	}
	
	
}]);