let fs = require('fs')
let path = require('path')
// 获取node fileStroe.js后面的命令参数
let args = process.argv.splice(2)
let command = args.shift()
// 合并剩余参数
let taskDescription = args.join(' ')
let file = path.join(process.cwd(), './tasks')

switch (command) {
    case 'list':
        listTasks(file)
        break;

    case 'add':
        addTasks(file, taskDescription)
        break;

    default:
        console.log('Usage: ${process.argv[0]} list|add [taskDescription]')
        break;
}

function loadOrInitializeTaskArray(file, cb) {
    fs.exists(file, function (exists) {
        let tasks = []
        if (exists) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    throw err
                }
                let dataStr = data.toString()
                tasks = JSON.parse(dataStr || '[]')
                cb(tasks)
            })
        } else {
            cb([])
        }
    })
}

function listTasks(file) {
    loadOrInitializeTaskArray(file, function (tasks) {
        for (let i in tasks) {
            console.log(tasks[i])        
        }
    })
}

function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) {
            throw err
        }
        console.log('Saved')
        
    })
}

function addTasks(file, taskDescription) {
    loadOrInitializeTaskArray(file, function (tasks) {
        tasks.push(taskDescription)
        storeTasks(file, tasks)
    })
}