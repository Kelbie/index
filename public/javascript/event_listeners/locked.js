function slideOn(params) {
    // Add styles to move slider from the right to the center
    $(params.target).toggleClass("frame-right frame-center")
    // Activates the slider
    if (params.toggleSlider) {
       $("#slider").toggleClass("slider-active");
    }
}

function slideOff(params) {
    // Add styles to move slider from the center to the left
    if (params.reversed) { // reversed = true
        $(params.target).toggleClass("frame-right frame-center").one('transitionend', params.callback); // callback is what runs after the transition
    } else { // normal
        $(params.target).toggleClass("frame-left frame-center").one('transitionend', params.callback); // callback is what runs after the transition
    }
    // Activates the slider
    if (params.toggleSlider) {
        $("#slider").toggleClass("slider-active");
    }
}

$(document).ready(function() {
    loadPage('locked', function() {}); // load locked page

    // UNLOCK BUTTON CLICKED
    $(document).on('click', '#unlock-button', function() {
        console.log("unlock")
        slideOn({
            target: "#unlock",
            toggleSlider: true
        })
    });

    // CREATE BUTTON CLICKED
    $(document).on('click', '#create-button', function() {
        slideOn({
            target: "#create",
            toggleSlider: true
        });
        $("#create").find("textarea").val(foo.createSeed());
    });

    // UNLOCK BUTTON CONFIRM CLICKED
    $(document).on("click", "#unlock-button-confirm", function() {
        if (foo.validateSeed($("#unlock").find("textarea").val())) { // if the seed is valid
            slideOff({
                target: "#unlock",
                toggleSlider: true,
                callback: function() {
                    loadPage('vault', function() { // after load run function
                        // remove disabled class from navigation buttons and make vault selected
                        $("#vault-nav").toggleClass("disabled selected");
                        $("#swap-nav").toggleClass("disabled");

                        // $(".paper-crypto:last").css({
                        //     "margin-right": $("#crypto-list").css("margin-left")
                        // });
                    });
                }
            })
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
        slideOff({ // Create menu slides off
            target: "#create",
            toggleSlider: false,
            callback: function() {
                slideOn({ // Unlock menu slides on
                    target: "#unlock",
                    toggleSlider: false
                });
                $("#create").toggleClass("frame-left frame-right") // moves create back to default position
            }
        })
    });

    // EXIT BUTTON CLICKED
    $(document).on("click", ".exit", function() {
        console.log("unlocked")
        slideOff({
            target: $(this).parent().parent(),
            toggleSlider: true,
            reversed: true
        });
    });


});
