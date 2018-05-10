var SWAP_EXCHANGE_RATE;
var SWAP_MINIMUM_AMOUNT;
var SWAP_MINER_FEE;
var seed = "";
var ticker = "btc";

var ticker_to_class = {
    // relationships between the tickers and the methods
    "btc": foo,
    "ltc": litecoin
}

var id_to_ticker = {
    // relationships between the ids and the tickers
    "#bitcoin": "btc",
    "#litecoin": "ltc"
}

var ticker_to_price = {
    "btc": 0,
    "ltc": 0
}

function slideOn(params) {
    /* Function : slideOn
     * ------------------
     * This slides the paper containers onto the screen
     *
     * params.target (string) : this is the id that is being targeted
     * params.toggleSlider (boolean) : this decides if the slider is activated on or off
     */
    // Add styles to move slider from the right to the center
    $(params.target).toggleClass("frame-right frame-center")
    // Activates the slider
    if (params.toggleSlider) {
       $("#slider").toggleClass("slider-active");
    }
}

function slideOff(params) {
    /* Function : slideOff
     * -------------------
     * This slides the paper containers off the screen
     *
     * params.target (string) : this is the id that is being targeted
     * params.toggleSlider (boolean) : this decides if the slider is activated on or off
     * params.callback (function) : this is code that is to be run after the transition has occured
     * params.reversed (boolean) : this slides off left or right
     */
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
