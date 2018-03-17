# Problems
I was using a blurred background for the slider but the problem was that it was very laggy so I had to remove them.

I had a problem linking styles together so I had to use event listener code I found on stackoverflow in order to start a new animation at the end of another.

When I first used ajax to load the webpage I tried updating the background content but when I did that it interrupted it. Adding the load() function inside the event listener fixed that.

When I try and to set the contents of a div (qrcode) to none it gives this error `_slide.js:59 Uncaught TypeError: Cannot set property 'innerHTML' of null`. This is not really a problem though since its only happens the first time the function is called and doesn't cause issues every time after that since the html has fully loaded at that point. This error doesn't crash the program it just continues. I could add error correction for completeness.

When I started doing the transitions I used js and html but my code started getting messy and it wasn't obvious where actions were being called from so I decided to use jquery. I will be able to organise them better in folders which will help me maintain the project.

Currently my website allows buttons to be clicked even thought the cursor has a 'not-allowed' icon appear over the button so I am going to have to add validation in the jquery to check that the button should be clickable.

I have started implementing the private keys on my application and originally I thought the only library I would need it bitcoinjs-lib but I actually needed a library names bip39 because that library is not included in bitcoinjs-lib. I used browserify in order to make both libraries work in the browser.
