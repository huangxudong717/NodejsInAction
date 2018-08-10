let memdb = require('..')
let assert = require('assert')

describe('memdb', () => {
    beforeEach(() => {
        memdb.clear()
    })
})

describe('.save(doc)', function () {
    it('should save the document', function () {
        let pet  = {name: 'Tobi'}
        memdb.save(pet, () => {
            let ret = memdb.first({name: 'Tobi'})
            assert(ret == pet)
            done()
        })
    })
})

describe('.first(obj)', () => {
    it('should return the first marching doc', () => {
        let tobi = {name: 'tobi'}
        let loki = {name: 'Loki'}

        memdb.save(tobi)
        memdb.save(loki)

        let ret = memdb.first({name: 'tobi'})
        assert(ret == tobi)

        ret = memdb.first({name: 'Loki'})
        assert(ret == loki)
    })

    it('should return null when no doc matches', ()=>{
        let ret = memdb.first({name: 'Manny'})
        assert(ret == null)
    })
})

// TDD(驱动测试开发）风格
// module.exports = {
//     'memdb': {
//         '.save(doc)': {
//             'should save the document': function () {
                
//             }
//         }
//     }
// }