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
