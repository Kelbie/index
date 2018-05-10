function displayExchangeRates(update) {
    currentVal = parseFloat($("#swap-send-amount").val()) || 0.00 // get input
    // This estimates the amount you are sending in pounds
    callback = function () {
        if (ticker == "btc") { // if btc is being swapped
            $("#swap-receive-amount").val((currentVal * SWAP_EXCHANGE_RATE).toFixed(8) || 0.00) // calculates amount of crypto you would receive
            // estimates the received amount in pounds
            $("#swap-receive-amount-native").val(($("#swap-receive-amount").val() * ticker_to_price["ltc"]).toFixed(2) || 0.00)
        } else if (ticker == "ltc") { // if ltc is being swapped
            $("#swap-receive-amount").val((currentVal * SWAP_EXCHANGE_RATE).toFixed(8) || 0.00) // calculates amount of crypto you would receive
            // estimates the received amount in pounds
            $("#swap-receive-amount-native").val(($("#swap-receive-amount").val() * ticker_to_price["btc"]).toFixed(2) || 0.00)
        }
        console.log((currentVal * ticker_to_price[ticker]).toFixed(2) || 0.00)
        $("#swap-send-amount-native").val((currentVal * ticker_to_price[ticker]).toFixed(2) || 0.00)
    }
    if (update) { // if true this will call the server for a new quote
        if (ticker == "btc") { // if btc is being swapped
            swap.getMarketInfo("btc_ltc", function(marketInfo) {
                SWAP_EXCHANGE_RATE = parseFloat(marketInfo.rate)
                SWAP_MINIMUM_AMOUNT = parseFloat(marketInfo.minimum)
                SWAP_MINER_FEE = parseFloat(marketInfo.minerFee)
                callback() // displays result
            });
        } else if (ticker == "ltc") { // if ltc is being swapped
            swap.getMarketInfo("ltc_btc", function(marketInfo) {
                SWAP_EXCHANGE_RATE = parseFloat(marketInfo.rate)
                SWAP_MINIMUM_AMOUNT = parseFloat(marketInfo.minimum)
                SWAP_MINER_FEE = parseFloat(marketInfo.minerFee)
                callback() // displays result
            });
        }
    } else {
        callback() // displays result
    }
    console.log(1, SWAP_EXCHANGE_RATE, SWAP_MINIMUM_AMOUNT, SWAP_MINER_FEE)
}

$(document).ready(function() {
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
        if (ticker == "btc") {
            ticker = "ltc";
        } else if (ticker == "ltc") {
            ticker = "btc";
        }
        displayExchangeRates(true);

        // Stores the coin details (for swapping later)
        var left_img = $("#left-coin>img").attr('src');
        var left_title = $("#left-coin>h2").html();
        var right_img = $("#right-coin>img").attr('src');
        var right_title = $("#right-coin>h2").html();

        // Swaps the images and titles and displays it
        $("#left-coin>img").attr('src', right_img)
        $("#left-coin>h2").html(right_title)
        $("#right-coin>img").attr('src', left_img)
        $("#right-coin>h2").html(left_title)
    });

    // COMPUTE EXCHANGE RATE https://stackoverflow.com/questions/11338592/how-can-i-bind-to-the-change-event-of-a-textarea-in-jquery
    var oldVal = "";
    $(document).on("change keyup paste", "#swap-send-amount", function() {
        var currentVal = $(this).val();
        if (currentVal == oldVal) {
            return; //check to prevent multiple simultaneous triggers
        }

        oldVal = currentVal;
        displayExchangeRates(false)
    });

    // SWAP BUTTON
    $(document).on("click", "#swap-button", function() {
        console.log("swap")
        swap.swap(parseFloat($("#swap-send-amount").val()))
    });

});
