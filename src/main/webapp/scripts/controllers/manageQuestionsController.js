EYApp.controller('manageQuestionsCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'questionService', 'StorageService', function($scope, $rootScope, $state, ngDialog, questionService, StorageService)
{
	$scope.userQuestions = [];
	$scope.systemQuestions = [];
	var questionData = [];
	var topic= StorageService.getData("topic");
    if(topic)
    {
        $scope.topic = topic.topic_name;
        $scope.subtopic = topic.sub_topic_name;
    }
    else
    {
        $state.go("home.complienceMgmt");
    }
		
	getQuestions();
	
	function getQuestions()
	{
		$rootScope.enableLoader();	
		var p = questionService.getQuestions(topic);
		p.then(function(response)
		{
			questionData = response.data.data;
			sortQuestions(questionData);
			$rootScope.disableLoader();
		},
		function(error)
		{
			$rootScope.disableLoader();
		});
	}
	
	
	function sortQuestions(questionData)
	{
		$scope.userQuestions = [];
		$scope.systemQuestions = [];
		for(var i=0; i<questionData.length;i++)
		{
			if(questionData[i].question_type == 'USER')
			{
				$scope.userQuestions.push(questionData[i]);
			}
			else
			{
				$scope.systemQuestions.push(questionData[i]);
			}
		}
	}
	
	$scope.deleteQuestion = function(question,questionType)
	{		
		ngDialog.openConfirm({
                    template:					
					'<div class="modal-header popUpHeader">Confirm ?</div>' +
					'<div class="modal-body">' +
						'<p>Are you sure you want to delete this question?</p>' +	
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
					confirmDelete(question,questionType);
                },
				function () 
				{					
					console.log("no");
                });
	}
	
	function confirmDelete(question,questionType)
	{
		$rootScope.enableLoader();
		var p = questionService.deleteQuestion(question.question_id);
		p.then(function(response)
		{
			if(questionType == 'user')
			{
				for(var j=0;j<$scope.userQuestions.length;j++)
				{
					if($scope.userQuestions[j].question_id == question.question_id)
					{
						$scope.userQuestions.splice(j,1);
						break;
					}					
				}
			}
			else
			{
				for(var j=0;j<$scope.systemQuestions.length;j++)
				{
					if($scope.systemQuestions[j].question_id == question.question_id)
					{
						$scope.systemQuestions.splice(j,1);
						break;
					}					
				}
			}
			$rootScope.disableLoader();
		},
		function(error)
		{
			$rootScope.disableLoader();
		});
	}
	
	$scope.addQuestion = function()
	{
		ngDialog.open({
			template: 'addQuestionPopup',
			className: 'ngdialog-theme-default',
			scope : $scope,
			closeByDocument : false,
			controller: ['$scope', function($scope) 
			{
				$scope.disableSave = true;
				
				$scope.enableSave = function()
				{
					if($scope.question == '')
					{
						$scope.disableSave = true;
					}
					else
					{
						$scope.disableSave = false;
					}
				}
				
				$scope.save = function()
				{
					$rootScope.enableLoader();
					var newQuestion = 
					{
						'topic' : $scope.topic,
						'subTopic' : $scope.subtopic, 
						'userId' : 1, 
						'question' : $scope.question
					}
					var p = questionService.addQuestion(newQuestion);
					p.then(function(response)
					{
						$rootScope.disableLoader();
						getQuestions();
						$scope.closeThisDialog();
					},
					function(error)
					{
						$rootScope.disableLoader();
					});
				}
			}]
		});
          
	}
	
	$scope.modifyQuestion = function(questionToModify)
	{		
		ngDialog.open({ 
			template: 'modifyQuestionPopup',
			className: 'ngdialog-theme-default',
			scope : $scope,
			closeByDocument : false,
			controller: ['$scope', function($scope) 
			{
				$scope.modifiedQuestion = questionToModify.question;
				$scope.disableSave = true;
				
				$scope.enableSave = function()
				{
					if($scope.modifiedQuestion == '')
					{
						$scope.disableSave = true;
					}
					else
					{
						$scope.disableSave = false;
					}
				}
				
				$scope.save = function()
				{
					$rootScope.enableLoader();
					var modifiedQuestion = 
					{
						'question_id' : questionToModify.question_id,
						'question' : $scope.modifiedQuestion
					}
					var p = questionService.modifyQuestion(modifiedQuestion);
					p.then(function(response)
					{
						console.log('response',response);
						for(var i=0; i<$scope.userQuestions.length; i++)
						{
							if($scope.userQuestions[i].question_id == questionToModify.question_id)
							{
								$scope.userQuestions[i].question = $scope.modifiedQuestion;
								break;
							}
						}
						$rootScope.disableLoader();
						$scope.closeThisDialog();
					},
					function(error)
					{
						$rootScope.disableLoader();
					});
				}
			}]
		});		
	}
	
}]);