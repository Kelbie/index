$(document).ready(function() {
    // VAULT NAV BUTTON CLICKED
    $(document).on("click", "#vault-nav", function() {
        if (!$("#vault-nav")[0].className.includes("disabled")) { // if button is not disabled
            $("#slider").removeClass("slider-active");
            loadPage('vault', function() { // then load the vault page
                $("#swap-nav").removeClass("selected");
                $("#vault-nav").addClass("selected");
                ticker = "btc";
                // unlock cryptocurrency depending what the ticker is set to
                ticker_to_class[ticker].unlock(seed);
            });
        }
    });

    // SWAP NAV BUTTON CLICKED
    $(document).on("click", "#swap-nav", function() {
        if (!$("#swap-nav")[0].className.includes("disabled")) { // if button is not disabled
            $("#slider").removeClass("slider-active");
            loadPage('swap', function() { // then load page
                $("#vault-nav").removeClass("selected");
                $("#swap-nav").addClass("selected");
                // this is mainly so the swap page can know what the current value of other cryptocurrencies are
                // and so it can create transactions in order to do the swaps
                litecoin.unlock(seed)
                // this is to fix a bug on the input button on the nav page,
                // without this it sometimes doesn't realise you inputed a new value
                // becasue it was the same as a value you entered a previous time.
                var oldVal = "";
                // Set ticker to btc so it matches what the user sees on that page
                displayExchangeRates(true);
            });
        }
    });
});
