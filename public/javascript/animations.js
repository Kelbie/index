function animateFrame(frame_id, button_id, active, dir, reset) {
    /* Function : animateFrame
     * ----------------
     * Loads frame onto screen were the frame is a container for content
     * and has the class name 'frame'
     *
     * frame_id (string)    : is the ID assosiated with the element that is being targeted
     * button_id (string)   : the id of the button to watch
     * active (boolean)     : true if the content is displayed to the user
     * dir (string)         : the direction the content should come on or off the screen from
     * reset (boolean)      : true if the content should be reset to the origin (to the right and off the screen)
     */

}

function animateSlider(active) {
    /* Function : animateSlider
     * -----------------
     * The slider is the orange screen behind frames
     *
     * active (boolean) : true if the slider is active.
     */
     if (active) {
         $("#slider").addClass("slider-active");
     } else {
         $("#slider").removeClass("slider-active");
     }
}
