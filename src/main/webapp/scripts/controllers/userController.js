EYApp.controller('userCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'subscribersService', function($scope, $rootScope, $state, ngDialog, subscribersService)
{
	$scope.statusList = ['ACTIVE', 'INACTIVE'];
    $scope.emailError = false;
    
	if($scope.selectedAction == 'modify')
	{
		$scope.username = $scope.selectedUser.Username;
		$scope.email = $scope.selectedUser.Email;
		if($scope.selectedUser.IsAdmin == "true")
		{
			$scope.selectedrole = 'Admin';
			$scope.role = 'Admin'; 
		}
		else
		{
			$scope.selectedrole = 'User';
			$scope.role = 'User'; 
		}
		$scope.userStatus = $scope.selectedUser.Status;
	}
	
	$scope.cancel = function()
	{
		ngDialog.close();
	}

	
	$scope.save = function()
	{
		if($scope.selectedAction == 'modify')
		{
			modifySubscriber();
		}
		else
		{
			addSubscriber();
		}
	}
    
    
	function addSubscriber()
	{
		var isAdmin;
		if($scope.role == 'Admin')
		{
			isAdmin = 'true';
		}
		else if($scope.role == 'User')
		{
			isAdmin = 'false';
		}
		var subscriber = 
		{
			"username" : $scope.username,
			"email" : $scope.email,
			"isadmin" : isAdmin
		}
		$rootScope.enableLoader();
		var p = subscribersService.addSubscriber(subscriber);
		p.then(function(response)
		{
            if(response.data.status.code == 200)
            {
                    $state.reload();
                    $rootScope.disableLoader();
                    $scope.closeThisDialog();
            }
            else if(response.data.status.code == 201)
            {
                $scope.emailError = true;
                $rootScope.disableLoader();
            }
            
		},
		function(error)
		{
			$rootScope.disableLoader();
			ngDialog.open({
				scope: $scope,
				showClose : true,
				template: 'topicAdded',
				closeByDocument : false,
				controller : ['$scope', 'ngDialog', function ($scope, ngDialog) {
						$scope.ngDialog = ngDialog;
						$scope.message = "Error occurred while adding Subscriber!";
					}]
			});
		});
	}
	
	function modifySubscriber()
	{
		console.log($scope.userStatus);
		var isAdmin;
		if($scope.role == 'Admin')
		{
			isAdmin = 'true';
		}
		else if($scope.role == 'User')
		{
			isAdmin = 'false';
		}
		$rootScope.enableLoader();
		var subscriber = 
		{
			"username" : $scope.username,
			"email" : $scope.email,
			"isadmin" : isAdmin,
            "userId" : $scope.selectedUser.User_ID,
            "status" : $scope.userStatus
		}
		var p = subscribersService.modifySubscriber(subscriber);
		p.then(function(response)
		{
            if(response.data.status.code == 200)
            {
                for(var i=0; i<$scope.subscribers.length; i++)
                {
                    if($scope.subscribers[i].User_ID == $scope.selectedUser.User_ID)
                    {
                        $scope.subscribers[i].Username = $scope.username;
                        $scope.subscribers[i].Email = $scope.email;
                        $scope.subscribers[i].IsAdmin = isAdmin;
                        $scope.subscribers[i].Status = $scope.userStatus;
                        break;
                    }
                }
                $rootScope.disableLoader();
                $scope.closeThisDialog();
            }
            else if(response.data.status.code == 201)
            {
                $scope.emailError = true;
                $rootScope.disableLoader();
            }
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
						$scope.message = "Error occurred while adding user!";
					}]
			});
		});
	}
	
	
	$scope.selectRole = function()
	{
		$scope.role = $scope.selectedrole;
	}
	$scope.changeStatus=function(changeStatus)
	{
		$scope.userStatus = changeStatus;
	}
	
}]);