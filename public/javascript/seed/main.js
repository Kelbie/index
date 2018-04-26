let bitcoin = require('bitcoinjs-lib')
let bip39 = require('bip39')
let http = require('http')
var child;

function createSeed() {
    return mnemonic = bip39.generateMnemonic()
}

function validateSeed(mnemonic) {
    return bip39.validateMnemonic(mnemonic)
}

function getTransactions() {
  return [{"txid": "ecb61bdb53fa0154a473293dabcee511e6c0cbb4f6c486f44144999483e7b205", "output": 0}]
}

function generateAddress(mnemonic) {
    // https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/bip32.js#L66
    var seed = bip39.mnemonicToSeed(mnemonic)
    var root = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet)
    child = root.derivePath("m/44'/1'/0'/0/0")
    var address = child.getAddress()

    return address
}

function send(mnemonic) {
    var seed = bip39.mnemonicToSeed(mnemonic)
    var root = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet)
    var change = root.derivePath("m/44'/1'/0'/1/0") // generate change address

    var txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
    txb.addInput("d9c9213136854a53211f1c80d202b743dfe971867558fd2c5628fe781a7f7ba9", 0)
    txb.addOutput(change.getAddress(), 113883244)
    txb.sign(0, child.keyPair)
    console.log(txb.build().toHex())



}

function getBalance() {

}

module.exports = {
    createSeed,
    validateSeed,
    generateAddress,
    send
}
