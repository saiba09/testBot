//service for chat APIs

EYApp.service('chatService', ['$http', function ($http) {
    
    return {	
        postChat: function (sessionId, message) {
            var req = {
                url: '/ai?sessionId=' + sessionId + '&message=' + message,
                method: 'POST'
            };
            return $http (req); 
        }
    }
}]);

//service for Topic APIs

EYApp.service('topicService', ['$http', function ($http) {
    return {
        getTopics: function()
		{
			var req = {
				url : '/ListComplianceDetails',
                method: 'GET',
			};
			return $http(req);
		},
		
        createTopic: function(topicData)
        {
            var req = {
                url: '/addTopic',
                method: 'POST',
				data : topicData
            };
            return $http(req);
        },
		
		modifyTopic: function(topicData)
		{
			var req = {
				url: '/ModifyTopic',
                method: 'POST',
				data : topicData
			};
			return $http(req);
		}		
    }
}]);

//service for Question APIs

EYApp.service('questionService', ['$http', function ($http) {
    
    return {
        
        getQuestions: function(topic) {
			var topicData = {
				topic_id : topic.topic_id,
				sub_topic_id : topic.sub_topic_id
			};
            var req = {
                url: '/FetchQuestions',
                method: 'POST',
				data : topicData
            };
            return $http(req);
        },
		
		deleteQuestion: function(questionId){
			var req = {
                url: '/DeleteQuestion',
                method: 'POST',
				data : {questionId : questionId}
            };
            return $http(req);
		},
		
		addQuestion: function(questionData){
			var req = {
                url: '/AddNewQuestion',
                method: 'POST',
				data : questionData
            };
            return $http(req);
		},
		
		modifyQuestion: function(questionData){
			var req = {
                url: '/ModifyQuestion',
                method: 'POST',
				data : questionData
            };
            return $http(req);
		}
    }
}]);

//service for managing geo APIs

EYApp.service('geoService', ['$http', function ($http) {
    
    return {
        
        getGeo: function(data){
            var req = {
                url: '/ManageGeo',
                method: 'POST',
				data : data
            };
            return $http(req);
        },
		
		addLawDescription: function(lawData){		
				
            var req = {
                url: '/AddLawDescription',
                method: 'POST',
				data : lawData
				
            };
            return $http(req);
        },
		
		modifyLawDescription: function(lawData){		
				
            var req = {
                url: '/ModifyLawDescription',
                method: 'POST',
				data : lawData
				
            };
            return $http(req);
        },
        
        getAllCountries: function()
        {
            var req = {
                url: '/fetchList?token=country',
                method: 'GET'
            };
            return $http(req);
        },
        
        getAllStatesForCountry: function(countryId)
        {
             var req = {
                url: '/fetchList?token=state&countryId='+countryId,
                method: 'GET'
            };
            return $http(req);
        }
    }
}])


//service for subscriber APIs

EYApp.service('subscribersService', ['$http', function ($http) {
    
    return {
        
       getSubscribers: function(){
            var req = {
                url: '/FetchSubscribers',
                method: 'GET'
            };
            return $http(req);
        },
		
		addSubscriber: function(subscriberData){
            var req = {
                url: '/AddSubscriber',
                method: 'POST',
				data : subscriberData
            };
            return $http(req);
        },
		
		modifySubscriber: function(subscriberData){
            var req = {
                url: '/ModifySubscriber',
                method: 'POST',
				data : subscriberData
            };
            return $http(req);
        },
		
		deleteSubscriber: function(subscriberData){
            var req = {
                url: '/DeleteSubscriber',
                method: 'POST',
				data : { userId : subscriberData}
            };
            return $http(req);
        }
    }
}]);


//service for report APIs

EYApp.service('reportService', ['$http', function ($http) {
    
    return {
        getReports: function(startDate,endDate,operation)
		{
			var req = {
				url : '/ChatReport?startDate=' + startDate + '&endDate=' + endDate + '&operation=' + operation,
                method: 'GET'
			};
			return $http(req);
		}		
    }
}]);


//service for login APIs

EYApp.service('loginService', ['$http', function ($http) {
    
    return {
        login: function(loginData)
		{
			var req = {
				url : '/LoginServlet',
                method: 'POST',
                data : loginData
			};
			return $http(req);
		}		
    }
}]);


//Storage service for storing application data in localstorage

EYApp.factory("StorageService", ["localStorageService", function(localStorageService) {
		return {
            setData: function(key, data) {
                localStorageService.set(key, data);
            },
            getData: function(key) {
                return localStorageService.get(key);
            },
            clearData: function(key) {
                localStorageService.remove(key);
            },
			clearAll:function(){
				localStorageService.remove("user");
				localStorageService.remove("topic");
			}
        }
    }
]);