var socketio = require('socket.io')
var io
var guestNember = 1
var nickNames = {}
var namesUsed = []
var currentRoom

exports.listen = function (server) {
    io = socketio.listen(server)
    io.set('log level', 1)
    io.sockets.on('connection', function (socket) {
        guestNember = assignGuestName(socket, guestNember, nickNames, namesUsed)
        joinRoom(socket, 'Lobby')
        handleMessageBroadcasting(socket, nickNames)
        handleNameChangeAttempts(socket, nickNames, namesUsed)
        handleRoomJoining(socket)

        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms)
        })

        handleClientDisconnection(socket, nickNames, namesUsed)
    })
}

// 分配昵称
function assignGuestName(socket, guestNember, nickNames, namesUsed) {
    let name = 'guest' + guestNember
    nickNames[socket.id] = name
    socket.emit('nameResult', {
        success: true, 
        name: name
    })
    namesUsed.push(name)
    return guestNember + 1
}

// 进入聊天室
function joinRoom(socket, room ) {
    socket.join(room)
    currentRoom[socket.id] = room
    socket.emit('joinresult', {room: room})
    // 新用户加入聊天室通知
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + 'has joined ' + room + '.'
    })

    // 如果不止一个用户在聊天室, 汇总用户名单并发送通知
    let usersInRoom = io.socket.clients(room)
    if (usersInRoom.length > 1) {
        let usersInRoomSummary = 'User Currently in ${room}.'
        for (let index in usersInRoom) {
            let userSocketId = usersInRoom[index].id
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', '
                }
                usersInRoomSummary += nickNames[userSocketId]
            }
        }
        usersInRoomSummary += '.'
        socket.emit('message', {text: usersInRoomSummary})
    }
}

// 处理昵称变更
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function (name) {
        if (name.indexOf('guest') == 0) {
            socket.emit('nameresult', {
                success: false, 
                message: 'Name canot begin with "guest".'
            })
        } else {
            if (namesUsed.indexOf(name) == -1) {
                let previousName = nickNames[socket.id]
                let previousNameIndex = namesUsed.indexOf(previousName)
                namesUsed.push(previousNameIndex)
                nickNames[socket.id] = name
                delete namesUsed[previousNameIndex]
                socket.emit('nameResult', {
                    success: true, 
                    name: name
                })
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                })
            } else {
                socket.emit('nameResult', {
                    success: false, 
                    message: 'That name is already in use'
                })
            }
        }
    })
}

// 发送消息
function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        })
    })
}

// 创建房间
function handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id])
        joinRoom(socket, room.newRoom)
    })
}

// 断开连接
function handleClientDisconnection(socket) {
    socket.on('diconnect', function() {
        let nameIndex = namesUsed.indexOf(nickNames[socket.id])
        delete namesUsed[nameIndex]
        delete nickNames[socket.id]
    })
}