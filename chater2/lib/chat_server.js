import { join } from 'path';

var socketio = require('socket.io')
var io;
var guestNumber = 1
var nickNames = {}
var nameUsed = []
var currentRoom = {}

exports.listen = function() {
	io = socketio.listen(server)
	io.serveClient('log level', 1)
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

