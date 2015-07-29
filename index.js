var arkham = angular.module('arkham',[]);

arkham.controller('AncientOne',['$scope','$rootScope','$http',function($scope, $rootScope, $http) {
  var interval;
  $scope.selectedAncient = {};
  $scope.changeAncient = true;
  $http.get('/json/ancient.json').success(
    function(data,status) {
      $scope.ancients = angular.fromJson(data).ancients;
    }
  );
  $scope.select = function(ancient) {
    $scope.changeAncient = false;
    $scope.selectedAncient = ancient;
    $rootScope.$broadcast('changeAncient', ancient);
  };
  $scope.change = function() {
    $scope.changeAncient = true;
    $scope.timeLeft = 10;
    window.setTimeout($scope.revert,10000);
    interval = window.setInterval(
      function() {
        $scope.timeLeft--;
        $scope.$digest();
      },1000);
  };
  $scope.revert = function() {
    window.clearInterval(interval);
    $scope.changeAncient = false;
    $scope.$digest();
  };
}]);

arkham.controller('MonsterSpawner',['$scope','$rootScope','$http', function($scope, $rootScope, $http) {
  $scope.monsters = [];
  $scope.monstersSpawned = [];
  $http.get('/json/monster.json').success(
    function(data,status) {
      $scope.monsterTypes = angular.fromJson(data).monsters;
    }
  );

  //Functions
  $scope.loadMonsters = function(mask) {
    $scope.monsters = [];
    $scope.monstersSpawned = [];
    angular.forEach($scope.monsterTypes,
      function(value, key) {
        for (i = 0; i < value.quantity; i++) {
          if (!mask && value.type==='mask') continue;
          var m = {};
          $.extend(true,m,value);
          delete m.quantity;
          $scope.monsters.push(m);
        }
      }
    );
    shuffle($scope.monsters);
  };
  $scope.spawnMonster = function () {
    if ($scope.monsters.length > 0) {
      $scope.monstersSpawned.push($scope.monsters.shift());
    }
  };
  $scope.defeatMonster = function(index) {
    $scope.monsters.push($scope.monstersSpawned.splice(index,1).pop());
  };

  //Listeners
  $scope.$on('changeAncient',
    function(event, ancient) {
      $scope.loadMonsters(ancient.mask);
    }
  );
}]);

function shuffle(array) {
  for (var i = 0; i < array.length; i++) {
    var index = Math.floor(Math.random()*(array.length-i));
    array.push(array.splice(index,1).pop());
  }
}
