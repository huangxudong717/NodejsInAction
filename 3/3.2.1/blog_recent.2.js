let http = require('http')
let fs = require('fs')

// 尽早返回减少嵌套
let server = http.createServer(function (req, res) {
    getTitle(res)
}).listen(8000, "127.0.0.1")

function getTitle(res) {
    fs.readFile('./title.json', function (err, data) {
        if (err) {
            return hasError(err, res)
        } 
        getTemplate(JSON.parse(data.toString()), res)
    })
}

function getTemplate(title, res) {
    fs.readFile('./template.html', function (err, data) {
        if (err) {
            return hasError(err, res)
        } 
        formatHtml(title, data.toString(), res)
    })
}

function formatHtml(title, tmpl, res) {
    let html = tmpl.replace('%', title.join('<li></li>'))
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(html)    
}

function hasError(err, res) {
    console.error(err)
    res.end('Server error')
}