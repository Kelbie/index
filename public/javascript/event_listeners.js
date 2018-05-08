var seed = "";
var ticker = "btc";

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

function displayBalance(crypto_balance, native_balance) {
  console.log("DB", crypto_balance, native_balance)
  $(".balance").find(".crypto-balance").find("span:first").html((crypto_balance / 100000000).toFixed(8))
  $(".balance").find(".crypto-balance").find("span:nth-child(2)").html(ticker.toUpperCase())
  $(".balance").find(".native-balance").find("span:first").html(native_balance)
}

function groupTransactions(transactions) {
  console.log("transactions:", transactions)
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
    console.log("GT", grouped_transactions)
    return grouped_transactions
  } else {
    return transactions
  }
}

function displayTransactions(transactions) {
  $(".tx-list").empty()
  confirmed_transactions = groupTransactions(transactions.txrefs)
  unconfirmed_transactions = groupTransactions(transactions.unconfirmed_txrefs)
  console.log("CT:", confirmed_transactions)
  console.log("UCT:", unconfirmed_transactions)
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

// VALIDATE SEED
// https://stackoverflow.com/questions/11338592/how-can-i-bind-to-the-change-event-of-a-textarea-in-jquery
var oldVal = "";
$(document).on("change keyup paste", "#input-seed", function() {
  var currentVal = $(this).val();
  if (currentVal == oldVal) {
    return; //check to prevent multiple simultaneous triggers
  }

  oldVal = currentVal;
  //action to be performed on textarea changed
  if (foo.validateSeed(currentVal)) {
    console.log(currentVal);
    $(this).css({
      "border-color": "green"
    });
  } else {
    $(this).css({
      "border-color": "red"
    });
  }
});

$(document).on("change keyup paste", "#send-amount, #send-fee", function() {
  var currentVal = $(this).val();
  if (currentVal == oldVal) {
    return; //check to prevent multiple simultaneous triggers
  }

  oldVal = currentVal;
  //action to be performed on textarea changed
  console.log($("#send-amount").val(), $("#send-fee").val())
  console.log(foo.validateSend($("#send-amount").val(), $("#send-fee").val()))
  if (foo.validateSend($("#send-amount").val(), $("#send-fee").val())) {
    console.log(currentVal);
    $("#send-amount, #send-fee").css({
      "border-color": "green"
    });
  } else {
    $("#send-amount, #send-fee").css({
      "border-color": "red"
    });
  }
});

$(document).ready(function() {
  // LOAD LOCKED PAGE
  loadPage('locked', function() {

  });

  // VAULT NAV BUTTON CLICKED
  $(document).on("click", "#vault-nav", function() {
    if (!$("#vault-nav")[0].className.includes("disabled")) {
      loadPage('vault', function() {
        $("#swap-nav").removeClass("selected");
        $("#vault-nav").addClass("selected");
        if (ticker == "btc") {
          foo.unlock()
        } else if (ticker == "ltc") {
          litecoin.unlock()
        }
      });
    }
  });

  // SWAP NAV BUTTON CLICKED
  $(document).on("click", "#swap-nav", function() {
    if (!$("#swap-nav")[0].className.includes("disabled")) {
      loadPage('swap', function() {
        $("#vault-nav").removeClass("selected");
        $("#swap-nav").addClass("selected");
        console.log("Success: Swap Page Loaded");
      });
    }
  });

  // UNLOCK BUTTON CLICKED
  $(document).on('click', '#unlock-button', function() {
    $("#unlock").toggleClass("frame-center frame-right"); // Add frame-center, Remove frame-right
    $("#slider").toggleClass("slider-active");
  });

  // CREATE BUTTON CLICKED
  $(document).on('click', '#create-button', function() {
    $("#create").toggleClass("frame-center frame-right"); // Add frame-center, Remove frame-right
    $("#slider").toggleClass("slider-active");
    $("#create").find("textarea").val(foo.createSeed());
  });

  // UNLOCK BUTTON CONFIRM CLICKED
  $(document).on("click", "#unlock-button-confirm", function() {
    if (foo.validateSeed($("#unlock").find("textarea").val())) {
      $("#unlock").toggleClass("frame-center frame-left").one('transitionend', function() {
        loadPage('vault', function() {
          console.log("Success: Vault Page Loaded");
          $("#vault-nav").toggleClass("disabled selected");
          $("#swap-nav").toggleClass("disabled");

          $(".paper-crypto:last").css({
            "margin-right": $("#crypto-list").css("margin-left")
          });
        });
      });
      $("#slider").toggleClass("slider-active");
      seed = $("#unlock").find("textarea").val();
      if (ticker == "btc") {
        foo.unlock(seed);
      } else if (ticker == "ltc") {
        litecoin.unlock(seed);
      }
    }
  });

  // CREATE BUTTON CONFIRM CLICKED
  $(document).on("click", "#create-button-confirm", function() {
    $("#create").toggleClass("frame-center frame-left").one('transitionend', function() {
      $("#unlock").toggleClass("frame-center frame-right"); // Add frame-center, Remove frame-right
    });
  });

  // SEND BUTTON
  $(document).on("click", "#send-button", function() {
    $("#send").toggleClass("frame-center frame-right");
    $("#slider").toggleClass("slider-active");
  });

  // SEND MONEY BUTTON
  $(document).on("click", "#send-money", function() {
    if (ticker == "btc") {
      foo.send($("#send-address").val(), $("#send-amount").val(), $("#send-fee").val())
    } else if (ticker == "ltc") {
      litecoin.send($("#send-address").val(), $("#send-amount").val(), $("#send-fee").val())
    }
  });

  // RECEIVE BUTTON
  $(document).on("click", "#receive-button", function() {
    if (ticker == "btc") {
      var address = foo.getAddress();
    } else if (ticker == "ltc") {
      var address = litecoin.getAddress();
    }
    document.getElementById('qrcode').innerHTML = "";
    document.getElementById('address-string').value = address;
    var qrcode = new QRCode("qrcode");
    qrcode.makeCode(address);

    $("#receive").toggleClass("frame-center frame-right");
    $("#slider").toggleClass("slider-active");
  });

  // SWAP LEFT CRYPTO CURRENCY ICON CLICKED
  $(document).on("click", "#left-coin", function() {
    $("#crypto-select").toggleClass("frame-center frame-right"); // Add frame-center, Remove frame-right
    $("#slider").toggleClass("slider-active");
  });

  // SWAP RIGHT CRYPTO CURRENCY ICON CLICKED
  $(document).on("click", "#right-coin", function() {
    $("#crypto-select").toggleClass("frame-center frame-right"); // Add frame-center, Remove frame-right
    $("#slider").toggleClass("slider-active");
  });


  // SWITCH ICON CLICKED
  $(document).on("click", ".switch", function() {
    $("#crypto-select").toggleClass("frame-center frame-right"); // Add frame-center, Remove frame-right
    $("#slider").toggleClass("slider-active");
  });

  // EXIT BUTTON CLICKED
  $(document).on("click", ".exit", function() {
    $(this).parent().parent().toggleClass("frame-center frame-right");
    if ($("#create").hasClass("frame-right") == false) {
      $("#create").toggleClass("frame-left frame-right");
    } else {

    }
    $("#slider").toggleClass("slider-active");
  });

  // LITECOIN (TAB) CLICKED
  $(document).on("click", "#litecoin", function() {
    ticker = "ltc";
    if ($(this).hasClass("selected-crypto") == false) {
      $(".paper-crypto").removeClass("selected-crypto");
      $(this).toggleClass("selected-crypto");
      litecoin.unlock(seed);
    }
  });

  // BITCOIN (TAB) CLICKED
  $(document).on("click", "#bitcoin", function() {
    ticker = "btc";
    if ($(this).hasClass("selected-crypto") == false) {
      $(".paper-crypto").removeClass("selected-crypto");
      $(this).toggleClass("selected-crypto");
      foo.unlock(seed)
    }
  });
});
