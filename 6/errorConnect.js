let http = require('http')
let connect = require('connect')

let api = connect().use(users).use(pets).use(errorHandler)
let app = connect().use(hello).use('/api', api).use(errorPage)

function hello(req, res, next) {
    if (req.url.match(/^\/hello/)) {
        res.end('hello')
    } else {
        next()
    }
}

let db = {
    users: [
        {name: 'tobi'}, 
        {name: 'loki'},
        {name: 'jane'}
    ]
}

function users(req, res, next) {
    let match = req.url.match(/^\/user\/(.+)/)
    if (match) {
        let user = db.users[match[1]]
        if (user) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(user))
        } else {
            let err = new Error('User not found')
            err.notFound = true
            next(err)
        }
    } else {
        next()
    }
}

function pets(req, res, next) {
    if (req.url.match(/^\/pet\/(.+)/)) {
        foo()
    } else {
        next()
    }
}

function errorHandler(err, req, res, next) {
    console.error(err.stack)
    res.setHeader('Content-Type', 'application/json')
    if (err.notFound) {
        res.statusCode = 404
        res.end(JSON.stringify({error: err.message}))
    } else {
        res.statusCode = 500
        res.end(JSON.stringify({error: 'Internal Server Error'}))
    }
}

function errorPage(req, res, next) {
    
}

http.createServer(app).listen(3000)