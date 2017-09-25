EYApp.controller('addTopicCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'topicService', function($scope, $rootScope, $state, ngDialog, topicService){
	
	$scope.close = function()
	{
		ngDialog.close();
	}
	
	$scope.save = function()
	{
		$rootScope.enableLoader();
		var topicData = 
		{
			topic : $scope.topic,
			subTopic : $scope.subtopic
		};
		var p = topicService.createTopic(topicData);
		$rootScope.enableLoader();
		p.then(function(response)
		{
			$state.reload();
			$scope.closeThisDialog();
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
						$scope.message = "Error occurred while adding topic!";
					}]
			});
		});
	}	
	
}]);