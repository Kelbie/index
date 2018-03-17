let bitcoin = require('bitcoinjs-lib')
let bip39 = require('bip39')
let http = require('http')

function createSeed() {
    return mnemonic = bip39.generateMnemonic()
}

function validateSeed(mnemonic) {
    return bip39.validateMnemonic(mnemonic)
}

function generateAddress(mnemonic) {
    // https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/bip32.js#L66
    var seed = bip39.mnemonicToSeed(mnemonic)
    var root = bitcoin.HDNode.fromSeedBuffer(seed)

    var path = "m/49'/1'/0'/0/0"
    var child = root.derivePath(path)

    var keyhash = bitcoin.crypto.hash160(child.getPublicKeyBuffer())
    var scriptSig = bitcoin.script.witnessPubKeyHash.output.encode(keyhash)
    var addressBytes = bitcoin.crypto.hash160(scriptSig)
    var outputScript = bitcoin.script.scriptHash.output.encode(addressBytes)
    var address = bitcoin.address.fromOutputScript(outputScript, bitcoin.networks.testnet)

    return address
}

function getBalance() {

}

module.exports = {
    createSeed,
    validateSeed,
    generateAddress
}
