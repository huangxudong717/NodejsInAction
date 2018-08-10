let assert = require('assert')
let Todo = require('./todo')

let todo = new Todo()
let testCompleted = 0

function deleteTest() {
    todo.add('delete me')
    assert.equal(todo.getCount(), 1, '1 item should exist')
    todo.deleteAll()
    assert.equal(todo.getCount(), 0, 'No items should exist')
    testCompleted++
}

function addTest() {
    todo.deleteAll()
    todo.add('add')
    assert.notEqual(todo.getCount(), 0, '1 item should exist')
    testCompleted++
}

function doAsyncTest(cb) {
    todo.doAsync(function (value) {
        assert.ok(value, 'callback pass')
        testCompleted++
        cb()
    })
}

function throwsTest(cb) {
    assert.throws(todo.add, /requires/)
    testCompleted++
}

deleteTest()
addTest()
throwsTest()
doAsyncTest(function () {
    console.log(testCompleted + 'tests')
})