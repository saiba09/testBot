EYApp.controller('modifyLawDescriptionCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'geoService', function($scope, $rootScope, $state, ngDialog, geoService)
{
	$scope.lawDesc = $scope.lawDescription.law_description;
	$scope.country = $scope.selectedCountry.country_id;
	$scope.state = $scope.selectedState.state_id;
	
	$scope.close = function()
	{
		ngDialog.close();
	}
}]);