EYApp.controller('reportCtrl', ['$scope', '$rootScope', '$state', 'reportService', function($scope, $rootScope, $state, reportService){
	
	$scope.reportTabList = ['Table View','Chart View'];
	$scope.selectedReportTab = $scope.reportTabList[0];
		
	$scope.selectReportTab = function(tab)
	{			
		$scope.selectedReportTab = tab;
	}
    
    $scope.getReports = function() 
    {
        $rootScope.enableLoader();
        var p = reportService.getReports($scope.startDate,$scope.endDate,'getChatReport');
        p.then(function(response)
		{
            $rootScope.disableLoader();
            $scope.reportTableData = response.data.data;
		},
		function(error)
		{   
            $rootScope.disableLoader();
			console.log(error);
		});
        
        var q = reportService.getReports($scope.startDate,$scope.endDate,'getChatReportByUsers');
        q.then(function(response)
		{
            $rootScope.disableLoader();
            var pieChartData = response.data.data;
            var pieChartArray = [];
            
            var options = {
                series: {
                    pie: 
                    {
                        show: true,
                        radius: 1,
                        label: {
                            show: true,
                            radius: 2/3,
                            formatter:  function (label, series) {
                            return '<span style="font-size:10pt;text-align:left;padding-left:10px;color:white;">' +
                            +
                            Math.round(series.percent) +
                            '%</span>';
                        },
                            background: {
                                opacity: 0.5
                            }
                        }
                    }
                },
                legend: {
                    show: true
                }
            };
            if(pieChartData.length>0)
            {   
                for(var i=0 ; i<pieChartData.length ; i++)
                {
                    var data = 
                        {
                            "label" : pieChartData[i].username,
                            "data" : pieChartData[i].numberOfQueries
                        }
                    pieChartArray.push(data);
                }
                $.plot($("#chart"), pieChartArray, options);
            }
		},
		function(error)
		{   
            $rootScope.disableLoader();
			console.log(error);
		});
        
        
        var r = reportService.getReports($scope.startDate,$scope.endDate,'getChatReportByQueries');
        r.then(function(response)
		{
            $rootScope.disableLoader();
            var arr = [], ticksarray = [];
            var index = 1;
            var barChartData = response.data.data;
            if(barChartData.length>0)
            {              
                for(var i=0 ; i<barChartData.length ; i++)
                {
                    var obj = [];
                    obj.push(index);
                    obj.push(parseInt(barChartData[i].numberOfQueries));
                    arr.push(obj);
                    
                    var tickObj = [];
                    tickObj.push(index);
                    tickObj.push(barChartData[i].sub_topic_name);
                    ticksarray.push(tickObj);
                    index = index+2;
                    
                }
                var barChartArray = 
                {
                    "label" : 'Queries per topic',
                    "data" : arr,
                    "color" : 'rgb(85, 96, 42)'
                }
                var options = {
                    series : { 
                        bars : {
                            show: true,
                            align: "center",
                            barWidth: 24 * 60 * 60 * 600,
                            lineWidth:1
                                }
                        },
                        xaxis : {
                            ticks: ticksarray,
                            axisLabel : "Topic"
                        },
                        yaxis : {
                            axisLabel : "No. of queries"
                        },
                         grid: {
                            borderWidth: 0
                        }
                };                
                $.plot($("#chart1"), [barChartArray], options);
            }
		
		},
		function(error)
		{   
            $rootScope.disableLoader();
			console.log(error);
		});
        
    }
    
    $scope.formatReportDate = function(date)
    {
        var reportDate = new Date(date);
        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October",                     "November", "December"];
        
        var day = ("0" + reportDate.getDate()).slice(-2);
        var month = monthNames[reportDate.getMonth()];
        var year = reportDate.getFullYear();
        
        return day + ' ' + month + ' ' + year;
    }
}]);