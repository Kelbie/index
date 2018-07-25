$(document).ready(function() {
    loadPage('locked', function() {}); // load locked page

    // UNLOCK BUTTON CLICKED
    $(document).on('click', '#unlock-button', function() {
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
        $("#create").find("textarea").val(bitcoin.createSeed());
    });

    // UNLOCK BUTTON CONFIRM CLICKED
    $(document).on("click", "#unlock-button-confirm", function() {
        console.log("unlock button")
        if (ticker_to_class[ticker].validateSeed($("#unlock").find("textarea").val())) { // if the seed is valid
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
            ticker_to_class[ticker].unlock(seed);
        } else {
            $("#input-seed").css({
              "border-color": "red"
            });
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
        slideOff({
            target: $(this).parent().parent(),
            toggleSlider: true,
            reversed: true
        });
    });

    // VALIDATE SEED https://stackoverflow.com/questions/11338592/how-can-i-bind-to-the-change-event-of-a-textarea-in-jquery
    var oldVal = "";
    $(document).on("change keyup paste", "#input-seed", function() {
      var currentVal = $(this).val();
      if (currentVal == oldVal) {
        return; //check to prevent multiple simultaneous triggers
      }

      oldVal = currentVal;
      //action to be performed on textarea changed
      if (ticker_to_class[ticker].validateSeed(currentVal)) {
        $(this).css({
          "border-color": "green"
        });
      } else {
        $(this).css({
          "border-color": "red"
        });
      }
    });

    $(document).on("change keyup paste", "#send-address, #send-amount, #send-fee", function() {
        console.log("rpess")
      var currentVal = $(this).val();
      if (currentVal == oldVal) {
        return; //check to prevent multiple simultaneous triggers
      }

      oldVal = currentVal;
      //action to be performed on textarea changed
      if (ticker_to_class[ticker].validateAddress($("#send-address").val())) {
          $("#send-address").css({
            "border-color": "green"
          });
      } else {
          $("#send-address").css({
            "border-color": "red"
          });
      }
      if (ticker_to_class[ticker].validateSend(
          $("#send-amount").val(),
          $("#send-fee").val())) {
        $("#send-amount, #send-fee").css({
          "border-color": "green"
        });
      } else {
        $("#send-amount, #send-fee").css({
          "border-color": "red"
        });
      }
    });


});
