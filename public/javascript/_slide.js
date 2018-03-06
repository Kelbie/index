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

function slide(id) {
    document.getElementById(id).style.cssText = "opacity: 0;";
    document.getElementById(id).style.transitionDuration = "0.5s";
    document.getElementById(id).style.cssText = "transform: translateX(0%); opacity: 1;";
    document.getElementById("slider").style.height = "100vh";
}

function reverse_slide(id, next) {
    next = next || 0;
    var transitionEnd = whichTransitionEvent(id);
    document.getElementById(id).addEventListener(transitionEnd, function _() {
        document.getElementById(id).style.cssText = "transition-duration: 0s; transform: translateX(100%); opacity: 0;";
        document.getElementById(id).removeEventListener(transitionEnd, _);
        if (next) {
            load('vault');
            var vault_nav = document.getElementById("vault-nav");
            var swap_nav = document.getElementById("swap-nav");
            vault_nav.classList.remove("disabled");
            swap_nav.classList.remove("disabled");
            vault_nav.classList.add("selected");
        }
        document.getElementById("slider").style.height = "1vh";
    }, false);

    document.getElementById(id).style.cssText = "transition-duration: 0.5s; transform: translateX(-100%)";
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
