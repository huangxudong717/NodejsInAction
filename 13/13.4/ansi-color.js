let ansi = require('ansi')

let cursor = ansi(process.stdout)

cursor
    .fg.green()
    .bg.red()
    .write('hello')
    .fg.reset()
    .bg.reset()
    .write('\n')