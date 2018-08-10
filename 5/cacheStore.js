let http = require('http')
let counter = 0

let server = http.createServer(function (req, res) {
    counter++
    res.writeHead(counter + '  ')
    res.end()
}).listen(8888)