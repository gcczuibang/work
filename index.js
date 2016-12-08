var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketio(server);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});


userNum = 0;
users = [];
//当建立websocket连接，触发io的connection事件
io.on('connection',function(socket){

	//监听用户的login事件
	socket.on('login',function(user){
		console.log(user.username,'登录了');
		socket.username = user.username;
        userNum++
        users.push(user.username);
		//通知所有客户端触发new user事件,并传递了一个数据
		io.emit('new user',{
			'num':userNum,
			'users':users,
			'news':user.username
		});

		//通知与之对应的客户端端
		// socket.emit();
		// //通知在线的所有客户端
		// io.emit();
		// //通知所有在线客户端，但不包含socket所对应的客户端
		// socket.broadcast.emit();
	})
	 

	//监听chat事件
	socket.on('chat',function(msg){
		io.emit('chat',{'user':socket.username,'msg':msg});
	})

	//监听用户断开
	socket.on('disconnect',function(){
		 if(socket.username != undefined){
		 	userNum--;
		 	removeUser(socket.username);
		 	socket.broadcast.emit('user left',{
		 		'num':userNum,
				'users':users,
				'left':socket.username
		 	});
		 }
		 
	})

})


//删除用户
function removeUser(username){
	for(let i=0;i<users.length;i++){
		if(username == users[i]){
			users.splice(i,1);
			return;
		}
	}
}

server.listen(3000,function(){
	console.log('listening on *:3000');
})