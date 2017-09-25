EYApp.controller('complianceMgmtCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'topicService', 'StorageService',  function($scope, $rootScope, $state, ngDialog, topicService, StorageService)
{
	//$scope.topicData = [];
	$rootScope.enableLoader();
	var p = topicService.getTopics();
	p.then(function(response)
	{
		$rootScope.disableLoader();
		$scope.topicData = response.data.data;
	},
	function(error)
	{
		$rootScope.disableLoader();
		$scope.topicData = [];
	});
	
	$scope.addTopic = function(size,parentSelector)
	{
		ngDialog.open
		({ 
			template: 'views/PopUps/addTopic.html', 
			controller : 'addTopicCtrl',
			closeByDocument: false,
			className: 'ngdialog-theme-default' 
		 });
	}
	
	//display modify topic popup
	
	$scope.modifyTopic = function(topic)
	{
		ngDialog.open
		({ 
			template: 'views/PopUps/modifyTopic.html', 
			closeByDocument: false,
			scope : $scope,
			className: 'ngdialog-theme-default',
			controller : ['$scope', 'topicService', function($scope, topicService) 
			{
				$scope.modifiedTopic = topic.topic_name;
				$scope.modifiedSubtopic = topic.sub_topic_name;
				$scope.saveModifiedTopic = function()
				{
					var data =
					{
					'topicId' : topic.topic_id,
					'topic' : $scope.modifiedTopic,
					'subTopicId' : topic.sub_topic_id,
					'subTopic' : $scope.modifiedSubtopic
					};
					$rootScope.enableLoader();
					var p = topicService.modifyTopic(data);
					p.then(function(response)
					{
						//$state.reload();
						for(var i=0 ; i<$scope.topicData.length; i++)
						{
							if($scope.topicData[i].topic_id == topic.topic_id && $scope.topicData[i].sub_topic_id == topic.sub_topic_id)
							{
								$scope.topicData[i].topic_name = $scope.modifiedTopic;
								$scope.topicData[i].sub_topic_name = $scope.modifiedSubtopic;
								break;
							}
						}
						$rootScope.disableLoader();
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
                                    $scope.message = "Error occurred while modifying topic!";
                                }]
                        });
					});
					
				}
			}]
		 });
	}
	
	// Redirect to manage geo and question states
	$scope.manageGeo = function(topic)
	{
        StorageService.setData("topic", topic);
		$state.go('home.manageGeo');
	}
	
	$scope.manageQuestions = function(topic)
	{
        StorageService.setData("topic", topic);
		$state.go('home.manageQuestions');
	}
	
}]);