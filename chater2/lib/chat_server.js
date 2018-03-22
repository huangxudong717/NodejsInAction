
var socketio = require('socket.io')
var io;
var guestNumber = 1
var nickNames = {}
var nameUsed = []
var currentRoom = {}

exports.listen = function(server) {
	io = socketio.listen(server)
	io.set('log level', 1)
	io.sockets.on('connection', function (socket) {
		guestNumber = assignGuestName(socket, guestNumber, nickNames, nameUsed)
		joinRoom(socket, 'Lobby')
		handleMessageBroadcasting(socket, nickNames)
		handleNameChangeAttempts(socket, nickNames, nameUsed)
		handleRoomJoining(socket)

		socket.on('room', function() {
			socket.emit('rooms', io.sockets.manager.rooms)
		})

		handleClientDisconnection(socket, nickNames, nameUsed)
	})
}

function assignGuestName(socket, guestNumber, nickNames, nameUsed) {
	var name = 'Guest' + guestNumber
	nickNames[socket.id] = name
	socket.emit('nameResult', {
		success: true,
		name: name
	})
	nameUsed.push(name)
	return guestNumber
}

function joinRoom(socket, room) {
	socket.join(room)
	currentRoom[socket.id] = room
	socket.emit('joinResult', {room:room})
	socket.brodcast.io(room).emit('message', {
		text: nickNames[socket.id] + 'has joined '+ room + '.'
	})

	var usersInRoom = io.sockets.clients(room)
	if (usersInRoom.length > 1) {
		var usersInRoomSumary = 'Users currently in ' + room + ': '
		for (var index in usersInRoom) {
			var userSocketId = usersInRoom[index].id
			if (userSocketId != socket.id) {
				if (index > 0) {
					usersInRoomSumary += ','
				}
			} 
			usersInRoomSumary += nickNames[userSocketId]
		}
	}

	usersInRoomSumary += ','
	socket.emit('message', {text: usersInRoomSumary})
}

//更名请求的逻辑
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function (name) {      //添加 nameAttempt 事件监听器
        if(name.indexOf('Guest') == 0){     //昵称不能以Guest 开头
            socket.emit('nameResult', {
                success: false,
                message: 'Names can`t begin with "Guest"'
            });
        }else{
            if(namesUsed.indexOf(name) == -1){      //如果昵称还没注册则执行注册
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                // namesUsed.splice(previousNameIndex, 1);
                socket.emit('nameResult',{
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + 'is now knows as ' + name + '.'
                })
            }else{      //如果昵称已被占用则提示用户
                socket.emit('nameResult',{
                    success: false,
                    message: 'That name is already in use'
                })
            }
        }
    })
}

//发送聊天消息
function handleMessageBroadcasting(socket, nickNames) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message',{
            text: nickNames[socket.id] + ": " + message.text
        });
    });
}

//创建房间
function  handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    })
}

//用户断开连接
function handleClientDisconnection(socket, nickNames, namesUsed) {
    socket.on('disconnect', function () {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        // namesUsed.slice(nameIndex, 1);
        delete nickNames[socket.id];
        // nickNames.slice(socket.id, 1);
    })
}