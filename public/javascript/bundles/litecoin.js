let bitcoin = require('bitcoinjs-lib')
let bip39 = require('bip39')
let http = require('http')
let $ = require('jquery')

var SEED;
var ROOT;
var ADDRESS;
var BALANCE = 0;
var SPENDABLE_BALANCE = 0;
var transactions = [];

function unlock(mnemonic) {
    /* Function : unlock
     * -----------------
     * runs various functions that are required to setup the environment
     *
     */
    SEED = bip39.mnemonicToSeed(mnemonic)
    ROOT = bitcoin.HDNode.fromSeedBuffer(SEED, bitcoin.networks.litecoin)
    ADDRESS = getAddress()
    ticker = "ltc"
    getTransactions(function(txs) { // Gets transactions from API and waits for response
        transactions = txs
        displayTransactions(transactions, "all")
    })
    getBalance()
    listenForTransactions() // Listens for transactions in real time
}

function returnTransactions() {
    // since transactions are not given to other parts of the application I had
    // to create a function that allowed other parts of the app to see them.
    return transactions
}

function getAddress() {
    /* Function : getAddress
     * ---------------------
     * Gets child addresses which are the addresses that the user eventually uses
     * to receive payments. It also gets change addresses which are addresses
     * that the user doesn't see that are required to send change to when sending
     * payments.
     *
     * Returns (array) : [child_addrs change_addrs]
     */
     console.log("GA", ROOT.derivePath("m/44'/0'/0'/0/0").getAddress())
    return ROOT.derivePath("m/44'/0'/0'/0/0").getAddress()
}

function createSeed() {
    /* Function : createSeed
     * ---------------------
     * Creates a random 12 word seed.
     *
     * Returns (string) : (example) "witch collapse practice feed shame open despair creek road again ice least"
     */
    return bip39.generateMnemonic()
}

function getBalance() {
    /* Function : getBalance
     * ---------------------
     * Loads balance from public/data/balance.json
     */
    $.get("https://api.blockcypher.com/v1/ltc/main/addrs/" + ADDRESS + "/balance")
        .then(function(d) {
            BALANCE = d.final_balance
            SPENDABLE_BALANCE = d.balance
            $.get("https://api.coinmarketcap.com/v2/ticker/2/?convert=GBP")
                .then(function(cmc) {
                    displayBalance(
                        d.balance, // Price in bitcoin
                        cmc.data.quotes.GBP.price, // GBP Price
                    )
                })
        })
}

function validateSeed(mnemonic) {
    /* Function : validateSeed
     * -----------------------
     * this validates the seed to see if its true or false
     *
     * mnemonic (string)  : 12 word seed
     *
     * Returns (boolean) : (example) true
     */
    return bip39.validateMnemonic(mnemonic)
}

function validateAddress(address) {
    var re = /^[L3][a-km-zA-HJ-NP-Z1-9]{25,34}$/ // // Regular Expression https://stackoverflow.com/questions/21683680/regex-to-match-bitcoin-addresses
    if (address.search(re) == 0) {
        return true
    } else {
        return false
    }
}

function validateSend(amount, fee) {
    if (!fee) {
        fee = 0
    }
    if (!amount) {
        amount = 0
    }
    if (isNaN(fee)) {
        return false
    }
    if (isNaN(amount)) {
        return false
    }
    if (parseInt(amount) + parseInt(fee) <= parseInt(SPENDABLE_BALANCE)) {
        return true
    } else {
        return false
    }
}

function getTransactions(callback) {
    /* Function : getTransactions
     * --------------------------
     * Gets a list of confirmed transactions from the child addresses
     *
     * child_addrs (array) :
     */
    $.get('https://api.blockcypher.com/v1/ltc/main/addrs/' + ADDRESS)
        .then(function(d) {
            callback(d)
        });
}

function listenForTransactions() {
    /* Function : listenForTransactions
     * --------------------------------
     *
     */
    // Get latest unconfirmed transactions live
    // var ws = new WebSocket("wss://socket.blockcypher.com/v1/btc/test3");
    // ws.onmessage = function(event) {
    //     console.log(event)
    //     var outputs = JSON.parse(event.data).outputs
    //     console.log(outputs)
    //
    // }
    // ws.onopen = function(event) {
    //     console.log("WebSocket Connected", ADDRESS)
    //     ws.send(JSON.stringify({
    //         event: "unconfirmed-tx",
    //         address: ADDRESS
    //     }));
    // }
}

function send(address, amount, fee) {
    // Make sure the amounts are integers
    amount = parseInt(amount)
    fee = parseInt(fee)

    var data = ROOT.derivePath("m/44'/0'/0'/0/0") // This is the change address path
    confirmed_transactions = transactions.txrefs
    var total_amount = 0
    var count_amount = 0
    var inputs = 0
    var utxo = true
    var txb = new bitcoin.TransactionBuilder(bitcoin.networks.litecoin)
    if (confirmed_transactions) {
        for (var i = confirmed_transactions.length - 1; i >= 0; i--) { // Go through array from oldest to newest
            if (confirmed_transactions[i].ref_balance > total_amount) { // Transaction going in
                utxo = true
            } else {
                utxo = false
            }
            var change = parseInt(confirmed_transactions[i].ref_balance) - parseInt(total_amount)
            if (utxo) {
                if (!confirmed_transactions[i].spent) {
                    console.log(change, confirmed_transactions[i].spent, confirmed_transactions[i].tx_hash)
                    txb.addInput( // Adding an input to our transaction
                        confirmed_transactions[i].tx_hash, // txb needs a transaction hash
                        confirmed_transactions[i].tx_output_n // and the output that is used as an input for our transaction
                    )
                    count_amount += change
                    inputs += 1
                }
            }
            total_amount = confirmed_transactions[i].ref_balance
            if (count_amount >= amount + fee) {
                break;
            }
        }
    }
    console.log(count_amount, amount, fee)
    txb.addOutput(address, amount) // the output is the destination that the user has set
    if (count_amount - amount - fee != 0) { // We don't need to create the change output if there is no change to send back
        txb.addOutput(data.getAddress(), count_amount - amount - fee) // this is the change address where the rest of the bitcoin is sent
    }
    for (var i = 0; i < inputs; i++) { // Loop over each transaction input
        txb.sign(i, data.keyPair) // and sign it
    }

    var pushtx = {
        tx: txb.build().toHex()
    } // Format the transaction
    console.log(pushtx)
    $.post('https://api.blockcypher.com/v1/ltc/main/txs/push', JSON.stringify(pushtx)) // push the transaction to blockcypher API
        .then(function(d) {
            console.log(d)
        });
}

module.exports = {
    unlock,
    createSeed,
    validateSeed,
    validateSend,
    validateAddress,
    send,
    getAddress,
    returnTransactions
}
