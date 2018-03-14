// Source: https://stackoverflow.com/questions/15617970/wait-for-css-transition
function whichTransitionEvent(id){
    var t;
    var el = document.getElementById(id);
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

function slide_next(id_off, id_on) {
    var transitionEnd = whichTransitionEvent(id_off);
    document.getElementById(id_off).addEventListener(transitionEnd, function _() {
        document.getElementById(id_off).style.cssText = "transition-duration: 0s; transform: translateX(100%); opacity: 0;";
        slide(id_on);
        document.getElementById(id_off).removeEventListener(transitionEnd, _);
    }, false);

    document.getElementById(id_off).style.cssText = "transition-duration: 0.5s; transform: translateX(-100%)";
}

function renderQR() {
    document.getElementById('qrcode').innerHTML = "";
    var qrcode = new QRCode("qrcode");
    qrcode.makeCode("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
}
