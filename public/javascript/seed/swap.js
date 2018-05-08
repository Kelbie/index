let shapeshift = require('shapeshift.io')

function swap(amount, pair) {
  var withdrawalAddress = litecoin.getAddress()
  console.log(withdrawalAddress)
  var pair = 'btc_ltc'

  // if something fails
  var options = {
    returnAddress: foo.getAddress()
  }
  console.log(options.returnAddress)

  shapeshift.shift(withdrawalAddress, pair, options, function (err, returnData) {

    // ShapeShift owned BTC address that you send your BTC to
    var depositAddress = returnData.deposit
    console.log("Deposit here:", depositAddress)

    // you need to actually then send your BTC to ShapeShift
    // you could use module `spend`: https://www.npmjs.com/package/spend
    // spend(SS_BTC_WIF, depositAddress, shiftAmount, function (err, txId) { /.. ../ })

    // later, you can then check the deposit status
    shapeshift.status(depositAddress, function (err, status, data) {
      console.log(status) // => should be 'received' or 'complete'
    })
  })
}


module.exports = {
  swap
}
