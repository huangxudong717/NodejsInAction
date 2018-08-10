let http = require('http')
let fs = require('fs')

http.createServer(function (req, res) {
    if (req.url == '/') {
        fs.readFile('./title.json', function (err, data) {
            if (err) {
                console.error(err)
                res.end('Server error')
            } else {
                let title = JSON.parse(data.toString())
                fs.readFile('./template.html', function (err, data) {
                    if (err) {
                        console.error(err)
                        res.end('Server error')
                    } else {
                        let tmpl = data.toString()
                        let html = tmpl.replace('%', title.join('</li><li>'))
                        res.writeHead(200, {'Content-Type': 'text/html'})
                        res.end(html) 
                    }
                })
            }

        })
    }
}).listen(8000, "127.0.0.1")