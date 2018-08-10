let tips = require('..')
let should = require('should')

let tax = 0.12
let tip = 0.15
let prices = [10, 20]
let pricesWithTipAndTax = tips.addPercentageToEach(prices, tip + tax)

pricesWithTipAndTax[0].should.equal(12.7)
pricesWithTipAndTax[1].should.equal(25.4)

let totalAmount = tips.sum(pricesWithTipAndTax).toFixed(2)
totalAmount.should.equal('38.10')

let totalAmountAsCurrency = tips.dollarFormat(totalAmount)
totalAmountAsCurrency.should.equal('$38.10')

let tipAsPercent = tips.percentFormat(tip)
tipAsPercent.should.equal('15%')