var seed = "";

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
    $(".balance").find(".crypto-balance").find("span:first").html((crypto_balance / 100000000).toFixed(8))
    $(".balance").find(".native-balance").find("span:first").html(native_balance)
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
            foo.unlock(seed);
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
      foo.send($("#send-address").val(), $("#send-amount").val(), $("#send-fee").val())
    });

    // RECEIVE BUTTON
    $(document).on("click", "#receive-button", function() {
        var address = foo.getAddress()
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
});
