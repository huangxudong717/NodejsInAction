let http = require('http')
let cp = require('child_process')

let server = http.createServer((req, res) => {
    let child = cp.fork(__filename, [req.url.substring(1)])
    child.on('message', (m) => {
        res.end(m.result + '\n')
    })
})
server.listen(8000)