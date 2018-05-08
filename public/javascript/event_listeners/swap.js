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
      $("#crypto-select").toggleClass("frame-center frame-right"); // Add frame-center, Remove frame-right
      $("#slider").toggleClass("slider-active");
    });
});
