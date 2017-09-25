EYApp.controller('subscriberMgmtCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'subscribersService', function($scope, $rootScope, $state, ngDialog, subscribersService)
{
	$scope.selectedAction = '';
	
	//fetch subscribers list
	
	$rootScope.enableLoader();
	var p = subscribersService.getSubscribers();
	p.then(function(response)
	{
		$rootScope.disableLoader();
		$scope.subscribers = response.data.data;
	},
	function(error)
	{
		$rootScope.disableLoader();
		$scope.subscribers = [];
	});
	
	//delete subscriber
	
	$scope.deleteSubscriber = function(subscriber)
	{
		ngDialog.openConfirm({
                    template:					
					'<div class="modal-header popUpHeader">Confirm ?</div>' +
					'<div class="modal-body">' +
						'<p>Are you sure you want to delete this user?</p>' +	
					'</div>' +
					'<div class="modal-footer 0BodyPadding">' +
						'<button type="button" class="btn popUpButton saveButton" ng-click="confirm()">Yes' +
						'<button type="button" class="btn popUpButton cancelButton" ng-click="closeThisDialog(0)">No&nbsp;' +
					'</div>',
                    plain: true,
                    className: 'ngdialog-theme-default'
					
                })
				.then(function () 
				{
					confirmDelete(subscriber);
                },
				function () 
				{					
					console.log("no");
                });
		
	}
	
	function confirmDelete(subscriber)
	{
		$rootScope.enableLoader();
		var p = subscribersService.deleteSubscriber(subscriber.User_ID);
		p.then(function(response)
		{
			for(var i=0; i<$scope.subscribers.length; i++)
			{
				if($scope.subscribers[i].User_ID == subscriber.User_ID)
				{
					$scope.subscribers.splice(i,1);
					break;
				}	
			}
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
						$scope.message = "Error occurred while deleting subscriber!";
					}]
			});
		});
	}
	
	$scope.modifySubscriber = function(subscriber,action)
	{
		if(action == 'modify')
		{
			$scope.selectedUser = subscriber;
		}
		$scope.selectedAction = action;
		ngDialog.open
		({ 
			template: 'views/PopUps/userForm.html', 
			controller : 'userCtrl',
			closeByDocument: false,
			scope:$scope,
			className: 'ngdialog-theme-default' 
		});		
	}
		
}]);