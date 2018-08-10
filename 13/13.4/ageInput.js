let requiredAge = 18

process.stdout.write('enter your age:')

process.stdin.setEncoding('utf8')
process.stdin.on('data', (data) => {
    let age = parseInt(data, 10)
    if (isNaN(age)) {
        console.log('${data} is not a valid numer')
    } else if (age < requiredAge) {
        console.log(`you must be at least ${requiredAge} to enter, com back in ${requiredAge - age} years`)
    } else {
        enterTheSecreDungeon()
    }
    process.stdin.pause()
})

process.stdin.resume()

function enterTheSecreDungeon() {
    console.log('welcome')
}