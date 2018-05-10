function loadPage(page, callback) {
    /* Function : loadPage
     * -------------------
     * Loads page using ajax and imports the result into .content
     *
     * page (string)        : referes to the route name in routes.js
     * callback (function)  : a function that runs after the page has been loaded and imported
     */
    $.ajax({
        url: page,
        success: function(result) {
            $(".content").html(result);
        }
    }).done(callback()).fail();
}

function displayBalance(crypto_balance, native_multiplyer) {
    ticker_to_price[ticker] = native_multiplyer
    console.log(ticker_to_price)
    $(".balance").find(".crypto-balance").find("span:first").html((crypto_balance / 100000000).toFixed(8))
    $(".balance").find(".crypto-balance").find("span:nth-child(2)").html(ticker.toUpperCase());
    $(".balance").find(".native-balance").find("span:first").html((crypto_balance / 100000000 * native_multiplyer).toFixed(2))
}

function groupTransactions(transactions) {
    var grouped_transactions = []
    var used_hashes = []
    if (transactions) {
        for (var i = 0; i < transactions.length; i++) {
            var hash = transactions[i].tx_hash
            var grouped_tx = transactions[i]
            if (!used_hashes.includes(hash)) {
                for (var j = i; j < transactions.length; j++) {
                    if (transactions[j].tx_hash == hash) {
                        grouped_tx.value += transactions[j].value
                    }
                }
                used_hashes.push(hash)
                grouped_transactions.push(grouped_tx)
            }
        }
        return grouped_transactions
    } else {
        return transactions
    }
}

function groupUnconfirmedTransactions(transactions) {
    console.log("2,", transactions)
    if (transactions) {
        new_transaction = {
            tx_hash: transactions[0].tx_hash,
            tx_input_n: transactions[0].tx_input_n,
            value: -transactions[0].value,
            received: transactions[0].received
        }
        for (var i = 0; i < transactions.length; i++) {
            new_transaction.value += transactions[i].value
        }
        return [new_transaction]
    } else {
        return transactions
    }
}

function displayTransactions(transactions, type) {
    $(".tx-list").empty()
    confirmed_transactions = groupTransactions(transactions.txrefs)
    unconfirmed_transactions = groupUnconfirmedTransactions(transactions.unconfirmed_txrefs)
    console.log("1,", unconfirmed_transactions)
    var total_amount = 0
    var add_or_sub = ["+", "plus"]
    if (confirmed_transactions) {
        for (var i = confirmed_transactions.length - 1; i >= 0; i--) { // Go through array from oldest to newest
            if (confirmed_transactions[i].ref_balance > total_amount) { // Transaction going in
                add_or_sub = ["+", "plus"]
            } else {
                add_or_sub = ["-", "sub"]
            }
            var change = parseInt(confirmed_transactions[i].ref_balance) - parseInt(total_amount)
            if ((add_or_sub[0] == "+" && type == "received") || (add_or_sub[0] == "-" && type == "sent") || (type == "all")) {
                $(".tx-list").prepend(`
        <div class="tx">
            <div class="flex-container">
                <div class="left flex-item">
                    <div class="tx-id">
                        ` + confirmed_transactions[i].tx_hash + `
                    </div>
                </div>
                <div class="right flex-item">
                    <div class="` + add_or_sub[1] + `">
                        ` + add_or_sub[0] + `
                    </div>
                    <div class="value">
                        ` + (Math.abs(change) / 100000000).toFixed(8) + `
                    </div>
                </div>
            </div>
            <div class="date">
                ` + confirmed_transactions[i].confirmed.toLocaleString() + `  •  Confirmed
            </div>
        </div>`)
            }
            total_amount = confirmed_transactions[i].ref_balance
        }
    }

    if (unconfirmed_transactions) {
        for (var i = 0; i < unconfirmed_transactions.length; i++) { // Go through array from oldest to newest
            if (unconfirmed_transactions[i].tx_input_n == -1) {
                var add_or_sub = ["+", "plus"]
            } else {
                var add_or_sub = ["-", "sub"]
            }
            if ((add_or_sub[0] == "+" && type == "received") || (add_or_sub[0] == "-" && type == "sent") || (type == "all")) {
                $(".tx-list").prepend(`
          <div class="tx">
              <div class="flex-container">
                  <div class="left flex-item">
                      <div class="tx-id">
                          ` + unconfirmed_transactions[i].tx_hash + `
                      </div>
                  </div>
                  <div class="right flex-item">
                      <div class="` + add_or_sub[1] + `">
                          ` + add_or_sub[0] + `
                      </div>
                      <div class="value">
                          ` + (unconfirmed_transactions[i].value / 100000000).toFixed(8) + `
                      </div>
                  </div>
              </div>
              <div class="date">
                  ` + unconfirmed_transactions[i].received.toLocaleString() + `  •  Unconfirmed
              </div>
          </div>`)
            }
        }
    }
}
