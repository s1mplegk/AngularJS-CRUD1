(function() {

	var app = angular.module("employeeDetails", ["ui.router", "checklist-model"]);
	
	/*Declaring root scope variables.. */
	
	var MainController = function($scope, $http, $window) {
		
		$scope.isUpdate = false;
				
		/*$http({
			url:'../employee/countryList'
		}).success(function(data,status,headers,config){
			$scope.countryList=data;
		}).error(function(data,status,headers,config){			
			alert('Error in fetching Country List..!!');
		});*/
		
		if($window.localStorage.getItem('employeeList')!=null)
		{
			$scope.employeeListLocal=JSON.parse($window.localStorage.getItem('employeeList'));
		}
		
		$http({
			url:'employee/qualificationsList'
		}).then(function(response){
			$scope.qualificationsList=response.data;
			console.log(response);
		});
		
		$http({
			url:'employee/countryList'
		}).then(function(response){
			$scope.countryList=response.data;		
			console.log(response);
		});
		
		
		
		$scope.savetolocal=function(){
			var employees = [];
			if($window.localStorage.getItem('employeeList')!=null)
			{
				employees.push.apply(employees,JSON.parse($window.localStorage.getItem('employeeList')));
			}
			employees.push($scope.employee);
			$window.localStorage.setItem('employeeList', JSON.stringify(employees));
			$scope.employee={};
			alert('Record Added to Local Storage');		
			$scope.employeeListLocal=JSON.parse($window.localStorage.getItem('employeeList'));
			$scope.newEmployee();
		};	
		
		$scope.savetoCloud=function(){
			$http.post("employee/save", $scope.employeeListLocal)
			   .then(
			       function(response){
			        alert("Sync to Cloud Successfull..!!");
			        $scope.getAllEmployees();
			        $scope.clearLocalStore();
			        $scope.newEmployee();
			       }, 
			       function(response){
			    	   alert("Error in Sync data to Cloud..!!");
			    	   $scope.newEmployee();
			       }
			    );
		};
		
		$scope.getEmployee=function(id){
			$scope.isUpdate = true;
			$http({
				url:'employee/getEmployee',
				method:'GET',
				params:{id: {"_id":id}}			
			}).then(function(response){
				$scope.employee=response.data;				
			}, 
		       function(response){
		    	   alert("Error in getting user for update..!!");
		    	   $scope.newEmployee();
		       }
			
			);
		};
		
		$scope.updateEmployee=function(){
			
			$http.post("employee/updateEmployee", $scope.employee)
			   .then(
			       function(response){
			        alert("Emplpoyee Updated Successfull..!!");			        
			        $scope.newEmployee();
			        $scope.getAllEmployees();
			       }, 
			       function(response){
			    	   alert("Error updating employee data..!!");			    	  
			       }
			    );
			$scope.isUpdate = false;
		};
		
		$scope.deleteEmployee=function(emp){
			
			$http.post("employee/deleteEmployee", emp)
			   .then(
			       function(response){
			        alert("Emplpoyee Deleted Successfull..!!");			        
			        $scope.newEmployee();
			        $scope.getAllEmployees();
			       }, 
			       function(response){
			    	   alert("Error deleting employee data..!!");			    	  
			       }
			    );
		};
		
		
		$scope.getAllEmployees=function(){
			
			
			$http({
				url:'employee/getAllEmployees'
			}).then(function(response){
				$scope.employeeList=response.data;				
			});
			
		};
		
		$scope.clearLocalStore=function()
		{
			$window.localStorage.removeItem('employeeList');
			$scope.employeeListLocal=null;
			/*$scope.employeeListLocal={};*/
		};
		
		$scope.newEmployee=function(){
			$scope.employee={};
			$scope.isUpdate = false;
		};
		
		
		$scope.clearFilters=function(){
			$scope.fgender={};
			$scope.searchfirstName = '';
			$scope.search={};
		};
		
		
	};

	app.controller("MainController", MainController);
	
	/*var routerApp = angular.module('routeApp', ['ui.router']);*/
	
	app.config(function($stateProvider, $urlRouterProvider) {
	
		$urlRouterProvider.otherwise("/home"); 
		$stateProvider
		.state('home',{
			url:'/home',
			templateUrl : 'htmlviews/welcome.html',
		}).state('employee',{
			url:'/employee',
			templateUrl:'htmlviews/employeeList.html',
			controller:'MainController'
		}).state("upload",{
			url:'/upload',
			templateUrl:'htmlviews/uploadFile.html',
			controller:'UploadController'
		}).state("home.inner",{
			url:'/inner',
			templateUrl:'htmlviews/inner.html',
		});
			
	});
	
	
	
}());