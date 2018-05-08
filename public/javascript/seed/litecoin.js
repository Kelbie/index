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
  ROOT = bitcoin.HDNode.fromSeedBuffer(SEED, bitcoin.networks.testnet)
  ADDRESS = getAddress()
  getTransactions(function(txs) { // Gets transactions from API and waits for response
    transactions = txs
    displayTransactions(transactions)
  })
  getBalance()
  listenForTransactions() // Listens for transactions in real time
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
  return ROOT.derivePath("m/44'/1'/0'/0/0").getAddress()
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
  $.get("https://api.blockcypher.com/v1/btc/test3/addrs/" + ADDRESS + "/balance")
    .then(function(d) {
      BALANCE = d.final_balance
      SPENDABLE_BALANCE = d.balance
      $.get("https://api.coinmarketcap.com/v2/ticker/1/?convert=GBP")
        .then(function(cmc) {
          displayBalance(
            d.balance, // Price in bitcoin
            // (British Price) * (Bitcoin Price) / 100,000,000 to turn from satoshi's to Bitcoin
            (cmc.data.quotes.GBP.price * d.balance / 100000000).toLocaleString(undefined, {
              minimumFractionDigits: 2
            })) // formats price
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

function validateSend(amount, fee) {
  console.log(amount, fee, SPENDABLE_BALANCE)
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
  $.get('https://api.blockcypher.com/v1/btc/test3/addrs/' + ADDRESS)
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
  var ws = new WebSocket("wss://socket.blockcypher.com/v1/btc/test3");
  ws.onmessage = function(event) {
    console.log(event)
    var outputs = JSON.parse(event.data).outputs
    for (var i = 0; i < outputs.length; i++) {
      if (outputs[i].addresses[0] == ADDRESS) {
        getBalance()
        getTransactions(function(txs) {
          transactions = txs
          displayTransactions(transactions)
        })
      }
    }
  }
  ws.onopen = function(event) {
    console.log("WebSocket Connected")
    ws.send(JSON.stringify({
      event: "unconfirmed-tx",
      address: ADDRESS
    }));
  }
}

function send(address, amount, fee) {

  // Make sure the amounts are integers
  amount = parseInt(amount)
  fee = parseInt(fee)

  var change = ROOT.derivePath("m/44'/1'/0'/0/0") // This is the change address
  var input_amount = 0 // The input amount is the amount going into the transaction which is usually more than the 'amount'
  var counter = 0 // This is the number of transaction outputs used construct the transaction
  var txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
  var inputs = 0
  console.log(transactions.txrefs)
  while (input_amount < amount + fee) { // input amount needs to be more than the output plus the fee
    if (transactions.txrefs[counter].spent == false) {
      input_amount += parseInt(transactions.txrefs[counter].value) // Each transaction output we are using is added to the input amount
      txb.addInput( // Adding an input to our transaction
        transactions.txrefs[counter].tx_hash, // txb needs a transaction hash
        transactions.txrefs[counter].tx_output_n // and the output that is used as an input for our transaction
      )
      inputs += 1

    }
    counter += 1
  }
  txb.addOutput(address, amount) // the output is the destination that the user has set
  if (input_amount - amount - fee != 0) { // We don't need to create the change output if there is no change to send back
    txb.addOutput(change.getAddress(), input_amount - amount - fee) // this is the change address where the rest of the bitcoin is sent
  }
  for (var i = 0; i < inputs; i++) { // Loop over each transaction input
    txb.sign(i, change.keyPair) // and sign it
  }

  var pushtx = {
    tx: txb.build().toHex()
  } // Format the transaction
  $.post('https://api.blockcypher.com/v1/btc/test3/txs/push', JSON.stringify(pushtx)) // push the transaction to blockcypher API
    .then(function(d) {});
}

module.exports = {
  unlock,
  createSeed,
  validateSeed,
  validateSend,
  send,
  getAddress
}
