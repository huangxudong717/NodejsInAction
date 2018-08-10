let cluster = require('cluster')
let http = require('http')
let numCPUs = require('os').cpus().length

let workers = {}
let requests = 0

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        workers[i] = cluster.fork()
        // 闭包前面加分号
        ;(function (i ) {
            workers[i].on('message', function (message) {
                if (message.cmd == 'incrementRequestTotal') {
                    requests++
                    for (let j = 0; j < numCPUs; j++) {
                        workers[j].send({
                            cmd: 'updateOfRequestTotal', 
                            requests: requests
                        })
                    }
                }
            })
        })(i)
    }

    cluster.on('exit', (Worker, code, signal) => {
        console.log('worker ${worker.process.pid} die')
    })

} else {
    process.on('message', function (message) {
        if (message.cmd == 'updateOfRequestTotal') {
            requests = message.requests
        }
    })

    http.Server((req, res ) => {
        res.writeHead(200)
        res.end(process.id, requests)
    }).listen(8000)
}
