EYApp.controller('loginPageCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'loginService', 'StorageService', function($scope, $rootScope, $state, ngDialog, loginService, StorageService)
{
    $scope.passwordRequired = false;
    $scope.buttonName = "LOGIN";
    var userData = {};
    $scope.login = function(action)
    {
        $scope.apiError = false;
        if(action == "LOGIN")
        {
            var data = { email:$scope.email };
        }
        else
        {
            var data = 
            {
                "password" : $scope.password,
                "userId" : userData.userId,
                "isadmin" : $scope.passwordRequired,
            };
        }
        $rootScope.enableLoader();
        var p = loginService.login(data);
        p.then(function(response)
		{
            $rootScope.disableLoader();
            if(response.data.status.code=="200")
            {
                if(action == "LOGIN")
                {
                    userData = {
                        userId : response.data.userId,
                        isadmin : response.data.isadmin,
                        email : $scope.email
                    };
                    StorageService.setData("user", userData);
                    checkPassword(response.data);
                }
                else
                {
                    if($scope.passwordRequired == true)
                    {
                        $state.go('home.subscriberMgmt');     
                    }
                    else
                    {
                        $state.go('home.chatbot');
                    }
                }
            }
            else if(response.data.status.code=="400")
            {
                $scope.apiError = true;
            }			
		},
		function(error)
		{
			$rootScope.disableLoader();
			ngDialog.open({
				showClose : true,
				template: 'views/PopUps/error.html',
				closeByDocument : false,
				controller : ['$scope', 'ngDialog', function ($scope, ngDialog) {
						$scope.message = "Error occurred while logging in! Please try later.";
					}]
			});
		});
    }
    
    function checkPassword(loginData)
    {
            if(loginData.isadmin == true)
            {
                $scope.passwordRequired = true;
                $scope.buttonName = "PROCEED";
            }
            else
            {
                $state.go('home.chatbot');
            }
    }
}]);