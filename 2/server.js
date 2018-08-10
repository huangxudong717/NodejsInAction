const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const chatserver = require('./lib/chat_server')
let cache = {}

function send404(responce) {
    responce.writeHead(404, {'Content-Type': 'text/plain'})
    responce.write('Error 404: resource not found')
    responce.end()
}

function sendFile(responce, filePath, fileContents) {
    responce.writeHead(
        200, 
        {'Content-Type': mime.lookup(path.basename(filePath))}
    )
    responce.end(fileContents)
}

// 检查文件是否在缓存中,若无,读取文件加入缓存,读取失败.返回404
function serveStatic(responce, cache, absPath) {
    if (cache[absPath]) {
        sendFile(responce, absPath, cache[absPath])
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(responce)
                    } else {
                        cache[absPath] = data
                        sendFile(responce, absPath, data)
                    }
                })
            } else {
                send404(responce)
            }
        })
    }
}

var server = http.createServer(function (request, responce) {
    let filePath = false
    if (request.url == '/') {
        filePath = 'public/index.html'
    } else {
        filePath = 'public' + request.url
    }
    let absPath = './' + filePath
    serveStatic(responce, cache, absPath)
})

server.listen(3000, function () {
    console.log('Server listening on port 3000');
})

chatserver.listen(server)