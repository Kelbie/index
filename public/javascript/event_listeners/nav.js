$(document).ready(function() {
    // VAULT NAV BUTTON CLICKED
    $(document).on("click", "#vault-nav", function() {
        $("#slider").removeClass("slider-active");
        if (!$("#vault-nav")[0].className.includes("disabled")) { // if button is not disabled
            loadPage('vault', function() { // then load the vault page
                $("#swap-nav").removeClass("selected");
                $("#vault-nav").addClass("selected");
                // unlock cryptocurrency depending what the ticker is set to
                ticker_to_class[ticker].unlock(seed);
            });
        }
    });

    // SWAP NAV BUTTON CLICKED
    $(document).on("click", "#swap-nav", function() {
        $("#slider").removeClass("slider-active");
        if (!$("#swap-nav")[0].className.includes("disabled")) { // if button is not disabled
            loadPage('swap', function() { // then load page
                $("#vault-nav").removeClass("selected");
                $("#swap-nav").addClass("selected");
            });
        }
    });
});
