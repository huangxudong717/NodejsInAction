function divEscapedContentElement(message) {
    return $('<div></div>').text(message)
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>${message}</i>') 
}

function processUserInput(chatApp, socket) {
    let message = $('#send-message').val()
    let systemMessage

    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message)
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage))
        }
    } else {
        chatApp.sendMessage($('#room').text(), message)
        $('#messages').append(divEscapedContentElement(message))
        $('#messages').scrollTop($('#messages').prop('scrollHeight'))
    }

    $('#send-message').val('')
}

var socket = io.connect()
$(document).ready(function () {
    let chatApp = new Chat(socket)
    // 显示更名结果
    socket.on('nameResult', function (result) {
        let message
        if (result.success) {
            message = 'You are now known as ' + result.name + '.'
        } else {
            message = result.message
        }
        $('#messages').append(divSystemContentElement(message))
    })

    // 显示房间变更结果
    socket.on('joinResult', function (result) {
        $('#room').text(result.room)
        $('#messages').append(divSystemContentElement('Room changed'))
    })

    // 显示接收的消息
    socket.on('message', function (message) {
        let newElement = $('<div></div>').text(message.text)
        $('#messages').append(newElement)
    })

    // 显示可用房间
    socket.on('rooms', function (rooms) {
        $('#room-list').empty()
        for (let room in rooms) {
            room = room.substring(1, room.length)
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room))
            }
        }
    })

    // 切换房间
    $('#room-list div').click(function () {
        chatApp.processCammand('/join ' + $(this).text())
        $('#send-message').focus()
    })

    // 定期请求可用房间列表
    setInterval(function () {
        socket.emit('rooms')
    }, 1000)

    // 提交表单
    $('#send-message').focus()
    $('#send-message').submit(function () {
        processUserInput(chatApp, socket)
        return false
    })

})