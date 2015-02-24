angular.module("ChatClient").controller('PrivateMessageController', [
	'$scope',
	'$location',
	'$rootScope',
	'$routeParams',
	'socket',
function ($scope, $location, $rootScope, $routeParams, socket) {
	console.log("private");
	$scope.users = [];
	$scope.privateMessage = '';
	$scope.privateMessages = [];
	$scope.friends = [];

	$scope.getUsers = function () {
		socket.emit('users');
		console.log("get users");
		socket.on('userlist', function (userlist) {
			for (var i = 0; i < userlist.length; i++) {
				if (userlist[i] !== $routeParams.user){
					for (var j = 0; j < $scope.users.length; j++) {
						if(userlist[i] === $scope.users[j]){
							return;
						}
					}
					$scope.users.push(userlist[i]);
				}
			}
			console.log($scope.users);
		});
	};

	$scope.startChat = function (user) {
		findFriend(user);
		console.log("startChat " + user);
	};

	function findFriend(friend) {
		for (var i = $scope.friends.length - 1; i >= 0; i--) {
			if ($scope.friends[i].name === friend) {
				console.log("findFriend " + $scope.friends[i]);
				return $scope.friends[i];
			}
		}
		var newFriend = {
			name: friend, msgHistory: []
		};
		$scope.friends.push(newFriend);
		console.log("newFriend " + newFriend);
		return newFriend;
	}

	$scope.sendPrivateMessage = function (user, message) {
		$scope.privateMessage = '';
		console.log("pri" + $scope.privateMessage);
		var currFriend = findFriend(user);
		console.log(currFriend);
		currFriend.msgHistory.push(message);
		console.log("To: " + user + " Message: " + message);
		socket.emit('privatemsg', {nick: user, message: message}, function(sent) {
			if (sent) {
				console.log("private message sent");
			}
		});
	};

	 socket.on('recv_privatemsg', function(friend, message) {
	 	$scope.privateMessage = '';
	 	var currFriend = findFriend(friend);
	 	console.log("currFriend " + currFriend);
		currFriend.msgHistory.push(message);
	 });
}]);