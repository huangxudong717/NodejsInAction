let net = require('net')
let host = process.argv[2]
let port = Number(process.argv[3])

let socket = net.connect(port, host)

socket.on('connect', () => {
    process.stdin.pipe(socket)
    socket.pipe(process.stdout)
    // stdin调用resume(),开始读取数据
    process.stdin.resume()
})

socket.on('end', () => {
    process.stdin.pause()
})