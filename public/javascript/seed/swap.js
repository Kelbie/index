let shapeshift = require('shapeshift.io')

var DEPOSIT_LIMIT;
var EXCHANGE_RATE;

function load() {
}

function getDepositLimit() {
    var pair = 'btc_ltc'
    shapeshift.depositLimit(pair, function(err, limit) {
        console.log(limit)
        if (!err) {
            DEPOSIT_LIMIT = parseFloat(limit)
        }
    })
}

function getMarketInfo(pair, callback) {
    shapeshift.marketInfo(pair, function(err, marketInfo) {
        if (!err) {
            callback(marketInfo)
        }
    })
}

function swap(amount) {
    console.log(amount)
    var pair;
    if (ticker == "btc") {
        pair = "btc_ltc"
        var withdrawalAddress = litecoin.getAddress()
    } else if (ticker == "ltc") {
        pair = "ltc_btc"
        var withdrawalAddress = foo.getAddress()
    }

    // if something fails
    var options = {
        returnAddress: ticker_to_class[ticker].getAddress()
    }
    console.log(ticker, amount, options.returnAddress, withdrawalAddress)
    shapeshift.shift(withdrawalAddress, pair, options, function(err, returnData) {

        // ShapeShift owned BTC address that you send your BTC to
        if (err) {
            console.log(err)
        } else {
            var depositAddress = returnData.deposit
            console.log("Deposit here:", depositAddress)
            ticker_to_class[ticker].send(depositAddress, parseInt(amount*100000000), 1000)
        }
    })
}


module.exports = {
    load,
    swap,
    getMarketInfo,
    getDepositLimit
}
