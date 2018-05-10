$(document).ready(function() {
    // SEND BUTTON
    $(document).on("click", "#send-button", function() {
        slideOn({
            target: "#send",
            toggleSlider: true
        });
    });

    // SEND MONEY BUTTON
    $(document).on("click", "#send-money", function() {
        ticker_to_class[ticker].send(
            $("#send-address").val(), // Address
            $("#send-amount").val(), // Amount
            $("#send-fee").val()) // Fee
    });

    // RECEIVE BUTTON
    $(document).on("click", "#receive-button", function() {
        var address = ticker_to_class[ticker].getAddress();
        console.log("LTC", address)
        $('#qrcode').html(""); // make sure qr code space is blank
        $("#address-string").val(address); // shows address to the user
        var qrcode = new QRCode("qrcode");
        qrcode.makeCode(address); // makes qr code using address
        slideOn({
            target: "#receive",
            toggleSlider: true
        });
    });

    // CRYPTOCURRENCY (TAB) CLICKED
    $(document).on("click", "#bitcoin, #litecoin", function() {
        ticker = id_to_ticker["#" + this.id];
        if ($(this).hasClass("selected-crypto") == false) { // checks that its not already selected
            $(".paper-crypto").removeClass("selected-crypto"); // removes selected class from all the elements
            $(this).toggleClass("selected-crypto"); // applies selected class to 'this' element
            ticker_to_class[ticker].unlock(seed);
        }
    });

    // RECEIVED TAB
    $(document).on("click", "#received", function() {
        $("#sent").removeClass("filter-selected")
        $("#all").removeClass("filter-selected")
        $(this).toggleClass("filter-selected")
        displayTransactions(ticker_to_class[ticker].returnTransactions(), "received");
    });

    // SENT TAB
    $(document).on("click", "#sent", function() {
        $("#received").removeClass("filter-selected")
        $("#all").removeClass("filter-selected")
        $(this).toggleClass("filter-selected")
        displayTransactions(ticker_to_class[ticker].returnTransactions(), "sent");
    });

    // SENT TAB
    $(document).on("click", "#all", function() {
        $("#received").removeClass("filter-selected")
        $("#sent").removeClass("filter-selected")
        $(this).toggleClass("filter-selected")
        displayTransactions(ticker_to_class[ticker].returnTransactions(), "all");
    });

});
