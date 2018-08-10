let db = []

exports.save = function (doc, cb) {
    db.push(doc)
    if (cb) {
        setTimeout(() => {
            cb()
        }, 1000);
    }
}

exports.first = (obj) => {
    return db.filter((doc) => {
        for (let key in obj) {
            if (doc[key] != obj[key]) {
                return false
            }
        }
        return true
    }).shift()
}

exports.clear = () => {
    db = []
}