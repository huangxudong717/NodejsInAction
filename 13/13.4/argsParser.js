let args = process.argv.slice(2)

args.forEach((arg) => {
    switch (arg) {
        case '-h':
        case '--help':
            printHelp()
            break;
        default:
            break;
    }
})

function printHelp() {

}